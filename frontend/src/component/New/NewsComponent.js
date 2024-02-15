import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './NewsComponent.css';
import Slideshow from "./Slideshow";
import Pagination from "react-js-pagination";
import MetaData from '../layout/MetaData';

const NewsComponent = () => {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(8);
  const [totalNews, setTotalNews] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/v1/news')
      .then(response => {
        setNews(response.data);
        setTotalNews(response.data.length);
      })
      .catch(error => {
        console.error('Error fetching news:', error);
      });
  }, []);

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = news.slice(indexOfFirstNews, indexOfLastNews);

  return (
    <div className="news-container">
      <MetaData title="NEWS -- FSHOP" />
      <div className="slideshow">
        <Slideshow />
      </div>
      <h2 className='h2_new'>NEWS</h2>
      <h3 className='h3_new'>Latest news about laptops</h3>
      <div className='layout_new_container' >
        {currentNews.map(item => (
          <div  className='news_card'  key={item._id}>
            <img
              className='image_new'
              src={item.image}
              alt={item.title}
              onClick={() => navigate(`/news/${item._id}`)}
            />
            <div className="news-details">
              {/* Sử dụng Link thay vì onClick để chuyển hướng */}
              <Link to={`/news/${item._id}`} className='news-link' style={{ textDecoration: 'none', color:"#333" }}>
                <h4 className='title_new'>{item.title}</h4>
              </Link>

              <p className='content_new'>{item.content}</p>
            </div>
          </div>
        ))}
      </div>
      {totalNews > newsPerPage && (
        <div className="paginationBox">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={newsPerPage}
            totalItemsCount={totalNews}
            onChange={handlePageChange}
            nextPageText="Next"
            prevPageText="Prev"
            firstPageText="1st"
            lastPageText="Last"
            itemClass="page-item"
            linkClass="page-link"
            activeClass="pageItemActive"
            activeLinkClass="pageLinkActive"
          />
        </div>
      )}
    </div>
  );
};

export default NewsComponent;
