import { useState } from 'react'
import './App.css'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import Homepage from './pages/homepage/Homepage'
import Box1 from './pages/homepage/Box1'
import Box2 from './pages/homepage/Box2'
import Box3 from './pages/homepage/Box3'
import Rest from './pages/homepage/Rest'
import Leaderboard from './pages/homepage/Leaderboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>
      <Homepage/>
      <Box1/>
      <Box2/>
      <Box3/>
      <Rest/>
      <Leaderboard/>
      <Footer/>
    </>
  )
}

export default App
