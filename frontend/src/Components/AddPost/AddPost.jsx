import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './AddPost.css';

const AddPost = () => {
  const [content, setContent] = useState('');
  const navigate = useNavigate();
useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      navigate('/login');
      return;
    }

  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('auth-token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/posts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Post added successfully!');
        navigate('/profile'); // or redirect to posts page
      } else {
        alert(data.message || 'Failed to add post');
      }
    } catch (err) {
      console.error('Error adding post:', err);
      alert('Something went wrong');
    }
  };

  return (
    <div className="addpost-container">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit} className="addpost-form">
        <textarea
          placeholder="Write your post here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
        ></textarea>
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default AddPost;
