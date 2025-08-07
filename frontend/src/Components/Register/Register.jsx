import React, { useState ,useEffect} from 'react';
import './Register.css';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { MdClose } from 'react-icons/md';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

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
    const { username, email, password} = formData;
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    

    if (!username.trim()) newErrors.username = 'Username is required';

    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(email)) newErrors.email = 'Invalid email format';
    else if (!email.toLowerCase().endsWith('@gmail.com')) newErrors.email = 'Only @gmail.com addresses are allowed';

    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      try {
        const res = await fetch('http://localhost:4000/register', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const responseData = await res.json();

        if (responseData.success) {
          toast.success("Registered successfully! Redirecting to OTP...", {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
          });
          setTimeout(() => {
            window.location.replace('/otp');
          }, 3000);
        } else {
          toast.error(responseData.message || "Registration failed", {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
          });
        }
      } catch (error) {
        console.log('Registration error:', error);
        toast.error("Server error. Please try again later.", {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
      }
    } else {
      setSubmitted(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <h2>Register</h2>

        <div className="input-wrapper">
          <FaUser className="icon" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        {errors.username && <p className="error">{errors.username}</p>}

        <div className="input-wrapper">
          <FaEnvelope className="icon" />
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {errors.email && <p className="error">{errors.email}</p>}

        <div className="input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <span
            className="icon password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <p className="error">{errors.password}</p>}
        <button type="submit">Register</button>

        <p className="login-text">
          Already have an account? <Link to='/login'>Log in</Link>
        </p>
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
