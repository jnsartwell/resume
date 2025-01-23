import React, {useState, useEffect} from 'react';
import './introduction.css'

interface TypingTextProps {
    strings: string[];
    speed: number;
    onFinished?: () => void;
}

const TypingText: React.FC<TypingTextProps> = ({
                                                   strings, speed, onFinished = () => {
    }
                                               }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCurrentText((prevText) => {
                const newText = strings[currentIndex].slice(0, prevText.length + 1);
                if (newText === strings[currentIndex]) {
                    clearInterval(blinkingCursorInterval);
                    const pauseBetweenScriptLines = 1000;
                    setTimeout(() => {
                        setShowCursor(false);
                        if (currentIndex < strings.length - 1) {
                            setTimeout(() => {
                                setCurrentIndex(currentIndex + 1);
                                setCurrentText('');
                                setShowCursor(true);
                            }, pauseBetweenScriptLines); // Pause before next string
                        } else {
                            // All strings typed, trigger callback
                            setShowCursor(true)
                            onFinished();
                        }
                    }, pauseBetweenScriptLines); // Pause before hiding cursor
                }
                return newText;
            });
        }, speed);

        const blinkingCursorInterval = setInterval(() => {
            setShowCursor((prevShowCursor) => !prevShowCursor);
        }, 500);

        return () => {
            clearTimeout(timeout);
            clearInterval(blinkingCursorInterval);
        };
    }, [currentIndex, currentText, speed, strings, onFinished]);
    return (
        <div className="typing-container">
            <span>{currentText}</span>
            <span className="typing-cursor" style={{visibility: showCursor ? 'visible' : 'hidden'}}>_</span>
        </div>
    );
};

export default TypingText;