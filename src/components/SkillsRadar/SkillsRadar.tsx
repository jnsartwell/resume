import React, {useMemo} from 'react';

interface Skill {
    name: string;
}

interface SkillsRadarProps {
    size?: number;
    skills: { [key: string]: { [key: string]: Skill[] } }; // Updated skills prop type
}

const SkillsRadar: React.FC<SkillsRadarProps> = ({
                                                     size = 300,
                                                     skills,
                                                 }: SkillsRadarProps) => {
    const skillLevels = useMemo(() => Object.keys(skills), [skills]);
    const skillCategories = useMemo(() => {
        const allCategories: string[] = [];
        for (const level in skills) {
            allCategories.push(...Object.keys(skills[level]));
        }
        return Array.from(new Set(allCategories)); // Get unique categories
    }, [skills]);

    const numLevels = skillLevels.length;
    const numCategories = skillCategories.length;
    const angle = 360 / numCategories;

    // Generate unique colors for each skill category
    const categoryColors = useMemo(() => {
        const colors: { [key: string]: string } = {};
        skillCategories.forEach((category, index) => {
            const hue = (index / numCategories) * 360;
            colors[category] = `hsl(${hue}, 70%, 60%)`;
        });
        return colors;
    }, [skillCategories, numCategories]);

    // Calculate radii for each skill level
    const levelRadii = useMemo(() => {
        const radii: number[] = [];
        const radiusStep = size / 2 / numLevels;
        for (let i = 1; i <= numLevels; i++) {
            radii.push(radiusStep * i);
        }
        return radii;
    }, [size, numLevels]);

    // Render sector lines
    const renderSectorLines = () => (
        <>
            {skillCategories.map((_, index) => (
                <line
                    key={index}
                    x1={size / 2}
                    y1={size / 2}
                    x2={size / 2 + Math.cos((angle * index * Math.PI) / 180) * (size / 2)}
                    y2={size / 2 + Math.sin((angle * index * Math.PI) / 180) * (size / 2)}
                    stroke="white"
                    strokeWidth="1"
                />
            ))}
        </>
    );

    // Render sector names
    const renderSectorNames = () => (
        <>
            {skillCategories.map((category, index) => {
                const textAngle = angle * index + angle / 2;
                const radius = size / 2;

                // Calculate path for the text
                const pathId = `sector-path-${index}`;
                const pathStartX = size / 2 + Math.cos((textAngle * Math.PI) / 180) * radius;
                const pathStartY = size / 2 + Math.sin((textAngle * Math.PI) / 180) * radius;
                const pathEndX = size / 2 + Math.cos(((textAngle + angle / 2) * Math.PI) / 180) * radius; // Adjust end angle for spacing
                const pathEndY = size / 2 + Math.sin(((textAngle + angle / 2) * Math.PI) / 180) * radius; // Adjust end angle for spacing

                return (
                    <>
                        <path
                            id={pathId}
                            d={`M ${pathStartX},${pathStartY} A ${radius},${radius} 0 0 1 ${pathEndX},${pathEndY}`}
                            fill="none"
                            stroke="none"
                        />
                        <text
                            fontSize="14"
                            fontWeight="bold"
                            dominantBaseline="central"
                            fill="grey"
                        >
                            <textPath href={`#${pathId}`} >
                                {category}
                            </textPath>
                        </text>
                    </>
                );
            })}
        </>
    );

    // Render skill names
    const renderSkillNames = () => (
        <>
            {skillLevels.map((level, levelIndex) => {
                const levelRadius = levelRadii[levelIndex];
                return Object.entries(skills[level]).map(([category, skills]) => {
                    const categoryAngle = angle * skillCategories.indexOf(category);
                    const skillAngleStep = angle / skills.length;
                    return skills.map((skill, skillIndex) => {
                        const skillAngle = categoryAngle + skillAngleStep * skillIndex + skillAngleStep / 2;
                        const x = size / 2 + Math.cos((skillAngle * Math.PI) / 180) * (levelRadius * 0.7);
                        const y = size / 2 + Math.sin((skillAngle * Math.PI) / 180) * (levelRadius * 0.7);
                        return (
                            <text
                                key={`${level}-${category}-${skillIndex}`}
                                x={x}
                                y={y}
                                dominantBaseline="middle"
                                textAnchor="middle"
                                fontSize="8"
                                fontWeight="bold"
                                fill={categoryColors[category]}
                            >
                                {skill.name}
                            </text>
                        );
                    });
                });
            })}
        </>
    );

    // Render circles for skill levels
    const renderCircles = () => (
        <>
            {levelRadii.map((radius, index) => (
                <circle
                    key={index}
                    cx="50%"
                    cy="50%"
                    r={radius}
                    strokeWidth={1}
                    stroke="#505050"
                    fill="none"
                />
            ))}
        </>
    );

    return (
        <svg width={size} height={size}>
            {renderSectorLines()}
            {renderSectorNames()}
            {renderCircles()}
            {renderSkillNames()}
        </svg>
    );
};

export default SkillsRadar;