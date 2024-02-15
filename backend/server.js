const app = require("./app");

const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database")

// Xử lý ngoại lệ chưa được bắt
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
  });


// Cấu hình
dotenv.config({path:"backend/config/config.env"});


// Kết nối với cơ sở dữ liệu
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})


// Từ chối lời hứa chưa được xử lý
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  
    server.close(() => {
      process.exit(1);
    });
  });