import express from "express";
import upload from "../utils/multer.js";
import * as ResumeController from "../Controllers/resume.js";

const router = express.Router();

router.post(
  "/addResume",
  upload.single("resume"),
  ResumeController.addResume
);

router.get(
  "/get/:user",
  ResumeController.getAllResumesForUser
);

router.get("/get",ResumeController.getResumeForAdmin);

export default router;
