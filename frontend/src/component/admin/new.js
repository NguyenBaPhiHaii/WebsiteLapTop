import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { DataGrid as DataGridComponent } from "@material-ui/data-grid";
import "./new.css";
import "./productList.css";
import SideBar from "./Sidebar";

const AdminComponent = () => {
  const [news, setNews] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [deletedNewsId, setDeletedNewsId] = useState(null);

  useEffect(() => {
    fetchNewsData();
  }, []);

  const fetchNewsData = () => {
    axios.get('/api/v1/news')
      .then(response => {
        setNews(response.data);
      })
      .catch(error => {
        console.error('Error fetching news:', error);
      });
  };

  const deleteNews = (id) => {
    setDeletedNewsId(id);
    setShowConfirmationDialog(true);
  };

  const confirmDelete = () => {
    axios.delete(`/api/v1/news/${deletedNewsId}`)
      .then(response => {
        console.log('News deleted:', response.data);
        fetchNewsData();
        setShowConfirmationDialog(false);
      })
      .catch(error => {
        console.error('Error deleting news:', error);
        setShowConfirmationDialog(false);
      });
  };

  const cancelDelete = () => {
    setShowConfirmationDialog(false);
  };

  const formattedRows = news.map(item => ({
    id: item._id,
    title: item.title,
    image: item.image,
    content: item.content,
    __v: item.__v
  }));

  const columns = [
    { field: 'id', headerName: 'ID', flex: .8 },
    { field: 'title', headerName: 'Title', flex: 0.6 },
    {
      field: 'image',
      headerName: 'Image',
      flex: 0.4,
      renderCell: (params) => (
        <img
          src={params.value}
          alt={params.row.title}
          style={{ maxWidth: '100px', maxHeight: '70px', width: '50px', height: '80px' }}
        />
      ),
    },
    { 
      field: 'content', 
      headerName: 'Content', 
      flex: 1.5,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      renderCell: (params) => (
        <div className="button-container">
          <button className='delete_new' onClick={() => deleteNews(params.row.id)}>Delete</button>
          <Link to={`/admin/editnews/${params.row.id}`} className='update_new'>
            Update
          </Link>
        </div>
      ),
    },
  ];
  

  return (
    <div className='new_container'>
      <SideBar />
      <div className='content_container'>
        <h2 className='productListHeading'>ALL NEWS</h2>
        <div style={{ height: 625, width: '100%' }}>
  <DataGridComponent
    rows={formattedRows}
    columns={columns}
    pageSize={8}
    disableSelectionOnClick
  />
</div>

        {showConfirmationDialog && (
          <div className="overlay">
            <div className="confirmation-dialog">
              <p className="confirm-h1">{`Are you sure you want to delete this news?`}</p>
              <div className="btn-container">
                <p className="confirm-p">{`Delete news with ID ${deletedNewsId}?`}</p>
                <button onClick={() => cancelDelete()} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={() => confirmDelete()} className="confirm-btn">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComponent;
