import React, { useMemo, useState } from 'react'
import './SkillsRadar.css'

interface Skill {
    name: string
}

interface SkillsRadarProps {
    skills: { [key: string]: { [key: string]: Skill[] } }
}

const SkillsRadar: React.FC<SkillsRadarProps> = ({ skills }: SkillsRadarProps) => {
    const skillCategories = useMemo(() => Object.keys(skills), [skills])
    const skillLevels = useMemo(() => {
        const allLevels = new Set<string>()
        for (const category in skills) {
            Object.keys(skills[category]).forEach((level) => allLevels.add(level))
        }
        return Array.from(allLevels)
    }, [skills])

    const categoryAngles = useMemo(() => {
        const categoryAngles: { [key: string]: number } = {}

        // Calculate total skills for proportioning angles
        let totalSkills = 0
        for (const category in skills) {
            let categorySkillCount = 0
            for (const level in skills[category]) {
                categorySkillCount += skills[category][level].length
            }
            totalSkills += categorySkillCount
        }

        skillCategories.forEach((category) => {
            let categorySkillCount = 0
            for (const level in skills[category]) {
                categorySkillCount += skills[category][level].length
            }
            categoryAngles[category] = (categorySkillCount / totalSkills) * 360
        })

        return categoryAngles // Return only the angles
    }, [skills, skillCategories])

    const categoryColors = useMemo(() => {
        const colors: { [key: string]: string } = {}
        skillCategories.forEach((category, index) => {
            const hue = (index / skillCategories.length) * 360
            colors[category] = `hsl(${hue}, 70%, 60%)`
        })
        return colors
    }, [skillCategories])

    const calculateCumulativeAngle = (categoryIndex: number): number => {
        let cumulativeAngle = 0
        for (let i = 0; i < categoryIndex; i++) {
            cumulativeAngle += categoryAngles[skillCategories[i]]
        }
        return cumulativeAngle
    }

    const renderSectorLine = (category: string, categoryIndex: number) => {
        const cumulativeAngle = calculateCumulativeAngle(categoryIndex)
        const x2 = 50 + Math.cos((cumulativeAngle * Math.PI) / 180) * 50
        const y2 = 50 + Math.sin((cumulativeAngle * Math.PI) / 180) * 50

        return (
            <line
                key={category}
                x1="50"
                y1="50"
                x2={x2}
                y2={y2}
                stroke="white"
                strokeWidth=".25"
            />
        )
    }

    const renderSectorName = (category: string, categoryIndex: number) => {
        const sectorStartAngle = calculateCumulativeAngle(categoryIndex)
        const sectorEndAngle = sectorStartAngle + categoryAngles[category]
        const textAngle = (sectorStartAngle + sectorEndAngle) / 2

        const radius = 52
        const pathId = `sector-path-${categoryIndex}`
        const pathStartX = 50 + Math.cos((textAngle * Math.PI) / 180) * radius
        const pathStartY = 50 + Math.sin((textAngle * Math.PI) / 180) * radius
        const pathEndX = 50 + Math.cos(((textAngle + categoryAngles[category] / 2) * Math.PI) / 180) * radius
        const pathEndY = 50 + Math.sin(((textAngle + categoryAngles[category] / 2) * Math.PI) / 180) * radius

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
                    <textPath href={`#${pathId}`}>{category}</textPath>
                </text>
            </React.Fragment>
        )
    }

    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

    function computeXandY(
        categoryStartAngle: number,
        skillAngleStep: number,
        skillIndex: number,
        baseLevelRadius: number,
        levelsInCategory: number,
        levelSkills: unknown[],
    ) {
        const skillAngle = categoryStartAngle + skillAngleStep * skillIndex + skillAngleStep / 2
        const adjustedLevelRadius =
            baseLevelRadius + ((baseLevelRadius / (levelsInCategory + 1)) * (levelSkills.length - 1)) / 2
        const scaleFactor = Math.min(1, 0.8 - levelSkills.length / 10)

        const x = 50 + Math.cos((skillAngle * Math.PI) / 180) * (adjustedLevelRadius * scaleFactor)
        const y = 50 + Math.sin((skillAngle * Math.PI) / 180) * (adjustedLevelRadius * scaleFactor)
        return { x, y }
    }

    const renderSkillToast = (category: string, categoryIndex: number) => {
        const categoryStartAngle = calculateCumulativeAngle(categoryIndex)
        const levelsInCategory = Object.keys(skills[category]).length

        return skillLevels.flatMap((level, levelIndex) => {
            const levelSkills = skills[category][level] || []
            const baseLevelRadius = (50 / levelsInCategory) * (levelIndex + 1)
            const skillAngleStep = categoryAngles[category] / levelSkills.length

            return levelSkills.map((skill, skillIndex) => {
                const coordinate = computeXandY(
                    categoryStartAngle,
                    skillAngleStep,
                    skillIndex,
                    baseLevelRadius,
                    levelsInCategory,
                    levelSkills,
                )
                const toastX = coordinate.x + 5
                const toastY = coordinate.y - 15

                return (
                    hoveredSkill === skill.name && (
                        <foreignObject
                            key={`${level}-${category}-${skillIndex}`}
                            x={toastX}
                            y={toastY}
                            width={skill.name.length * 2}
                            height={20}
                            style={{ pointerEvents: 'none' }}
                        >
                            <div
                                className="skill-toast"
                                style={{
                                    backgroundColor: categoryColors[category],
                                }}
                            >
                                {skill.name}
                            </div>
                        </foreignObject>
                    )
                )
            })
        })
    }

    const renderCircle = (category: string, categoryIndex: number) => {
        const categoryStartAngle = calculateCumulativeAngle(categoryIndex)
        const nextCategoryAngle = categoryStartAngle + categoryAngles[category]
        const categoryLevels = Object.keys(skills[category])
        const numCategoryLevels = categoryLevels.length
        const radiusStep = 50 / numCategoryLevels

        return Array.from({ length: numCategoryLevels }, (_, i) => (
            <path
                key={`${category}-${i}`}
                d={`M ${50 + Math.cos((categoryStartAngle * Math.PI) / 180) * radiusStep * (i + 1)},${50 + Math.sin((categoryStartAngle * Math.PI) / 180) * radiusStep * (i + 1)} 
            A ${radiusStep * (i + 1)},${radiusStep * (i + 1)} 0 0 1 ${50 + Math.cos((nextCategoryAngle * Math.PI) / 180) * radiusStep * (i + 1)},${50 + Math.sin((nextCategoryAngle * Math.PI) / 180) * radiusStep * (i + 1)}`}
                strokeWidth={0.25}
                stroke="#505050"
                fill="none"
            />
        ))
    }

    const renderSkillDot = (category: string, categoryIndex: number) => {
        const categoryStartAngle = calculateCumulativeAngle(categoryIndex)
        const levelsInCategory = Object.keys(skills[category]).length

        return skillLevels.flatMap((level, levelIndex) => {
            const levelSkills = skills[category][level] || []
            const baseLevelRadius = (50 / levelsInCategory) * (levelIndex + 1)
            const skillAngleStep = categoryAngles[category] / levelSkills.length

            return levelSkills.map((skill, skillIndex) => {
                const coordinate = computeXandY(
                    categoryStartAngle,
                    skillAngleStep,
                    skillIndex,
                    baseLevelRadius,
                    levelsInCategory,
                    levelSkills,
                )

                return (
                    <circle
                        key={`${level}-${category}-${skillIndex}`}
                        cx={coordinate.x}
                        cy={coordinate.y}
                        r="1.5"
                        fill={categoryColors[category]}
                        onMouseEnter={() => setHoveredSkill(skill.name)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        style={{ cursor: 'pointer' }}
                    />
                )
            })
        })
    }

    return (
        <svg
            width="100%"
            height="100%"
            viewBox="-15 -15 130 130"
        >
            {skillCategories.map(renderSectorName)}
            {skillCategories.map(renderSectorLine)}
            <circle
                cx="50"
                cy="50"
                r={50}
                strokeWidth={0.25}
                stroke="#505050"
                fill="none"
            />
            {skillCategories.map(renderCircle)}
            {skillCategories.map(renderSkillDot)}
            {skillCategories.map(renderSkillToast)}
        </svg>
    )
}

export default SkillsRadar
