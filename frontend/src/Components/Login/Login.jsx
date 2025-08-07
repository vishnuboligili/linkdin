import React, { useState,useEffect} from 'react';
import './Login.css';
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { MdClose } from 'react-icons/md';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
  useEffect(() => {
      const token = localStorage.getItem('auth-token');
        if (token) {
          navigate('/');
          return;
        }
    }, []);
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
    } else if (!email.toLowerCase().endsWith('@gmail.com')) {
      newErrors.email = 'Only @gmail.com addresses are allowed';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    console.log(1);
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      console.log('Logging in with:', { email, password });
      const formBody = {
        email: email,       // stores with key "email"
        password: password  // stores with key "password"
      };
      console.log(formBody);
      let responseData;

    try {
        console.log(1);
        const response = await fetch('http://localhost:4000/login', {
          method: 'POST',
          headers: {
            Accept:'application/form-data',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formBody),
        });

        responseData = await response.json();

        if (responseData.success) {
          localStorage.setItem('auth-token', responseData.token);
          toast.success("Login successful", {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
          });
          setTimeout(() => {
            window.location.replace('/');
          }, 3000); // delay for toast display
        } else {
          toast.error(responseData.message || "Login failed", {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
          });
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Something went wrong", {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
      }
      

    } else {
      setSubmitted(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google user:', decoded);
  
      // Example: send user data to your backend for verification/registration
      const response = await fetch('http://localhost:4000/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: decoded.name,
          email: decoded.email,
          googleId: decoded.sub,
          picture: decoded.picture,
        }),
      });
  
      const responseData = await response.json();
  
      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        toast.success("Google login successful", {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
        setTimeout(() => {
          window.location.replace('/');
        }, 3000);
      } else {
        toast.error("Google login failed", {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Something went wrong", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    }
  };
  

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2>Login</h2>

        <div className="input-wrapper">
          <FaUser className="icon" />
          <input
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {errors.email && <p className="error">{errors.email}</p>}

        <div className="input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="icon password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <p className="error">{errors.password}</p>}

        <button type="submit">Login</button>

        <div className="google-login" style={{ marginTop: '20px' }}>

  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => {
      toast.error("Google login failed", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    }}
  />
</div>


        {/* {submitted && <p className="success">Login submitted successfully!</p>} */}

        <p className="signup-text">
          Don't have an account? <Link to="/register"> Click here </Link>
        </p>
        <p className="signup-text">
          <Link to="/forgotpassword"> Forgot Password ?</Link>
        </p>
{/* 
        <div className="author-info">
          <p>© 2025 | Developed by <strong>Your Name</strong></p>
        </div> */}

      </form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
        closeButton={({ closeToast }) => (
          <MdClose
            onClick={closeToast}
            style={{
              color: 'white',
              fontSize: '20px',
              position: 'absolute',
              top: '10px',
              right: '10px',
              cursor: 'pointer',
            }}
          />
        )}
      />                                                                                                                                

    </div>
  );
};
