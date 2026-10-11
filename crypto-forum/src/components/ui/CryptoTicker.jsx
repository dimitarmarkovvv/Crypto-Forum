import { Box, Flex, Text } from '@chakra-ui/react';
import { useCryptoPrices } from '../../hooks/useCryptoPrices.js';

const formatPrice = (price) => {
    const decimals = price >= 1000 ? 2 : price >= 1 ? 3 : 5;

    return price.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};

function TickerCard({ symbol, price, change }) {
    const isUp = change >= 0;

    return (
        <Box
            flexShrink={0}
            mr="4"
            minW="170px"
            borderWidth="1px"
            borderRadius="lg"
            px="4"
            py="2"
        >
            <Text fontSize="xs" fontWeight="bold" letterSpacing="wide">
                {symbol.replace('USDT', '')}
            </Text>

            <Text fontSize="lg" fontWeight="semibold">
                ${formatPrice(price)}
            </Text>

            <Text fontSize="sm" color={isUp ? 'green.500' : 'red.500'}>
                {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
            </Text>
        </Box>
    );
}

export function CryptoTicker() {
    const prices = useCryptoPrices();
    const coins = Object.entries(prices);

    if (coins.length === 0) {
        return null;
    }

    return (
        <Box overflow="hidden" mt={8} py="1">
            <Flex
                width="max-content"
                animation="ticker-scroll 40s linear infinite"
                _hover={{ animationPlayState: 'paused' }}
            >
                {[...coins, ...coins].map(([symbol, data], index) => (
                    <TickerCard
                        key={index}
                        symbol={symbol}
                        price={data.price}
                        change={data.change}
                    />
                ))}
            </Flex>
        </Box>
    );
}
