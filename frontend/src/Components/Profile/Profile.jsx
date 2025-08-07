import React, { useEffect, useState } from 'react';
import './Profile.css';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:4000/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({})
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        fetchUserPosts(data.user.email); // Fetch posts after user is fetched
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (username) => {
    try {
      const res = await fetch(`http://localhost:4000/posts/user/${username}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      } else {
        console.warn(data.message);
      }
    } catch (err) {
      console.error('Error fetching user posts:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    navigate('/login');
  };

  const handleEdit = () => {
    navigate('/edit');
  };

  const handleAddPost = () => {
    navigate('/addpost');
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        {user.image ? (
          <img src={user.image} alt="Profile" className="profile-image" />
        ) : (
          <FaUserCircle size={90} className="default-user-icon" />
        )}
        <h2>{user.name}</h2>
      </div>

      <div className="profile-details">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Bio:</strong> {user.description}</p>
        <p><strong>Created on:</strong> {new Date(user.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}</p>
      </div>

      <div className="profile-buttons">
        <button onClick={handleAddPost} className="addpost-btn">Add Post</button>
        <button onClick={handleEdit} className="edit-btn">Edit</button>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {/* ---------------- USER POSTS SECTION ---------------- */}
      <div className="user-posts">
        <h3>Your Posts</h3>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                {post.image ? (
                  <img src={post.image} alt="User" className="post-user-image" />
                ) : (
                  <FaUserCircle size={40} className="default-post-user-icon" />
                )}
                <div>
                  <strong>{post.name}</strong>
                  <div className="post-date">
                    {new Date(post.date).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="post-content">
                {post.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
