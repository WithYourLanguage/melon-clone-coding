import Song from "../models/Song";
import User from "../models/User";
//import Playlist from "../models/Playlist";
import GenreView from "../models/genreView";

export const home = async (req, res) => {
  const songs = await Song.find({}).sort({ views: "desc" }).limit(15);
  const beatSongs = await Song.find({ genre: "beat" }).limit(15).sort({
    views: -1,
  });
  const jazzSongs = await Song.find({ genre: "jazz" }).limit(15).sort({
    views: -1,
  });
  const genreView = await GenreView.find({}).sort({ views: "desc" });
  const user = await User.find({});
  console.log(user);
  console.log(genreView);
  return res.render("home", {
    pageTitle: "Home",
    songs,
    beatSongs,
    jazzSongs,
    genreView,
  });
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
export const registerViewGenre = async (req, res) => {
  console.log("OKOKOK");
  const { id } = req.params;
  const song = await Song.findById(id);
  if (!song) {
    return res.sendStatus(404);
  }

  const genreView = await GenreView.findOne({ genre: song.genre });
  if (!genreView) {
    return res.sendStatus(404);
  }
  genreView.views = genreView.views + 1;
  await genreView.save();

  return res.sendStatus(200);
};

export const nextSong = async (req, res) => {
  console.log("✅ NEXT SONG");
  if (!req.session.loggedIn) {
    console.log("IFs");
    req.flash(
      "error",
      "다음 노래를 바로 이어서 듣고 싶으시다면 로그인을 진행해 주세요"
    );
    return res.redirect("/join");
  }
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
  console.log("PLAY LIST요청으로 들어왔어요");
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

  console.log(`재생 중인 노래가 삭된 후 : ${nextSongPlayList}`);
  if (nextSongPlayList.length === 0) {
    console.log("노래가 1개밖에 남지 않았어요");
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
  if (!nextSongPlayList[0] || !nextSongPlayList[0]._id) {
    if (nextSongPlayList.length === 0) {
      console.log("노래가 1개밖에 남지 않았어요");
      const songs = await Song.find({});
      req.session.nextSongPlayList = songs;
      nextSongPlayList = songs;
    } else {
      nextSongPlayList.shift();
    }
  }
  
  if(!nextSongPlayList[0]._id) {
    return res.redirect(`/song/${nextSongPlayList[0]}/play-song/play-list`);
  }
  return res.redirect(`/song/${nextSongPlayList[0]._id}/play-song/play-list`);
};
// export const songLike = async (req, res) => {
//   const {
//     user: { _id },
//   } = req.session;
//   if (!_id) {
//     return res.sendStatus(404);
//   }
//   const { id } = req.params;
//   const user = await User.findById(String(_id));
//   const song = await Song.findById(id);
//   let like = undefined;

//   const songId = song._id.toString();

//   const likeArrangement = [song._id];
//   let likeStatus = undefined;
//   if (user.likes) {
//     if (user.likes.includes(songId)) {
//       likeStatus = 200;
//       User.updateOne({ _id: user.id }, { $pull: { likes: songId } })
//         .then(() => {})
//         .catch((error) => {
//           console.error(error);
//         });
//     } else {
//       likeStatus = 201;
//       await User.updateOne(
//         { _id: user._id },
//         { $push: { likes: likeArrangement } }
//       );
//     }
//   }
//   console.log("LIKE OK");
//   return res.sendStatus(likeStatus);
// };
// export const songLike = async (req, res) => {
//   console.log("승인!");
//   const {
//     user: { _id },
//   } = req.session;
//   if (!_id) {
//     return res.sendStatus(404);
//   }
//   const { id } = req.params;
//   const user = await User.findById(String(_id));
//   const song = await Song.findById(id);
//   let like = undefined;

//   const songId = song._id.toString();
//   console.log(songId, includes(songId));
//   console.log("✅✅✅✅✅");
//   const likeArrangement = [song._id];
//   let likeStatus = undefined;
//   if (user.likes) {
//     if (user.likes.includes(songId)) {
//       likeStatus = 203;
//       User.updateOne({ _id: user._id }, { $pull: { likes: songId } })
//         .then(() => {})
//         .catch((error) => {
//           console.error(error);
//         });
//     } else {
//       likeStatus = 201;

//       await User.updateOne(
//         { _id: user._id },
//         { $push: { likes: likeArrangement } }
//       );
//     }
//   }

//   return res.sendStatus(likeStatus);
// };
// export const songLike = async (req, res) => {
//   console.log("요청쓰");
//   return res.status(200).send("Liked");

//   return;
//   const {
//     user: { _id },
//   } = req.session;
//   if (!_id) {
//     console.log("No Id");
//     return;
//   }
//   const { id } = req.params;

//   const user = await User.findById(String(_id));
//   const song = await Song.findById(id);
//   let like = undefined;
//   console.log(`user like : ${user.likes}`);
//   const songId = song._id.toString();

//   console.log("⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔");

//   console.log(user.likes.includes(songId));
//   console.log(user.likes);
//   console.log("⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔");
//   const likeArrangement = [song._id];
//   let likeStatus = undefined;
//   if (user.likes) {
//     if (user.likes.includes(songId)) {
//       //  === String(video._id)
//       like = song.like - 1;
//       console.log("이미 좋아요 눌렀음 ✅");
//       likeStatus = 200;
//       //await Video.findByIdAndDelete(id);
//       //await User.findOneAndDelete({ like: video.title });
//       // await User.findByIdAndUpdate(_id, {
//       //   $set: { like: null },
//       // });

//       // user.like = undefined;
//       // await user.save();
//       console.log(user.id, songId, user.likes);
//       console.log("🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊");
//       User.updateOne({ _id: user.id }, { $pull: { likes: songId } })
//         .then(() => {
//           console.log(`User ${user.username}의 like에서 ${songId} 삭제 완료`);
//           console.log(`Like 값 -1 하여${like}으로 변경 완료`);
//         })
//         .catch((error) => {
//           console.error(error);
//         });

//       //return;
//     } else {
//       console.log("좋아요를 누르지 않았음 ❌");
//       likeStatus = 201;
//       like = song.like + 1;
//       console.log(`Like : ${like}`);
//       await User.updateOne(
//         { _id: user._id },
//         { $push: { likes: likeArrangement } }
//       );
//     }
//   }
//   //const likeArrangement = [mongoose.Types.ObjectId(video._id)];

//   console.log(`commentId✅✅✅✅✅✅ : ${id.commentId}, Like : ${like}`);
//   console.log("✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅");
//   await Song.findByIdAndUpdate(id.commentId, {
//     like,
//   });

//   /*user.like.push([video._id.toString()]);
//   await user.save();*/
//   // await User.findByIdAndUpdate(_id, {
//   //   like: video._id,
//   // });

//   return res.sendStatus(likeStatus);
// };
// export const songLike = async (req, res) => {
//   console.log("✅✅✅✅✅✅✅✅✅✅")
//   const {
//     user: { _id },
//   } = req.session;
//   if (!_id) {
//     return res.sendStatus(500);
//   }
//   const { id } = req.params;
//   const user = await User.findById(String(_id));
//   const song = await Song.findById(String(id));
//   let like = undefined;
//   const songId = song._id.toString();

//   const likeArrangement = [song._id];
//   let likeStatus = undefined;
//   if (user.likes) {
//     if (user.likes.includes(songId)) {
//       console.log("이미 좋아요 눌렀음")
//       likeStatus = 200;
//       User.updateOne({ _id: user.id }, { $pull: { likes: songId } })
//         .then(() => {})
//         .catch((error) => {
//           console.error(error);
//         });
//     } else {
//       likeStatus = 201;
//       console.log("좋아요 안 눌렀음")
//       await User.updateOne(
//         { _id: user._id },
//         { $push: { likes: likeArrangement } }
//       );
//     }
//   }

//   return res.sendStatus(likeStatus);
// };
export const songLike = async (req, res) => {
  console.log("✅✅✅✅✅✅✅✅✅✅");
  const {
    user: { _id },
  } = req.session;
  if (!_id) {
    return res.sendStatus(500);
  }
  const { id } = req.params;
  const user = await User.findById(String(_id));
  const song = await Song.findById(String(id));
  let like = undefined;
  const songId = song._id.toString();

  const likeArrangement = [song._id];
  let likeStatus = undefined;
  if (user.likes) {
    if (user.likes.includes(songId)) {
      console.log("이미 좋아요 눌렀음");
      likeStatus = 200;
      await User.updateOne({ _id: user.id }, { $pull: { likes: songId } });
    } else {
      likeStatus = 201;
      console.log("좋아요 안 눌렀음");
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
export const genreBeat = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    // 404페이지 렌더링
    return res.status(404).redirect("/"); // 임시로 해 놓은거임
  } else if (id !== "beat" && id !== "jazz") {
    return res.status(404).render("error404", { pageTitle: "404" });
    return res.status(404).redirect("/"); // 임시로 해 놓은거임
  }
  const genreList = await Song.find({ genre: id }).sort({
    views: -1,
  });

  return res.render("genreBeat", { genreList, id, pageTitle: "genre beat" });
};
