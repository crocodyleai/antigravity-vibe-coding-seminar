interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    style?: React.CSSProperties;
}

export const Skeleton = ({ width = '100%', height = '1rem', borderRadius = '0.5rem', style }: SkeletonProps) => {
    return (
        <div
            className="animate-pulse"
            style={{
                width,
                height,
                borderRadius,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                ...style
            }}
        />
    );
};
