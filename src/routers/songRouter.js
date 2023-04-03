import express from "express";
import { PopularSongs, getMusicUpload, postMusicUpload } from "../controllers/songController";

const songRouter = express.Router();

songRouter.get("/Popular-songs", PopularSongs);
songRouter.route("/music-upload").get(getMusicUpload).post(postMusicUpload);

export default songRouter;
