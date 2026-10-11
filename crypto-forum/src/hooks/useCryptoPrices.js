import { useEffect, useState } from 'react';
import { COINS } from '../constants/coins.js';

export function useCryptoPrices() {
    const [prices, setPrices] = useState({});

    useEffect(() => {
        const streams = COINS
            .map(({ symbol }) => `${symbol.toLowerCase()}@ticker`)
            .join('/');

        const ws = new WebSocket(
            `wss://stream.binance.com:9443/stream?streams=${streams}`
        );


        ws.onmessage = (e) => {
            const d = JSON.parse(e.data).data;

            setPrices(prev => ({
                ...prev,
                [d.s]: { price: parseFloat(d.c), change: parseFloat(d.P) }
            }));
        };

        return () => ws.close();
    }, []);

    return prices;
};