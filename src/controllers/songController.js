import Song from "../models/Song";
import User from "../models/User";
import Playlist from "../models/Playlist";

export const home = async (req, res) => {
  const songs = await Song.find({});
  const user = await User.find({});
  console.log(user);
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
  const { title, fileUrl, thumbUrl, artists, genre } = req.body;
  await Song.create({
    title,
    fileUrl,
    thumbUrl,
    artists,
    views: 0,
    genre,
  });
  console.log("OK 음악 업로드 성공 ✅");
};

export const playSong = async (req, res) => {
  const { id } = req.params;
  const song = await Song.findById(id);
  const playListPlay = false;
  let userLike = false;
  if (req.session.loggedIn) {
    const user = await User.findById(req.session.user._id);
    if (user.likes.includes(id)) {
      userLike = true;
    }
  }

  return res.render("playSong", {
    song,
    pageTitle: song.title,
    userLike,
    playListPlay,
  });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const song = await Song.findById(id);
  if (!song) {
    return res.sendStatus(404);
  }
  song.views = song.views + 1;
  await song.save();
  return res.sendStatus(200);
};

export const nextSong = async (req, res) => {
  const { id } = req.params;
  const song = await Song.findById(id);
  if (!song) {
    return res.sendStatus(404);
  }
  let nextSongPlayListSession = undefined;
  if (req.session.nextSongPlayList) {
    nextSongPlayListSession = req.session.nextSongPlayList;
  } else {
    const nextSongPlayList = await Song.find({ genre: song.genre }).sort({
      views: -1,
    });

    req.session.nextSongPlayList = nextSongPlayList;
    nextSongPlayListSession = nextSongPlayList;
  }
  if (!nextSongPlayListSession) {
    console.log(
      `nextSongPlayListSession값을 찾지 못했습니다. 변수 값 : ${nextSongPlayListSession}`
    );
    return res.sendStatus(404);
  }

  nextSongPlayListSession = nextSongPlayListSession.filter(
    (s) => String(s._id) !== String(song._id)
  );
  req.session.nextSongPlayList = nextSongPlayListSession;

  if (!nextSongPlayListSession[0]) {
    const songs = await Song.find({});
    req.session.nextSongPlayList = songs;
    nextSongPlayListSession = songs;
  }
  if (!nextSongPlayListSession) {
    nextSongPlayListSession.shift();
  }

  res.redirect(`/song/${nextSongPlayListSession[0]._id}/play-song`);
};
export const playlistNextSong = async (req, res) => {
  const { id } = req.params;
  const song = await Song.findById(id);

  if (!song) {
    return res.sendStatus(404);
  }
  let nextSongPlayList = undefined;
  if (req.session.nextSongPlayList) {
    nextSongPlayList = req.session.nextSongPlayList;
  } else {
    const userId = req.session.user;
    const user = await User.findById(userId);
    req.session.nextSongPlayList = user.likes;
    nextSongPlayList = user.likes;
    console.log(nextSongPlayList);
  }
  if (!nextSongPlayList) {
    console.log(
      `nextSongPlayListSession값을 찾지 못했습니다. 변수 값 : ${nextSongPlayList}`
    );
    return res.sendStatus(404);
  }
  console.log(`재생 중인 노래가 삭제 되기 전 : ${nextSongPlayList}`);
  console.log(`song id: ${song.id}`);
  // nextSongPlayList = nextSongPlayList.filter(
  //   (s) => String(s._id) !== String(song._id)
  // ); // 현재 재생 중인 노래를 삭제
  // req.session.nextSongPlayList = nextSongPlayList; // 수정된 변수를 session에 저장
  console.log(`재생 중인 노래가 삭된 후 : ${nextSongPlayList}`);
  if (nextSongPlayList.length === 1) {
    const songs = await Song.find({});
    req.session.nextSongPlayList = songs;
    nextSongPlayList = songs;
  }
  if (!nextSongPlayList) {
    nextSongPlayList.shift();
    req.session.nextSongPlayList = nextSongPlayList;
  }
  nextSongPlayList.shift();
  req.session.nextSongPlayList = nextSongPlayList;
  console.log(`nextSongPlayList: ${nextSongPlayList}`);
  console.log(nextSongPlayList[0]);
  if (!nextSongPlayList[0]._id) {
    return res.redirect(`/song/${nextSongPlayList[0]}/play-song/play-list`);
  }
  return res.redirect(`/song/${nextSongPlayList[0]._id}/play-song/play-list`);
};

export const songLike = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  if (!_id) {
    return res.sendStatus(500);
  }
  const { id } = req.params;
  const user = await User.findById(String(_id));
  const song = await Song.findById(id);
  let like = undefined;

  const songId = song._id.toString();

  const likeArrangement = [song._id];
  let likeStatus = undefined;
  if (user.likes) {
    if (user.likes.includes(songId)) {
      likeStatus = 200;

      User.updateOne({ _id: user.id }, { $pull: { likes: songId } })
        .then(() => {})
        .catch((error) => {
          console.error(error);
        });
    } else {
      likeStatus = 201;

      await User.updateOne(
        { _id: user._id },
        { $push: { likes: likeArrangement } }
      );
    }
  }

  return res.sendStatus(likeStatus);
};
export const myPlayList = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) {
    return res.status(404).redirect("/");
  }
  /*
  ⚠️이 부분은 My Play List를 직접 만들 수 있을 때 이용할 수 있는 코드입니다⚠️
  const playList = await Playlist.find(user._id); // 만약에 user모델 안 쓰면 그냥 req.session.user._id이걸로 바로 검색해도 상관X
  const playListImgFind = await Song.find(playList.songTitle[0])
  const playListImg = playListImg.thumbUrl
  return res.render("myPlayList", { pageTitle: "My Play List", playList, playListImg });
  */
  const playListImg = await Song.findById(user.likes[0]);
  return res.render("myPlayList", { pageTitle: "My Play List", playListImg });
};
export const playListPlay = async (req, res) => {
  const { id } = req.params;
  const song = await Song.findById(id);
  const playListPlay = true;
  //req.session.nextSongPlayList = undefined;
  let userLike = false;
  if (req.session.loggedIn) {
    const user = await User.findById(req.session.user._id);
    if (user.likes.includes(id)) {
      userLike = true;
    }
  }

  return res.render("playSong", {
    song,
    pageTitle: song.title,
    userLike,
    playListPlay,
  });
};
