import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from "./Sidebar";
import { useNavigate, useParams } from 'react-router-dom';
import { useAlert } from 'react-alert';

const EditNewsComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [editingNews, setEditingNews] = useState({ _id: '', title: '', image: '', content: '' });
  const alert = useAlert();

  useEffect(() => {
    const fetchNewsToEdit = async () => {
      try {
        const response = await axios.get(`/api/v1/news/${id}`);
        setEditingNews(response.data);
      } catch (error) {
        console.error('Error fetching news for editing:', error);
      }
    };

    fetchNewsToEdit();
  }, [id]);

  const saveEditedNews = () => {
    axios.put(`/api/v1/news/${editingNews._id}`, editingNews)
      .then(response => {
        console.log('News updated:', response.data);
        alert.success("Update news successfully!");
        setTimeout(() => {
          navigate('/admin/news');
        }, 2000);
      })
      .catch(error => {
        console.error('Error updating news:', error);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result;
        setEditingNews(prevEditingNews => ({ ...prevEditingNews, image: imageData }));
      };
      reader.readAsDataURL(file);
    }
  };

  const { title = '', image = '', content = '' } = editingNews;

  return (
    <div className='new_container'>
      <SideBar />
      <div className='content_container'>
        <form className='form_1' onSubmit={(e) => {
          e.preventDefault();
          saveEditedNews();
        }}>
          <input
            type="text"
            placeholder="Tiêu đề mới"
            name="title"
            value={title}
            onChange={(e) => setEditingNews(prevEditingNews => ({ ...prevEditingNews, title: e.target.value }))}
          />
          {image && (
            <img
              src={image}
              alt={title}
              style={{ maxWidth: '100px', maxHeight: '70px', width: '50px', height: '80px', marginLeft: '25px' }}
            />
          )}
          <input
            type="file"
            name="image"
            onChange={(e) => handleImageChange(e)}
          />
          <input
            type="text"
            placeholder="Nội dung mới"
            name="content"
            value={content}
            onChange={(e) => setEditingNews(prevEditingNews => ({ ...prevEditingNews, content: e.target.value }))}
          />
          <button type="submit">Lưu chỉnh sửa</button>
        </form>
      </div>
    </div>
  );
};

export default EditNewsComponent;
