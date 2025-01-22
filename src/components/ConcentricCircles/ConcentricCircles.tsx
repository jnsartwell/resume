import React, {useState, useMemo, useEffect} from 'react';
import Circle, {CircleProps} from "./Circle.tsx";

interface ConcentricCirclesProps {
    strokeWidth?: number;
    color?: string;
    children: React.ReactNode;
    size?: number;
}

const ConcentricCircles: React.FC<ConcentricCirclesProps> = ({
                                                                 strokeWidth,
                                                                 color,
                                                                 children,
                                                                 size = 300,
                                                             }: ConcentricCirclesProps) => {
    const [totalSize, setTotalSize] = useState(size);

    useEffect(() => {
        setTotalSize(size);
    }, [size]);

    const gaps = useMemo(() => {
        return React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === Circle) {
                return child.props.gap || 0;
            }
            return 0;
        }) as number[];
    }, [children]);

    const totalGap = useMemo(() => {
        return gaps.reduce((sum, gap) => sum + gap, 0);
    }, [gaps]);

    const radii: number[] = useMemo(() => {
        const calculatedRadii: number[] = [];
        let currentRadius = 0;
        gaps.forEach((gap) => {
            currentRadius += (totalSize / 2) * (gap / totalGap);
            calculatedRadii.push(currentRadius);
        });
        return calculatedRadii;
    }, [gaps, totalSize, totalGap]);

    return (
        <div>
            <svg width={totalSize} height={totalSize}>
                {React.Children.toArray(children).reverse().map((child, index) => {
                    if (React.isValidElement<CircleProps>(child) && child.type === Circle) {
                        const radius = radii[index];
                        return React.cloneElement<CircleProps>(child, {
                            cx: "50%",
                            cy: "50%",
                            r: radius,
                            strokeWidth: child.props.strokeWidth || strokeWidth,
                            stroke: child.props.color || color,
                            fill: "none",
                        });
                    }
                    return child;
                })}
            </svg>
        </div>
    );
};

export default ConcentricCircles;