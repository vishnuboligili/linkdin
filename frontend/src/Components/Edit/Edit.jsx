import React, { useEffect, useState } from 'react';
import './Edit.css';
import { FaUserCircle, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { MdClose } from 'react-icons/md';


export const Edit = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const[description,setDescription]=useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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
          setName(data.user.name);
          setDescription(data.user.description);
          setImagePreview(data.user.image || null);
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

    fetchUserInfo();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Show preview instantly
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth-token');
    if(!token){
        navigate('/login');
    }
    let responseData;
    let updateData;
    
    const formData = new FormData();
    
    if (imageFile) {
        formData.append('image', imageFile);
        try{
            await fetch('http://localhost:4000/upload',{
                method:'POST',
                headers:{
                    Accept:'application/json',
                },
                body:formData
            }).then((resp)=>resp.json()).then((data)=>{responseData=data});
            if(responseData.success){
                updateData = {
                    name: name,
                    description:description,
                    image: responseData.image_url,
                };
            }
            else{
                console.log(responseData.message);
            }
        }
        catch(err){
            console.log(err);
        }
    }
    else{
        updateData = {
            name: name,
            description:description,
            image: null,
          };
    }
    console.log(updateData);
    try {
        const res = await fetch('http://localhost:4000/edit', {
            method: 'POST',
            headers: {
              'auth-token': token,
              'Content-Type': 'application/json', // <-- add this
            },
            body: JSON.stringify(updateData),
          });
          

      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successful", {
                                    position: 'top-right',
                                    autoClose: 3000,
                                    theme: 'colored',
                                    });
                                    console.log('i came here');
                                    localStorage.setItem('auth-token', data.token);
                                    setTimeout(() => {
                                      window.location.replace('/profile');
                                    }, 3000); // delay for toast display
                // Optionally redirect or cle
      } else {
        toast.error(data.message || "Update failed", {
                                    position: 'top-right',
                                    autoClose: 3000,
                                    theme: 'colored',
                                  });
      }
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return null;

  return (
    <div>
        <form className="edit-container" onSubmit={handleSubmit}>
     <div className="image-upload-section">
  <div className="image-wrapper">
    {imagePreview ? (
      <img src={imagePreview} alt="Profile" className="edit-profile-image" />
    ) : (
      <FaUserCircle size={100} className="edit-user-icon" />
    )}
    <label htmlFor="image-upload" className="upload-icon">
      <FaPlus />
    </label>
  </div>
  <input
    id="image-upload"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    hidden
  />
</div>


      <div className="input-group">
        <label htmlFor="name" className="name-label">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="edit-name-input"
          placeholder="Enter your name"
          required
        />
        <label htmlFor="description" className="name-label">Bio:</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="edit-name-input"
          placeholder="Enter Description"
          required
        />
      </div>

      <button type="submit" className="submit-btn">Submit</button>
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
