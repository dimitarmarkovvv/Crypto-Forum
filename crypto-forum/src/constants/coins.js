export const COINS = [
    { symbol: 'BTCUSDT', name: 'Bitcoin' },
    { symbol: 'ETHUSDT', name: 'Ethereum' },
    { symbol: 'SOLUSDT', name: 'Solana' },
    { symbol: 'XRPUSDT', name: 'XRP' },
    { symbol: 'BNBUSDT', name: 'BNB' },
    { symbol: 'ADAUSDT', name: 'Cardano' },
];

export const formatPrice = (price) => {
    const decimals = price >= 1000 ? 2 : price >= 1 ? 3 : 5;

    return price.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};
