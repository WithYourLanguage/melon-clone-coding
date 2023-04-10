import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  artists: { type: String, required: true },
  thumbUrl: { type: String, required: true },
  views: { type: Number, required: true },
  genre: { type: String },
});

const Song = mongoose.model("Song", songSchema);

export default Song;
