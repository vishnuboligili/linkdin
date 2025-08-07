import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './UserProfile.css';
import { FaUserCircle } from 'react-icons/fa';

export const UserProfile = () => {
  const { name } = useParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
const[description,setDescription]=useState('');
  useEffect(() => {

    fetchUserData();
  }, [name]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`http://localhost:4000/posts/user/${name}`);
      const data = await res.json();
      if (data.success) {
        console.log(1);
        setPosts(data.posts);
        setUser({
          name: data.user.name,
          image: data.user.image
        });
        setDescription(data.user.description);

      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        {user.image ? (
          <img src={user.image} alt="User" className="user-profile-image" />
        ) : (
          <FaUserCircle size={60} />
        )}
        <h2>{user.name}</h2>
      </div>
        <div className="description">Description: {description}</div>
      <div className="user-profile-posts">
        <h3>{user.name}'s Posts</h3>
        {posts.map((post) => (
          <div key={post._id} className="user-post-card">
            <div className="user-post-date">{new Date(post.date).toLocaleString()}</div>
            <div className="user-post-content">{post.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
