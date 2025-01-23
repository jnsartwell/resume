import React, {useState, useEffect, useCallback} from 'react';
import './introduction.css'

interface TypingTextProps {
    strings: string[];
    speed: number;
    onFinished?: () => void;
}

const noOp = () => {
};

const TypingText: React.FC<TypingTextProps> = ({
                                                   strings, speed, onFinished = noOp
                                               }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');

    const typeCharacter = useCallback((textSoFar: string, remainingText: string) => {
        if (remainingText.length === 0) {
            if (currentIndex < strings.length - 1) {
                setTimeout(() => {
                    setCurrentIndex(currentIndex + 1);
                    setCurrentText('');
                }, 1000 + speed); // Add 'speed' to maintain consistent timing
            } else {
                onFinished();
            }
            return;
        }
        setTimeout(() => {
            const newText = textSoFar + remainingText[0];
            setCurrentText(newText);
            typeCharacter(newText, remainingText.slice(1));
        }, speed);
    }, [currentIndex, onFinished, speed, strings.length]);

    useEffect(() => {
        typeCharacter('', strings[currentIndex]);
    }, [currentIndex, speed, strings, onFinished, typeCharacter]);


    return (
        <div className="typing-container">
            <span>{currentText}</span>
            <span className="typing-cursor">_</span>
        </div>
    );
};

export default TypingText;