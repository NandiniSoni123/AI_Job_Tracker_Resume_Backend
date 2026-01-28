
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import ResumeModel from "../Models/resume.js";
import fs from "fs";
// import pdfParse from "pdf-parse";
import fetch from "node-fetch";
import path from "path";


const { response } = require("express");



export const addResume = async (req, res) => {
  try {
    if (!process.env.COHERE_API_KEY) {
      return res.status(500).json({
        error: "COHERE_API_KEY missing in server"
      });
    }

    const COHERE_API_KEY = process.env.COHERE_API_KEY;

    const { job_desc, user } = req.body;

    if (!job_desc) return res.status(400).json({ message: "job_desc required" });
    if (!req.file) return res.status(400).json({ message: "Resume not uploaded" });

    const pdfPath = req.file.path;
    const pdfData = await pdfParse(fs.readFileSync(pdfPath));

    const chatResponse = await fetch("https://api.cohere.com/v1/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command-a-03-2025",
        message: `
Return strictly in this format:
Score: <number>
Reason: <text>

Resume:
${pdfData.text}

Job Description:
${job_desc}
        `
      })
    });

    const data = await chatResponse.json();
    if (!chatResponse.ok) {
      return res.status(500).json({ error: data.message });
    }

    const aiResult = data.text;

    // extract score & feedback
    const scoreMatch = aiResult.match(/Score:\s*(\d+)/);
    const reasonMatch = aiResult.match(/Reason:\s*([\s\S]*)/);

    const score = scoreMatch ? Number(scoreMatch[1]) : 0;
    const feedback = reasonMatch ? reasonMatch[1].trim() : "No feedback";

    const newResume = await ResumeModel.create({
      user,
      resume_name: req.file.originalname,
      job_desc,
      score,
      feedback
    });

    fs.unlinkSync(pdfPath);

    return res.status(200).json({
      message: "Your analysis is ready",
      data: newResume
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
};


export const getAllResumesForUser = async (req, res) => {
  try {
    const { user } = req.params;

    const resumes = await ResumeModel
      .find({ user })
      .sort({ createdAt: -1 }); 

    return res.status(200).json({
      message: "Your Previous History",
      resumes
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
};

export const getResumeForAdmin = async(req,res)=>{
  try {
    const resumes = await ResumeModel
      .find({})
      .sort({ createdAt: -1 }).populate('user'); 

    return res.status(200).json({
      message: "Fetched All History",
      resumes
   }); 

  } catch (err) {
     console.error(err);
    return res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
}


































































