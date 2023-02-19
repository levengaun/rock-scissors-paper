import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RockScissorsPaper from './RockScissorsPaper'


export default function App() {
    return (
        <Router >
            <Routes>
                <Route path="/" element={<RockScissorsPaper />}/>
            </Routes>
        </Router>
        
    )
}