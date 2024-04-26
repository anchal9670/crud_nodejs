// app.js
const express = require('express');
const database = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const {cloudinaryConnect } = require("./config/cloudinary");
const dotenv = require("dotenv");
dotenv.config({ path: "config/.env" });
const fileUpload = require("express-fileupload");
const app = express();
const bodyParser = require("body-parser");


dotenv.config({ path: "config/.env" });

app.use(
  cors({
    origin: ["http://localhost:5000", "http://localhost:3000", "http://localhost:5173", "https://prepeat.in", "https://admin.prepeat.in", "*"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.raw({ limit: "10mb", type: "image/*" }));

//cloudinary connection
cloudinaryConnect();

app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp",
    })
);


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const port = process.env.PORT || 3000;
database.connect();

// Mount the auth routes
app.use('/api/v1', authRoutes);
app.use('/api/v1',userRoutes);

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
