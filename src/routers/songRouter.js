import express from "express";
import {
  PopularSongs,
  getMusicUpload,
  postMusicUpload,
  playSong,
  myPlayList,
  playListPlay,
} from "../controllers/songController";
import { sessionReset, protectorMiddleware } from "../middlewares";

const songRouter = express.Router();

songRouter.get("/Popular-songs", PopularSongs);
songRouter.route("/music-upload").get(getMusicUpload).post(postMusicUpload);
songRouter.get("/:id([0-9a-f]{24})/play-song", playSong);
songRouter.get("/:id([0-9a-f]{24})/play-song/play-list/reset", sessionReset);
songRouter.get(
  "/:id([0-9a-f]{24})/play-song/play-list",
  protectorMiddleware,
  playListPlay
);
songRouter.get("/my-play-list", protectorMiddleware, myPlayList);

export default songRouter;
