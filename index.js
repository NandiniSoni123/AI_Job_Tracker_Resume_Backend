import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from './conn.js'
import mongoose from "mongoose";
import "./conn.js";
import cors from "cors";
// import path from 'path';
// import { fileURLToPath } from "url";





// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);



import UserRoutes from "./Routes/user.js";
import ResumeRoutes from "./Routes/resume.js";

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors({
  credentials:true,
  origin:"http://localhost:5173"
}))

// console.log("UserRoutes:", UserRoutes);
// console.log("ResumeRoutes:", ResumeRoutes);

app.use("/api/user", UserRoutes);
app.use("/api/resume", ResumeRoutes);

// Server static files from the react app's build folder
// app.use(express.static(path.join(__dirname,"build")));

// Handle react routing,return index.html for all other requests
// app.get("/",(req,res)=>{
//   res.sendFile(path.join(__dirname,"build","index.html"));
// });

app.listen(PORT, () => {
  connectDb()
  console.log("Backend created successfully on port", PORT);
});



















































// const express = require ('express');

// const app = express();
// const PORT = 4000;

// require('./conn');
// app.use(express.json());

// const UserRoutes = require('./Routes/user');
// const ResumeRoutes = require('./Routes/resume');

// app.use('/api/user',UserRoutes)
// app.use('/api/resume',ResumeRoutes);

// app.listen(PORT,()=>{
//     console.log("Backend created successfully on port",PORT);
// })