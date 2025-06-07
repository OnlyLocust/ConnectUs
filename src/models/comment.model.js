import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        }})

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;