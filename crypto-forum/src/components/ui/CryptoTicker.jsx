import { Box, Flex, Text } from '@chakra-ui/react';
import { useCryptoPrices } from '../../hooks/useCryptoPrices.js';
import { COINS, formatPrice } from '../../constants/coins.js';
import CoinIcon from './CoinIcon.jsx';

function TickerCard({ symbol, color, price, change }) {
    const isUp = change >= 0;

    return (
        <Flex
            align="center"
            gap="3"
            flexShrink={0}
            mr="4"
            minW="190px"
            borderWidth="1px"
            borderRadius="lg"
            px="4"
            py="2"
        >
            <CoinIcon symbol={symbol} color={color} size="8" />

            <Box>
                <Text fontSize="xs" fontWeight="bold" letterSpacing="wide">
                    {symbol.replace('USDT', '')}
                </Text>

                <Text fontSize="md" fontWeight="semibold">
                    ${formatPrice(price)}
                </Text>

                <Text fontSize="xs" color={isUp ? 'green.500' : 'red.500'}>
                    {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                </Text>
            </Box>
        </Flex>
    );
}

export function CryptoTicker() {
    const prices = useCryptoPrices();
    const coins = COINS.filter(({ symbol }) => prices[symbol]);

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
                {[...coins, ...coins].map(({ symbol, color }, index) => (
                    <TickerCard
                        key={index}
                        symbol={symbol}
                        color={color}
                        price={prices[symbol].price}
                        change={prices[symbol].change}
                    />
                ))}
            </Flex>
        </Box>
    );
}
