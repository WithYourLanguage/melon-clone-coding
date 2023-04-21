import mongoose from "mongoose";
const genreViewSchema = new mongoose.Schema({
  genre: { type: String },
  views: { type: Number },
});

const GenreView = mongoose.model("GenreView", genreViewSchema);

export default GenreView;
