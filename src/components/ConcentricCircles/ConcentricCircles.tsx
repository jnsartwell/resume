import React, {useState, useMemo, useEffect} from 'react';
import Circle, {CircleProps} from "./Circle.tsx";
import Quadrant from "./Quadrant.tsx";

interface ConcentricCirclesProps {
    strokeWidth?: number;
    color?: string;
    children: React.ReactNode;
    size?: number;
    categories: { [key: string]: unknown }
}

const ConcentricCircles: React.FC<ConcentricCirclesProps> = ({
                                                                 strokeWidth,
                                                                 color,
                                                                 children,
                                                                 size = 300,
                                                                 categories
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

    const categoryNames = useMemo(() => Object.keys(categories), [categories]);
    const angle = useMemo(() => 360 / categoryNames.length, [categoryNames]);

    return (

        <svg width={totalSize} height={totalSize}>
            {categoryNames.map((_, index) => (
                <path // Use <path> instead of <line>
                    key={index}
                    d={`M ${totalSize / 2} ${totalSize / 2} L ${totalSize / 2 + Math.cos((angle * index * Math.PI) / 180) * (totalSize / 2)} ${totalSize / 2 + Math.sin((angle * index * Math.PI) / 180) * (totalSize / 2)}`}
                    stroke="white"
                    strokeWidth="1"
                />
            ))}

            {categoryNames.map((category, index) => {
                const textAngle = angle * index + angle / 2; // Center the text in the slice
                const x = totalSize / 2 + Math.cos((textAngle * Math.PI) / 180) * (totalSize / 2 * 0.6); // Adjust position
                const y = totalSize / 2 + Math.sin((textAngle * Math.PI) / 180) * (totalSize / 2 * 0.6);
                return (
                    <Quadrant key={index} name={category} x={x} y={y}/>
                );
            })}
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

    );
};

export default ConcentricCircles;