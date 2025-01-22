import React from "react";

interface CircleProps {
    strokeWidth?: number;
    stroke?: string;
    fill?: string;
    color?: string;
    gap: number;
    cx?: number | string; // Add cx and cy to CircleProps
    cy?: number | string;
    r?: number;
}

const Circle: React.FC<CircleProps> = (props: CircleProps) => {
    return <circle {...props} />;
};

export default Circle;
export type {CircleProps};
