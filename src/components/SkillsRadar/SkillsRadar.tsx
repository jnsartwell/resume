import React, { useMemo } from 'react';

interface Skill {
    name: string;
}

interface SkillsRadarProps {
    skills: { [key: string]: { [key: string]: Skill[] } };
}

const SkillsRadar: React.FC<SkillsRadarProps> = ({ skills }: SkillsRadarProps) => {
    const skillCategories = useMemo(() => Object.keys(skills), [skills]);

    const skillLevels = useMemo(() => {
        const allLevels: string[] = [];
        for (const category in skills) {
            allLevels.push(...Object.keys(skills[category]));
        }
        return Array.from(new Set(allLevels));
    }, [skills]);

    const numLevels = skillLevels.length;
    const numCategories = skillCategories.length;
    const angle = 360 / numCategories;

    const categoryColors = useMemo(() => {
        const colors: { [key: string]: string } = {};
        skillCategories.forEach((category, index) => {
            const hue = (index / numCategories) * 360;
            colors[category] = `hsl(${hue}, 70%, 60%)`;
        });
        return colors;
    }, [skillCategories, numCategories]);

    const levelRadii = useMemo(() => {
        const radii: number[] = [];
        const radiusStep = 50 / numLevels;
        for (let i = 1; i <= numLevels; i++) {
            radii.push(radiusStep * i);
        }
        return radii;
    }, [numLevels]);

    const renderSectorLines = () => (
        <>
            {skillCategories.map((_, index) => (
                <line
                    key={index}
                    x1="50"
                    y1="50"
                    x2={50 + Math.cos((angle * index * Math.PI) / 180) * 50}
                    y2={50 + Math.sin((angle * index * Math.PI) / 180) * 50}
                    stroke="white"
                    strokeWidth=".25"
                />
            ))}
        </>
    );

    const renderSectorNames = () => (
        <>
            {skillCategories.map((category, index) => {
                const textAngle = angle * index + angle / 2;
                const radius = 50;

                const pathId = `sector-path-${index}`;
                const pathStartX = 50 + Math.cos((textAngle * Math.PI) / 180) * radius;
                const pathStartY = 50 + Math.sin((textAngle * Math.PI) / 180) * radius;
                const pathEndX = 50 + Math.cos(((textAngle + angle / 2) * Math.PI) / 180) * radius;
                const pathEndY = 50 + Math.sin(((textAngle + angle / 2) * Math.PI) / 180) * radius;

                return (
                    <React.Fragment key={index}>
                        <path
                            id={pathId}
                            d={`M ${pathStartX},${pathStartY} A ${radius},${radius} 0 0 1 ${pathEndX},${pathEndY}`}
                            fill="none"
                            stroke="none"
                        />
                        <text
                            fontSize="2"
                            fontWeight="bold"
                            dominantBaseline="central"
                            fill="grey"
                        >
                            <textPath href={`#${pathId}`}>
                                {category}
                            </textPath>
                        </text>
                    </React.Fragment>
                );
            })}
        </>
    );

    const renderSkillNames = () => (
        <>
            {skillCategories.map((category, categoryIndex) => {
                const categoryAngle = angle * categoryIndex;
                return skillLevels.map((level, levelIndex) => {
                    const levelRadius = levelRadii[levelIndex];
                    const categorySkills = skills[category][level] || []; // Renamed to categorySkills
                    const skillAngleStep = angle / categorySkills.length;
                    return categorySkills.map((skill, skillIndex) => {
                        const skillAngle = categoryAngle + skillAngleStep * skillIndex + skillAngleStep / 2;
                        const x = 50 + Math.cos((skillAngle * Math.PI) / 180) * (levelRadius * 0.8);
                        const y = 50 + Math.sin((skillAngle * Math.PI) / 180) * (levelRadius * 0.8);
                        return (
                            <text
                                key={`${level}-${category}-${skillIndex}`}
                                x={x}
                                y={y}
                                dominantBaseline="middle"
                                textAnchor="middle"
                                fontSize="2"
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
    const renderCircles = () => (
        <>
            {levelRadii.map((radius, index) => (
                <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r={radius}
                    strokeWidth={.25}
                    stroke="#505050"
                    fill="none"
                />
            ))}
        </>
    );

    return (
        <svg width="100%" height="100%" viewBox="0 0 100 100">
            {renderSectorLines()}
            {renderSectorNames()}
            {renderCircles()}
            {renderSkillNames()}
        </svg>

    );
};

export default SkillsRadar;