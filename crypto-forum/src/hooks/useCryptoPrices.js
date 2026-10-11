import { useEffect, useState } from 'react';

export function useCryptoPrices() {
    const [prices, setPrices] = useState({});

    useEffect(() => {
        const ws = new WebSocket(
            'wss://stream.binance.com:9443/stream?streams=' +
            'btcusdt@ticker/ethusdt@ticker/solusdt@ticker/xrpusdt@ticker/bnbusdt@ticker/adausdt@ticker'
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