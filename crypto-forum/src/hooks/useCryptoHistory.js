import { useEffect, useState } from 'react';
import { COINS } from '../constants/coins.js';

const BASE = 'https://api.binance.com/api/v3/klines';

export function useCryptoHistory(interval = '1h', limit = 24) {
    const [history, setHistory] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            setLoading(true);

            try {
                const results = await Promise.all(
                    COINS.map(async ({ symbol }) => {
                        const url =
                            `${BASE}?symbol=${symbol}&interval=${interval}&limit=${limit}`;

                        const response = await fetch(url);

                        if (!response.ok) {
                            throw new Error(`Failed to load ${symbol}: ${response.status}`);
                        }

                        const candles = await response.json();

                        return [
                            symbol,
                            candles.map((candle) => ({
                                time: candle[0],
                                price: parseFloat(candle[4]),
                            })),
                        ];
                    })
                );

                if (!ignore) {
                    setHistory(Object.fromEntries(results));
                }
            } catch (error) {
                console.error('Failed to load price history:', error.message);
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            ignore = true;
        };
    }, [interval, limit]);

    return { history, loading };
};