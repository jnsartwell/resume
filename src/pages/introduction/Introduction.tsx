import React, { useCallback, useEffect, useState } from 'react'
import './introduction.css'
import { noOp } from '../../utils/utils.ts'

interface TypingTextProps {
    strings: string[]
    speed: number
    onFinished?: () => void
}

const TypingText: React.FC<TypingTextProps> = ({ strings, speed, onFinished = noOp }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentText, setCurrentText] = useState('')

    const typeCharacter = useCallback(
        (text: string) => {
            let index = 0

            const intervalId = setInterval(() => {
                if (index < text.length) {
                    setCurrentText(text.slice(0, index + 1))
                    index++
                } else {
                    clearInterval(intervalId)

                    if (currentIndex < strings.length - 1) {
                        setTimeout(() => {
                            setCurrentIndex(currentIndex + 1)
                            setCurrentText('')
                        }, 1000 + speed)
                    } else {
                        onFinished()
                    }
                }
            }, speed)

            return () => clearInterval(intervalId)
        },
        [currentIndex, onFinished, speed, strings.length],
    )

    useEffect(() => {
        const cleanup = typeCharacter(strings[currentIndex])
        return () => cleanup()
    }, [currentIndex, speed, strings, onFinished, typeCharacter])

    return (
        <div className="typing-container">
            <span>{currentText}</span>
            <span className="typing-cursor">_</span>
        </div>
    )
}

export default TypingText
