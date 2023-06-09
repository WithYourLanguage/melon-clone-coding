import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";
import rootRouter from "./routers/rootRouter";
import apiRouter from "./routers/apiRouter";
import { error404 } from "./controllers/userControllers";

import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const logger = morgan("dev");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(flash());
app.use(localsMiddleware);

app.locals.toUpperCase = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

app.use("/uploads", express.static("uploads"));
app.use("/img", express.static("img"));

app.use("/static", express.static("assets"));

app.use("/api", apiRouter);
app.use("/", rootRouter);
/*
Add more routers here!
*/
app.use("/", error404);

export default app;
