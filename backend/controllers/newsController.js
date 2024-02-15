const News = require('../models/newsModel');

// Lấy tất cả tin tức
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy tin tức theo ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News does not exist' });
    }
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Tạo tin tức mới
exports.createNews = async (req, res) => {
  const { title, image, content } = req.body;
  const news = new News({ title, image, content });

  try {
    const newNews = await news.save();
    res.status(201).json(newNews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật tin tức
exports.updateNews = async (req, res) => {
  const { title, image, content } = req.body;

  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News does not exist' });
    }

    if (title) {
      news.title = title;
    }
    if (image) {
      news.image = image;
    }
    if (content) {
      news.content = content;
    }

    const updatedNews = await news.save();
    res.json(updatedNews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa tin tức
exports.deleteNews = async (req, res) => {
    try {
      const news = await News.findById(req.params.id);
      if (!news) {
        return res.status(404).json({ message: 'News does not exist' });
      }
  
      await News.deleteOne({ _id: req.params.id }); // Thay thế remove() bằng deleteOne()
      res.json({ message: 'News deleted successfully' });
    } catch (err) {
      console.error('Error deleting news:', err.message);
      res.status(500).json({ message: 'Server error when deleting news' });
    }
  };
  
  
