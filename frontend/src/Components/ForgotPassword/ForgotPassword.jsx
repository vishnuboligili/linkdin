import React, { useState } from 'react';
import './ForgotPassword.css';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdClose } from 'react-icons/md';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

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

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:4000/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials:'include',
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (data.success) {
            toast.success("Otp sent!", {
                position: 'top-right',
                autoClose: 3000,
                theme: 'colored',
              });
              
              setTimeout(() => {
                window.location.replace('/forgototp');
              }, 3000); // ← Wait 3 seconds
              
        } else {
          toast.error(data.message || "Failed to send reset email", {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
          });
        }
      } catch (error) {
        console.error("Forgot Password Error:", error);
        toast.error("Something went wrong", {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2>Forgot Password</h2>

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

        <button type="submit">Send  OTP</button>

        <p className="signup-text">
          Don't have an account? <Link to="/register"> Click here </Link>
        </p>
        <p className="signup-text">
          <Link to="/login">Back to Login</Link>
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
