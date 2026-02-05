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
import VehicleStock from './subAdmin/pages/VehicleStock';
import PendingDownpayment from './subAdmin/pages/PendingDownpayment';
import CreateAccountAdmin from './home/CreateAccountAdmin';
import AdminSignin from './home/AdminSignin';
import Admin from './admin/Admin';
import AdminOtpCreateAccount from './home/AdminOtpCreateAccount';


function App() {
  

  return (
    <>
     <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* admin */}
        <Route path="/admin" element={<Admin/>} /> 
        <Route path="/admin-createaccount" element={<CreateAccountAdmin/>} />
        <Route path="/admin-signin" element={<AdminSignin/>} />
        <Route path="/admin-createaccount-otp" element={<AdminOtpCreateAccount/>} />

        {/* Subadmin Layout */}
        <Route path="/subadmin" element={<Subadmin />}>

          {/* Right Side Pages  */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="sell" element={<Sell />} />
          <Route path="buy" element={<Buy />} />
          <Route path="finance" element={<Finance/>} />
          <Route path="collection" element={<Collection/>} />
          <Route path="vehicle-stock" element={<VehicleStock/>} />
          <Route path="pending-downpayment" element={<PendingDownpayment/>} />


        </Route>

         
     </Routes>
        
    </>
  )
}

export default App
