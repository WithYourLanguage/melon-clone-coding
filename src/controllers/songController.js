import Song from "../models/Song";
import User from "../models/User";

export const home = async (req, res) => {
  const songs = await Song.find({});

  console.log(songs);
  return res.render("home", { pageTitle: "Home" });
};
export const PopularSongs = async (req, res) => {
  const songs = await Song.find({}).sort({ views: "desc" }); // 모든 노래를 찾은 뒤 내림차순 정렬
  return res.render("PopularSongs", {
    pageTitle: "Popular Songs",
    songs,
  });
};
export const getMusicUpload = (req, res) => {
  return res.render("musicUpload", { pageTitle: "music Upload" });
};

export const postMusicUpload = async (req, res) => {
  const { title, fileUrl, thumbUrl, artists } = req.body;
  await Song.create({
    title,
    fileUrl,
    thumbUrl,
    artists,
    views: 0,
  });
  console.log("OK 음악 업로드 성공 ✅");
};

export const playSong = async (req, res) => {
  const { id } = req.params;
  const song = await Song.findById(id);
  console.log(song);
  return res.render("playSong", { song });
};
