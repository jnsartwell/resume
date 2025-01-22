import React from 'react';
import './Skills.css';
import SkillsRadar from "../../components/SkillsRadar/SkillsRadar.tsx";
import {skillsWithExpertiseLevels} from "../../data/SkillData.ts";


const Skills: React.FC = () => {

    return (
        <div className={"skillsRadar"}>
            <div>Skills Radar</div>
            <SkillsRadar size={1000} skills={skillsWithExpertiseLevels}/>
        </div>
    )

}

export default Skills;