import React, { useEffect, useState } from 'react';
import './Feed.css';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
export const Feed = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
      if (!token) {
        navigate('/login');
        return;
      }
      const decoded = jwtDecode(token);
      setUser(decoded.user.email);
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const res = await fetch('http://localhost:4000/posts/all');
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      } else {
        console.warn(data.message);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const goToUserProfile = (email) => {
    if(email==user)navigate('/profile');
    else navigate(`/user/${encodeURIComponent(email)}`);
  };

  return (
    <div className="feed-container">
      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="feed-post-card">
            <div className="feed-post-header" onClick={() => goToUserProfile(post.email)}>
              {post.image ? (
                <img src={post.image} alt="User" className="feed-post-user-image" />
              ) : (
                <FaUserCircle size={40} className="default-feed-user-icon" />
              )}
              <div>
                <strong className="feed-username">{post.name}</strong>
                <div className="feed-date">
                  {new Date(post.date).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="feed-post-content">{post.content}</div>
          </div>
        ))
      )}
    </div>
  );
};
