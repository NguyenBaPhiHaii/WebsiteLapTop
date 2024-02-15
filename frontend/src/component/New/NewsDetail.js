import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "./NewsDetail.css"
import Slideshow from "./Slideshow";
// import ArrowBackIcon from "@mui/icons-material/KeyboardArrowLeft";
// import { Link } from "react-router-dom";

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`/api/v1/news/${id}`);
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [id]);

  if (!news) {
    return <p>Loading...</p>;
  }

  return (
    <div className="slideshow">
        <Slideshow />
        
    <div className='container_detailnew'>
    {/* <Link className="logo" to="/news">
              <ArrowBackIcon
                className="custom-arrow-back-icon"
                style={{ fontSize: "40px" }}
              />
        </Link> */}
        <h1 style={{textAlign:"center", marginBottom:"150px"}}>NEWS DETAILS</h1>
      <h2 className='title_detailnew'>{news.title}</h2>
      <img className='image_detailnew' src={news.image} alt={news.title} />
      <p className='content_detailnew'>{news.content}</p>
      <div className='container_detailnew'>
      {/* <img className='image_detailnew' src="https://res.cloudinary.com/dhisthled/image/upload/v1696574524/products/yifcwzxbn1p3nnxnv5d2.jpg" alt={news.title} />
      <p className='content_detailnew'>{news.content}</p> */}
    </div>
    </div>
    </div>
    
  );
};

export default NewsDetail;
