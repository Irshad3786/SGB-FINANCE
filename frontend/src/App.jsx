import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from './home/Home';
import Login from './home/Login';
import Signup from './home/Signup';
import Subadmin from './subAdmin/Subadmin';
import Dashboard from './subAdmin/pages/Dashboard';
import Users from './subAdmin/pages/Users ';
import Sell from './subAdmin/pages/Sell';
import Buy from './subAdmin/pages/Buy';
import Finance from './subAdmin/pages/Finance';
import Collection from './subAdmin/pages/Collection';


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
          <Route path="sell" element={<Sell />} />
          <Route path="buy" element={<Buy />} />
          <Route path="finance" element={<Finance/>} />
          <Route path="collection" element={<Collection/>} />


        </Route>
        
     </Routes>
        
    </>
  )
}

export default App
