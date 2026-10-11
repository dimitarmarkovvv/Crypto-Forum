import { useRef, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { formatPrice } from '../../constants/coins.js';

const WIDTH = 100;
const HEIGHT = 40;

const formatTime = (time) =>
    new Date(time).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });

function PriceChart({ points, color }) {
    const [hoverIndex, setHoverIndex] = useState(null);
    const containerRef = useRef(null);

    if (!points || points.length < 2) {
        return <Box height="80px" />;
    }

    const values = points.map((point) => point.price);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;

    const toX = (index) => (index / (points.length - 1)) * WIDTH;
    const toY = (value) => HEIGHT - ((value - min) / span) * HEIGHT;

    const line = values.map((value, index) => `${toX(index)},${toY(value)}`).join(' ');
    const area = `0,${HEIGHT} ${line} ${WIDTH},${HEIGHT}`;

    const gradientId = `chart-gradient-${color.replace('.', '-')}`;

    const handleMove = (event) => {
        const rect = containerRef.current.getBoundingClientRect();
        const ratio = (event.clientX - rect.left) / rect.width;
        const index = Math.round(ratio * (points.length - 1));

        setHoverIndex(Math.max(0, Math.min(points.length - 1, index)));
    };

    const hovered = hoverIndex === null ? null : points[hoverIndex];

    const hoverLeft = hoverIndex === null ? 0 : (hoverIndex / (points.length - 1)) * 100;
    const hoverTop = hovered === null ? 0 : (1 - (hovered.price - min) / span) * 100;

    return (
        <Box
            ref={containerRef}
            position="relative"
            height="80px"
            color={color}
            onMouseMove={handleMove}
            onMouseLeave={() => setHoverIndex(null)}
        >
            <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                preserveAspectRatio="none"
                width="100%"
                height="100%"
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                </defs>

                <polygon points={area} fill={`url(#${gradientId})`} />

                <polyline
                    points={line}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            {hovered && (
                <>
                    <Box
                        position="absolute"
                        top="0"
                        bottom="0"
                        left={`${hoverLeft}%`}
                        width="1px"
                        bg="currentColor"
                        opacity={0.4}
                        pointerEvents="none"
                    />

                    <Box
                        position="absolute"
                        left={`${hoverLeft}%`}
                        top={`${hoverTop}%`}
                        transform="translate(-50%, -50%)"
                        width="8px"
                        height="8px"
                        borderRadius="full"
                        bg="currentColor"
                        pointerEvents="none"
                    />

                    <Box
                        position="absolute"
                        left={`${hoverLeft}%`}
                        bottom="100%"
                        transform={
                            hoverLeft > 70
                                ? 'translate(-100%, -4px)'
                                : hoverLeft < 30
                                    ? 'translate(0, -4px)'
                                    : 'translate(-50%, -4px)'
                        }
                        bg="bg.panel"
                        borderWidth="1px"
                        borderRadius="md"
                        px="2"
                        py="1"
                        whiteSpace="nowrap"
                        pointerEvents="none"
                        zIndex="docked"
                    >
                        <Text fontSize="sm" fontWeight="bold" color="fg">
                            ${formatPrice(hovered.price)}
                        </Text>

                        <Text fontSize="xs" color="fg.muted">
                            {formatTime(hovered.time)}
                        </Text>
                    </Box>
                </>
            )}
        </Box>
    );
}

export default PriceChart;