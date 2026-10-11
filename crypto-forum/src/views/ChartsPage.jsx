import { useState } from 'react';
import {
    Badge,
    Box,
    Card,
    Center,
    Container,
    Flex,
    Heading,
    NativeSelect,
    SimpleGrid,
    Spinner,
    Stack,
    Text,
} from '@chakra-ui/react';
import { Header } from '../components/ui/Header.jsx';
import PriceChart from '../components/ui/PriceChart.jsx';
import CoinIcon from '../components/ui/CoinIcon.jsx';
import { useCryptoPrices } from '../hooks/useCryptoPrices.js';
import { useCryptoHistory } from '../hooks/useCryptoHistory.js';
import { CATEGORIES, COINS, formatPrice } from '../constants/coins.js';

const RANGES = [
    { value: '1h:24', label: 'Last 24 hours' },
    { value: '1d:30', label: 'Last 30 days' },
    { value: '1m:60', label: 'Last hour' },
];

function CoinCard({ symbol, name, brandColor, points, live }) {
    const isUp = live ? live.change >= 0 : true;
    const color = isUp ? 'green.400' : 'red.400';

    const series = live && points.length > 0
        ? [...points.slice(0, -1), { ...points[points.length - 1], price: live.price }]
        : points;

    return (
        <Card.Root as="article">
            <Card.Body>
                <Flex justify="space-between" align="start" mb={4}>
                    <Flex align="center" gap="3">
                        <CoinIcon symbol={symbol} color={brandColor} />

                        <Box>
                            <Heading size="md">{symbol.replace('USDT', '')}</Heading>

                            <Text fontSize="sm" color="fg.muted">
                                {name}
                            </Text>
                        </Box>
                    </Flex>

                    <Box textAlign="right">
                        <Text fontSize="xl" fontWeight="bold">
                            {live ? `$${formatPrice(live.price)}` : '—'}
                        </Text>

                        {live && (
                            <Badge colorPalette={isUp ? 'green' : 'red'} variant="subtle">
                                {isUp ? '▲' : '▼'} {Math.abs(live.change).toFixed(2)}%
                            </Badge>
                        )}
                    </Box>
                </Flex>

                <PriceChart points={series} color={color} />
            </Card.Body>
        </Card.Root>
    );
}

function ChartsPage() {
    const [range, setRange] = useState('1h:24');
    const [interval, limit] = range.split(':');

    const prices = useCryptoPrices();
    const { history, loading } = useCryptoHistory(interval, Number(limit));

    return (
        <Container maxW="6xl" py={10}>
            <Header />

            <Flex justify="space-between" align="center" mt={8} mb={6} gap="4">
                <Flex align="center" gap="3">
                </Flex>

                <NativeSelect.Root size="sm" maxW="180px">
                    <NativeSelect.Field
                        value={range}
                        onChange={(event) => setRange(event.target.value)}
                    >
                        {RANGES.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                </NativeSelect.Root>
            </Flex>
            
            {loading ? (
                <Center py={20}>
                    <Spinner size="lg" />
                </Center>
            ) : (
                <Stack gap="10">
                    {CATEGORIES.map(({ id, label }) => (
                        <Box key={id} as="section">
                            <Heading
                                size="sm"
                                textTransform="uppercase"
                                letterSpacing="wider"
                                color="fg.muted"
                                mb="4"
                            >
                                {label}
                            </Heading>

                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="6">
                                {COINS.filter((coin) => coin.category === id).map(
                                    ({ symbol, name, color }) => (
                                        <CoinCard
                                            key={symbol}
                                            symbol={symbol}
                                            name={name}
                                            brandColor={color}
                                            points={history[symbol] ?? []}
                                            live={prices[symbol]}
                                        />
                                    )
                                )}
                            </SimpleGrid>
                        </Box>
                    ))}
                </Stack>
            )}
        </Container>
    );
}

export default ChartsPage;
