import React from "react";

interface QuadrantProps {
    name: string;
    x: number;
    y: number;
}

const Quadrant: React.FC<QuadrantProps> = ({ name, x, y }) => {
    return (
        <text
            x={x}
            y={y}
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
        >
            {name}
        </text>
    );
};

export default Quadrant;