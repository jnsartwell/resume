import React, {useMemo, useState} from 'react';
import './SkillsRadar.css'

interface Skill {
    name: string;
}

interface SkillsRadarProps {
    skills: { [key: string]: { [key: string]: Skill[] } };
}

const SkillsRadar: React.FC<SkillsRadarProps> = ({skills}: SkillsRadarProps) => {
    const skillCategories = useMemo(() => Object.keys(skills), [skills]);

    const skillLevels = useMemo(() => {
        const allLevels: string[] = [];
        for (const category in skills) {
            allLevels.push(...Object.keys(skills[category]));
        }
        return Array.from(new Set(allLevels));
    }, [skills]);

    const categoryAngles: { [key: string]: number } = useMemo(() => {
        const angles: { [key: string]: number } = {};
        const totalSkills = skillCategories.reduce((sum, category) => {
            let categorySkillCount = 0;
            for (const level in skills[category]) {
                categorySkillCount += skills[category][level].length;
            }
            return sum + categorySkillCount;
        }, 0);

        skillCategories.forEach((category) => {
            let categorySkillCount = 0;
            for (const level in skills[category]) {
                categorySkillCount += skills[category][level].length;
            }
            const angle = (categorySkillCount / totalSkills) * 360;
            angles[category] = angle;
        });

        return angles;
    }, [skills, skillCategories]);

    const categoryColors = useMemo(() => {
        const colors: { [key: string]: string } = {};
        skillCategories.forEach((category, index) => {
            const hue = (index / skillCategories.length) * 360;
            colors[category] = `hsl(${hue}, 70%, 60%)`;
        });
        return colors;
    }, [skillCategories]);

    const renderSectorLines = () => (
        <>
            {skillCategories.map((category, categoryIndex) => {
                let cumulativeAngle = 0;
                for (let i = 0; i < categoryIndex; i++) {
                    cumulativeAngle += categoryAngles[skillCategories[i]];
                }

                const x2 = 50 + Math.cos((cumulativeAngle * Math.PI) / 180) * 50;
                const y2 = 50 + Math.sin((cumulativeAngle * Math.PI) / 180) * 50;

                return (
                    <line
                        key={`${category}`}
                        x1="50"
                        y1="50"
                        x2={x2}
                        y2={y2}
                        stroke="white"
                        strokeWidth=".25"
                    />
                );
            })}
        </>
    );

    const renderSectorNames = () => (
        <>
            {skillCategories.map((category, categoryIndex) => {
                let cumulativeAngle = 0;
                for (let i = 0; i < categoryIndex; i++) {
                    cumulativeAngle += categoryAngles[skillCategories[i]];
                }

                // Calculate the starting angle of the sector
                const sectorStartAngle = cumulativeAngle;

                // Calculate the ending angle of the sector
                const sectorEndAngle = sectorStartAngle + categoryAngles[category];

                // Calculate the middle angle of the sector
                const textAngle = (sectorStartAngle + sectorEndAngle) / 2;

                const radius = 52;

                const pathId = `sector-path-${categoryIndex}`;
                const pathStartX = 50 + Math.cos((textAngle * Math.PI) / 180) * radius;
                const pathStartY = 50 + Math.sin((textAngle * Math.PI) / 180) * radius;
                const pathEndX = 50 + Math.cos(((textAngle + categoryAngles[category] / 2) * Math.PI) / 180) * radius;
                const pathEndY = 50 + Math.sin(((textAngle + categoryAngles[category] / 2) * Math.PI) / 180) * radius;

                return (
                    <React.Fragment key={categoryIndex}>
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

    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null); // Store the hovered skill

    const renderSkillToasts = () => (
        <>
            {skillCategories.map((category, categoryIndex) => {
                let cumulativeAngle = 0;
                for (let i = 0; i < categoryIndex; i++) {
                    cumulativeAngle += categoryAngles[skillCategories[i]];
                }
                const categoryStartAngle = cumulativeAngle;

                const levelsInCategory = Object.keys(skills[category]).length;

                return skillLevels.map((level, levelIndex) => {
                    const levelSkills = skills[category][level] || [];

                    // Calculate the base radius for each level, evenly spaced across the sector
                    const baseLevelRadius = (50 / levelsInCategory) * (levelIndex + 1);

                    // Calculate the angle step for each skill within the level
                    const skillAngleStep = categoryAngles[category] / levelSkills.length;

                    return levelSkills.map((skill, skillIndex) => {
                        // Calculate the angle for the current skill
                        const skillAngle = categoryStartAngle + skillAngleStep * skillIndex + skillAngleStep / 2;

                        // Adjust the level radius based on the number of skills in the level
                        const adjustedLevelRadius = baseLevelRadius + (baseLevelRadius / (levelsInCategory + 1)) * (levelSkills.length - 1) / 2;


                        let scaleFactor = Math.min(1, 0.8 - (levelSkills.length / 10));
                        const maxRadius = 50;
                        if (adjustedLevelRadius * scaleFactor > maxRadius) {
                            scaleFactor = maxRadius / adjustedLevelRadius;
                        }

                        // const scaleFactor = Math.min(1, 0.8 - (levelSkills.length / 10));


                        const x = 50 + Math.cos((skillAngle * Math.PI) / 180) * (adjustedLevelRadius * scaleFactor);
                        const y = 50 + Math.sin((skillAngle * Math.PI) / 180) * (adjustedLevelRadius * scaleFactor);

                        const toastX = x + 5; // Position toast to the right of the dot
                        const toastY = y - 15; // Position toast above the dot

                        return (
                            hoveredSkill === skill.name && (
                                <foreignObject
                                    key={`${level}-${category}-${skillIndex}`}
                                    x={toastX}
                                    y={toastY}
                                    width={skill.name.length * 2} // Dynamic width based on skill name length
                                    height={20} // Fixed height, adjust as needed
                                    style={{ pointerEvents: 'none' }}
                                >
                                    <div className="skill-toast" style={{backgroundColor: categoryColors[category]}}>
                                        {skill.name}
                                    </div>
                                </foreignObject>
                            )
                        );
                    });
                });
            })}
        </>
    );

    const renderCircles = () => {
        const radii: { [key: string]: number[] } = {};

        skillCategories.forEach((category) => {
            const categoryLevels = Object.keys(skills[category]);
            const numCategoryLevels = categoryLevels.length;
            const categoryRadii: number[] = [];
            const radiusStep = 50 / numCategoryLevels;
            for (let i = 1; i <= numCategoryLevels; i++) {
                categoryRadii.push(radiusStep * i);
            }
            radii[category] = categoryRadii;
        });

        return (
            <>
                <circle
                    cx="50"
                    cy="50"
                    r={50}
                    strokeWidth={.25}
                    stroke="#505050"
                    fill="none"
                />

                {skillCategories.map((category, categoryIndex) => {
                    let cumulativeAngle = 0;
                    for (let i = 0; i < categoryIndex; i++) {
                        cumulativeAngle += categoryAngles[skillCategories[i]];
                    }
                    const categoryStartAngle = cumulativeAngle;
                    const nextCategoryAngle = categoryStartAngle + categoryAngles[category];
                    return radii[category].map((radius, radiusIndex) => (
                        <path
                            key={`${category}-${radiusIndex}`}
                            d={`M ${50 + Math.cos((categoryStartAngle * Math.PI) / 180) * radius},${50 + Math.sin((categoryStartAngle * Math.PI) / 180) * radius} 
                               A ${radius},${radius} 0 0 1 ${50 + Math.cos((nextCategoryAngle * Math.PI) / 180) * radius},${50 + Math.sin((nextCategoryAngle * Math.PI) / 180) * radius}`}
                            strokeWidth={.25}
                            stroke="#505050"
                            fill="none"
                        />
                    ));
                })}
            </>
        );
    };

    const renderSkillDots = () => (
        <>
            {skillCategories.map((category, categoryIndex) => {
                let cumulativeAngle = 0;
                for (let i = 0; i < categoryIndex; i++) {
                    cumulativeAngle += categoryAngles[skillCategories[i]];
                }
                const categoryStartAngle = cumulativeAngle;

                const levelsInCategory = Object.keys(skills[category]).length;

                return skillLevels.map((level, levelIndex) => {
                    const levelSkills = skills[category][level] ||[];

                    // Calculate the base radius for each level, evenly spaced across the sector
                    const baseLevelRadius = (50 / levelsInCategory) * (levelIndex + 1);

                    // Calculate the angle step for each skill within the level
                    const skillAngleStep = categoryAngles[category] / levelSkills.length;

                    return levelSkills.map((skill, skillIndex) => {
                        // Calculate the angle for the current skill
                        const skillAngle = categoryStartAngle + skillAngleStep * skillIndex + skillAngleStep / 2;

                        // Adjust the level radius based on the number of skills in the level
                        const adjustedLevelRadius = baseLevelRadius + (baseLevelRadius / (levelsInCategory + 1)) * (levelSkills.length - 1) / 2;

                        // let scaleFactor = Math.min(1, 0.8 - (levelSkills.length / 10));
                        // const maxRadius = 45;
                        // if (adjustedLevelRadius * scaleFactor > maxRadius) {
                        //     scaleFactor = maxRadius / adjustedLevelRadius;
                        // }

                        const scaleFactor = Math.min(1, 0.8 - (levelSkills.length / 10));

                        const x = 50 + Math.cos((skillAngle * Math.PI) / 180) * (adjustedLevelRadius * scaleFactor);
                        const y = 50 + Math.sin((skillAngle * Math.PI) / 180) * (adjustedLevelRadius * scaleFactor);

                        return (
                            <circle
                                key={`<span class="math-inline">{level}-</span>{category}-${skillIndex}`}
                                cx={x}
                                cy={y}
                                r="1.5"
                                fill={categoryColors[category]}
                                onMouseEnter={() => setHoveredSkill(skill.name)}
                                onMouseLeave={() => setHoveredSkill(null)}
                                style={{ cursor: 'pointer' }}
                            />
                        );
                    });
                });
            })}
        </>
    );    return (
        <svg width="100%" height="100%" viewBox="-15 -15 130 130">
            {renderSectorNames()}
            {renderSectorLines()}
            {renderCircles()}
            {renderSkillDots()}
            {renderSkillToasts()}
        </svg>
    );
};

export default SkillsRadar;