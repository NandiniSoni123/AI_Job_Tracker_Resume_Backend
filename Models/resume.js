import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    resume_name:{
        type:String,
        require:true
    },
    job_desc:{
        type:String,
        required:true
    },
    score:{
        type:String,
    },
    feedback:{
        type:String,
    }
},{timestamps:true})

const ResumeModel = mongoose.model("resume",ResumeSchema);

export default ResumeModel