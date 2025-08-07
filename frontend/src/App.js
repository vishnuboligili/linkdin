import logo from './logo.svg';
import './App.css';
import { useLocation } from 'react-router-dom';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { NavBar } from './Components/NavBar/NavBar';
import { Login } from './Components/Login/Login';
import { Register } from './Components/Register/Register';
import { OTP } from './Components/OTP/OTP';
import {ForgotOtp} from './Components/ForgotOtp/ForgotOtp';
import { Profile } from './Components/Profile/Profile';
import { Edit } from './Components/Edit/Edit';
import { ForgotPassword } from './Components/ForgotPassword/ForgotPassword';
import Password from './Components/Password/Password';
import { Feed } from './Components/Feed/Feed';
import AddPost from './Components/AddPost/AddPost';
import { UserProfile } from './Components/UserProfile/UserProfile';
function AppWrapper() {
  const location = useLocation();
  const hideLayout = location.pathname === '/login' || location.pathname === '/register'||location.pathname === '/otp' || location.pathname === '/forgototp'||location.pathname === '/forgotpassword'||location.pathname === '/password';

  return (
    <div className="App">
      {!hideLayout && <NavBar/>}
      <Routes>
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>}/>
      <Route path='/otp' element={<OTP/>}/>
      <Route path='/forgototp' element={<ForgotOtp/>}/>
      <Route path='/forgotpassword' element={<ForgotPassword/>}/>
      <Route path='/password' element={<Password/>}/>
      <Route path='/' element={<Feed/>}/>
      <Route path='/profile' element={<Profile/>}/> 
      <Route path='/edit' element={<Edit/>}/>
      <Route path='/addpost' element={<AddPost/>}/>
      <Route path="/user/:name" element={<UserProfile/>}/>
      </Routes>
      
    </div>
  )
}
function App() {
  
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
