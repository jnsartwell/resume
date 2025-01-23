import './App.css'
import './fonts.css'
import './palette.css'

import Skills from './pages/skills/Skills.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Introduction from './pages/introduction/Introduction.tsx'
import { script } from './data/IntroductionScript.ts'

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Introduction
                            strings={script}
                            speed={100}
                        />
                    }
                />
                <Route
                    path="/skills"
                    element={<Skills />}
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App
