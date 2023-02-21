import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './Footer'
import RockScissorsPaper from './RockScissorsPaper.jsx'


export default function App() {
    return (
        <Router >
            <Routes>
                <Route path="/" element={<RockScissorsPaper />}/>
            </Routes>
            <Footer />
        </Router>
        
    )
}