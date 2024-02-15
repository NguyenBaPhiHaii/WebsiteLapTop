const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Lấy tất cả tin tức
router.get('/news', newsController.getAllNews);

// Lấy tin tức theo ID
router.get('/news/:id', newsController.getNewsById);

// Tạo tin tức mới
router.post('/news', newsController.createNews);

// Cập nhật tin tức
router.put('/news/:id', newsController.updateNews);

// Xóa tin tức
router.delete('/news/:id', newsController.deleteNews);

module.exports = router;
