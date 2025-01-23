import React from 'react'
import './Skills.css'
import SkillsRadar from '../../components/SkillsRadar/SkillsRadar.tsx'
import { skillsWithExpertiseLevels } from '../../data/SkillData.ts'

const Skills: React.FC = () => {
    return (
        <div className={'skills-container'}>
            <h1>Skills Radar</h1>
            <SkillsRadar skills={skillsWithExpertiseLevels} />
        </div>
    )
}

export default Skills
