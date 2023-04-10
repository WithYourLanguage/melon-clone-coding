const audio = document.querySelector(".playSongAudio");
const songPlayIcon = document.querySelector(".songPlayBtn");
const totalTime = document.querySelector(".playSong__totalTime");
const viewingTime = document.querySelector(".playSong__viewingTime");
const timeLine = document.querySelector(".playSong__timeLine");
const songPlayDiv = document.querySelector(".songPlayBtnBgDiv");

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
songPlayIcon.addEventListener("click", handleSongPlayIconClick);
audio.addEventListener("loadedmetadata", handleLoadedMetadata);
audio.addEventListener("timeupdate", handleTimeUpdate);
timeLine.addEventListener("input", handleTimelineChange);
window.addEventListener("keydown", handleKeyDown);
songPlayDiv.addEventListener("click", handleSongPlayAClick);
