import express from "express";
import { PopularSongs, getMusicUpload, postMusicUpload, playSong } from "../controllers/songController";

const songRouter = express.Router();

songRouter.get("/Popular-songs", PopularSongs);
songRouter.route("/music-upload").get(getMusicUpload).post(postMusicUpload);
songRouter.get("/:id([0-9a-f]{24})/play-song", playSong)

export default songRouter;
