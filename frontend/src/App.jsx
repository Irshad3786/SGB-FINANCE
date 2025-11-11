import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from './home/Home';
import Login from './home/Login';
import Signup from './home/Signup';


function App() {
  

  return (
    <>
     <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
     </Routes>
        
    </>
  )
}

export default App
