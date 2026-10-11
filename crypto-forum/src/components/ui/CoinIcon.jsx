import { Flex, Text } from '@chakra-ui/react';
import {
    SiBitcoin,
    SiEthereum,
    SiSolana,
    SiRipple,
    SiBinance,
    SiCardano,
    SiDogecoin,
} from 'react-icons/si';

const LOGOS = {
    BTCUSDT: SiBitcoin,
    ETHUSDT: SiEthereum,
    SOLUSDT: SiSolana,
    XRPUSDT: SiRipple,
    BNBUSDT: SiBinance,
    ADAUSDT: SiCardano,
    DOGEUSDT: SiDogecoin,
};

function CoinIcon({ symbol, color, size = '10' }) {
    const Logo = LOGOS[symbol];
    const ticker = symbol.replace('USDT', '');

    return (
        <Flex
            width={size}
            height={size}
            borderRadius="full"
            align="center"
            justify="center"
            bg={color}
            color="white"
            flexShrink={0}
        >
            {Logo ? (
                <Logo />
            ) : (
                <Text fontSize="2xs" fontWeight="bold" letterSpacing="tight">
                    {ticker}
                </Text>
            )}
        </Flex>
    );
}

export default CoinIcon;
