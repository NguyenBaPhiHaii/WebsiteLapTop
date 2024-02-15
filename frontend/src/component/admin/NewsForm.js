import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import SideBar from "./Sidebar";
import "./newform.css";

const NewsForm = ({ fetchNews }) => {
  const [newNews, setNewNews] = useState({ title: '', image: '', content: '' });
  const navigate = useNavigate();
  const alert = useAlert();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewNews({ ...newNews, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setNewNews({ ...newNews, image: reader.result });
      };
    }
  };

  const addNews = () => {
    axios.post('/api/v1/news', newNews)
      .then(response => {
        console.log('New news added:', response.data);
        if (typeof fetchNews === 'function') {
          fetchNews(); // Gọi hàm fetchNews nếu nó là một hàm
        }
        setNewNews({ title: '', image: '', content: '' });

        alert.success("Thêm tin tức thành công!");
        navigate('/admin/news');
      })
      .catch(error => {
        console.error('Error adding news:', error);

        if (error.response && error.response.data && error.response.data.message) {
          alert.error(`Đã xảy ra lỗi khi thêm tin tức: ${error.response.data.message}`);
        } else {
          alert.error("Đã xảy ra lỗi khi thêm tin tức!");
        }
      });
  };

  return (
    <div className='new_container'>
      <SideBar />
      <div className='content_container'>
        <h2 className='productListHeading'>CREATE NEWS</h2>
        <form className='form_1' onSubmit={(e) => {
          e.preventDefault();
          addNews();
        }}>
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={newNews.title}
            onChange={handleInputChange}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <textarea
            placeholder="Content"
            name="content"
            value={newNews.content}
            onChange={handleInputChange}
          />
          <button type="submit">Thêm Tin Tức</button>
        </form>
      </div>
    </div>
  );
};

export default NewsForm;
