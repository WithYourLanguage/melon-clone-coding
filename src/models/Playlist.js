import mongoose from "mongoose";
const playlistSchema = new mongoose.Schema({
  playListTitle: { type: String, required: true },
  songsTitle: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      required: true,
    },
  ],
  
  user: { type: String, required: true },
});

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;
