export const CATEGORIES = [
    { id: 'major', label: 'Majors' },
    { id: 'meme', label: 'Meme coins' },
];

export const COINS = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', category: 'major', color: '#F7931A' },
    { symbol: 'ETHUSDT', name: 'Ethereum', category: 'major', color: '#627EEA' },
    { symbol: 'SOLUSDT', name: 'Solana', category: 'major', color: '#9945FF' },
    { symbol: 'XRPUSDT', name: 'XRP', category: 'major', color: '#5E6C7A' },
    { symbol: 'BNBUSDT', name: 'BNB', category: 'major', color: '#C99400' },
    { symbol: 'ADAUSDT', name: 'Cardano', category: 'major', color: '#0033AD' },

    { symbol: 'DOGEUSDT', name: 'Dogecoin', category: 'meme', color: '#B99C2E' },
    { symbol: 'SHIBUSDT', name: 'Shiba Inu', category: 'meme', color: '#E8590C' },
    { symbol: 'PEPEUSDT', name: 'Pepe', category: 'meme', color: '#3D8130' },
    { symbol: 'WIFUSDT', name: 'dogwifhat', category: 'meme', color: '#A3835F' },
    { symbol: 'BONKUSDT', name: 'Bonk', category: 'meme', color: '#D97706' },
    { symbol: 'FLOKIUSDT', name: 'Floki', category: 'meme', color: '#C98A1E' },
];

export const formatPrice = (price) => {
    const decimals =
        price >= 1000 ? 2 :
        price >= 1 ? 3 :
        price >= 0.01 ? 5 :
        8;

    return price.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};
