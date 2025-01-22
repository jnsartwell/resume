import React from 'react';
import './SkillsRadar.css';
import ConcentricCircles from "../../components/ConcentricCircles/ConcentricCircles.tsx";
import Circle from "../../components/ConcentricCircles/Circle.tsx";



const SkillsRadar:React.FC = () => {
    return <>
        <div className={"skillsRadar"}>
            <div>Skills Radar</div>
            <div>
                <ConcentricCircles strokeWidth={2} color="gray" size={1000}>
                    <Circle color="#383838" gap={3}/>
                    <Circle color="#505050" gap={2}/>
                    <Circle color="#383838" gap={1}/>
                </ConcentricCircles>
            </div>
        </div>
    </>
}

export default SkillsRadar;