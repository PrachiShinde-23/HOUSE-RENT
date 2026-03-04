const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/connect.js");

const app = express();

//////dotenv config/////////////////////
dotenv.config();


const PORT = process.env.PORT || 8001;


app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://house-rent-frontend.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api/user', require('./routes/userRoutes.js'))
app.use('/api/admin', require('./routes/adminRoutes'))
app.use('/api/owner', require('./routes/ownerRoutes'))
app.use('/api/houses', require('./routes/houseRoutes'))
app.use('/api/bookings', require('./routes/bookingRoutes'))


app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});