import React, { useState ,useEffect} from 'react';
import './Password.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { MdClose } from 'react-icons/md';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Password = () => {
  const [password, setPassword] = useState('');
const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('auth-token');
          if (token) {
            navigate('/');
            return;
          }

      }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error('Password is required');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        credentials: 'include', // in case you’re using cookies/session
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Password updated successful", {
                            position: 'top-right',
                            autoClose: 3000,
                            theme: 'colored',
                            });
                            setTimeout(() => {
                              window.location.replace('/login');
                            }, 3000); // delay for toast display
        // Optionally redirect or clear form
      } else {
        toast.error(data.message || "Login failed", {
                            position: 'top-right',
                            autoClose: 3000,
                            theme: 'colored',
                          });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="password-container">
      <form className="password-form" onSubmit={handleSubmit}>
        <h2>Enter New Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
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

export default Password;
