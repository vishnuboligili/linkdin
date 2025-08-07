import React, { useEffect, useState } from 'react';
import './NavBar.css';
import { FaLinkedin, FaUserCircle } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';

export const NavBar = () => {
  const token = localStorage.getItem('auth-token');
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [userEmail,setUserEmail]=useState('');
  // Decode user image from token
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.user?.image) setImage(decoded.user.image);
        setUserEmail(decoded.user.email);
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('auth-token');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, []);

  // Fetch all users for search
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:4000/all');
        const data = await res.json();
        if (data.success) setUsers(data.users);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();
  }, []);

  // Filter users on search
  useEffect(() => {
    const result = users.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, users]);

  // Navigate to user's profile
  const handleUserClick = (email) => {
    setSearch('');
    setFiltered([]);
    if(email==userEmail)navigate('/profile');
    else navigate(`/user/${email}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to='/'><FaLinkedin className="linkedin-logo" /></Link>
      </div>

      <div className="navbar-center">
        <input
          type="text"
          placeholder="Search users..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && filtered.length > 0 && (
          <ul className="search-dropdown">
            {filtered.map(user => (
              <li key={user.email} onClick={() => handleUserClick(user.email)}>
                <img src={user.image} alt="User" className="search-user-img" />
                <span>{user.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="navbar-right">
        <Link to="/profile" className="profile-icon" title="Profile">
          {image ? (
            <img src={image} alt="Profile" className="nav-profile-image" />
          ) : (
            <FaUserCircle size={40} />
          )}
        </Link>
      </div>
    </nav>
  );
};
