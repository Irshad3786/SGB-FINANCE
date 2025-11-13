import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from './home/Home';
import Login from './home/Login';
import Signup from './home/Signup';
import Subadmin from './subAdmin/Subadmin';
import Dashboard from './subAdmin/pages/Dashboard';
import Users from './subAdmin/pages/Users ';
import BuySell from './subAdmin/pages/BuySell';


function App() {
  

  return (
    <>
     <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Subadmin Layout */}
        <Route path="/subadmin" element={<Subadmin />}>

          {/* Right Side Pages  */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="buysell" element={<BuySell />} />

        </Route>
        
     </Routes>
        
    </>
  )
}

export default App
