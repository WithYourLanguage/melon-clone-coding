const audio = document.querySelector(".playSongAudio");
const songPlayIcon = document.querySelector(".songPlayBtn");
const totalTime = document.querySelector(".playSong__totalTime");
const viewingTime = document.querySelector(".playSong__viewingTime");
const timeLine = document.querySelector(".playSong__timeLine");
const songPlayDiv = document.querySelector(".songPlayBtnBgDiv");
const playSongBgDiv = document.querySelector(".playSong_bgDiv");
const playSongHeart = document.querySelector(".playSong__heart");

let songPlayBtnChang = false;

const playCheck = () => {
  if (audio.paused) {
    // audio play되는 중...
    songPlayIcon.classList = "songPlayBtn fa-solid fa-play";
  } else {
    // audio가 멈춰 있는 경우
    songPlayIcon.classList = "songPlayBtn fa-solid fa-pause";
  }
};
const audioPlay = () => {
  if (!audio.paused) {
    // audio play되는 중...
    audio.pause();
    songPlayIcon.classList = "songPlayBtn fa-solid fa-play";
  } else {
    // audio가 멈춰 있는 경우
    audio.play();
    songPlayIcon.classList = "songPlayBtn fa-solid fa-pause";
  }
};
const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(15, 4);

const handleSongPlayIconClick = () => {
  songPlayBtnChang = true;
  audioPlay();
};

const handleLoadedMetadata = () => {
  playCheck();
  viewingTime.innerText = formatTime(Math.floor(audio.duration));
  timeLine.max = Math.floor(audio.duration);
};

const handleTimeUpdate = () => {
  playCheck();
  totalTime.innerText = formatTime(Math.floor(audio.currentTime));
  timeLine.value = Math.floor(audio.currentTime);
};
const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  audio.currentTime = value;
};

const handleKeyDown = (event) => {
  if (event.code === "Space") {
    handleSongPlayIconClick();
  }
};

const handleSongPlayAClick = (event) => {
  if (songPlayBtnChang) {
    songPlayBtnChang = false;
    return;
  }
  audioPlay();
};

// const handleAudioEnded = async () => {
//   const { id } = playSongBgDiv.dataset;
//   await fetch(`/api/song/${id}/view`, {
//     method: "POST",
//   });
//   await fetch(`/api/song/${id}/nextSong`, {
//     method: "POST",
//   });
// };
const handleAudioEnded = async () => {
  const { id } = playSongBgDiv.dataset;
  const { playList } = playSongBgDiv.dataset;
  fetch(`/api/song/${id}/view`, {
    method: "POST",
  });
  await fetch(`/api/song/${id}/view/genre`, {
    method: "POST",
  });
  if (playList === false) {
    fetch(`/api/song/${id}/next-song`, {
      method: "POST",
    }).then((res) => {
      if (res.redirected) {
        window.location.href = res.url;
      }
    });
  } else {
    fetch(`/api/song/${id}/next-song/play-list`, {
      method: "POST",
    }).then((res) => {
      if (res.redirected) {
        window.location.href = res.url;
      }
    });
  }
};

const handleLikeDivClick = async () => {
  const { id } = playSongBgDiv.dataset;
  const response = await fetch(`/api/song/${id}/like`, {
    method: "POST",
  });
  if (response.status === 201) {
    playSongHeart.classList = "fa-solid fa-heart playSong__heart";
  } else {
    playSongHeart.classList = "fa-regular fa-heart playSong__heart";
  }
};

songPlayIcon.addEventListener("click", handleSongPlayIconClick);
audio.addEventListener("loadedmetadata", handleLoadedMetadata);
audio.addEventListener("timeupdate", handleTimeUpdate);
timeLine.addEventListener("input", handleTimelineChange);
window.addEventListener("keydown", handleKeyDown);
songPlayDiv.addEventListener("click", handleSongPlayAClick);
audio.addEventListener("ended", handleAudioEnded);
if (playSongHeart) {
  console.log("버튼 있닭ㄷㄴ");
  playSongHeart.addEventListener("click", handleLikeDivClick);
}
