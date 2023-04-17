export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Melon";
  res.locals.loggedInUser = req.session.user || {};

  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "로그인한 유저만 이용할 수 있습니다");
    return res.redirect("/login");
  }
};
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "로그인하지 않은 이용자만 이용할 수 있습니다");
    return res.redirect("/");
  }
};

export const sessionReset = (req, res, next) => {
  const { id } = req.params;
  req.session.nextSongPlayList = undefined;
  console.log("미들웨이를 통과하였습니다!");
  res.redirect(`/song/${id}/play-song/play-list`);
};
