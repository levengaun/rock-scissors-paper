import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import RockScissorsPaper from './RockScissorsPaper.jsx'


export default function App() {
    return (
        <Router >

            <Header />
            <Routes>
                <Route path="/" element={<RockScissorsPaper />}/>
            </Routes>
            <Footer />
        </Router>
        
    )
}