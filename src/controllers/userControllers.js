import Song from "../models/Song";
import User from "../models/User";
import bcrypt from "bcrypt";

export const getLogin = (req, res) => {
  return res.render("login");
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    req.flash("formErrorEmail", "Email을 다시 한번 확인해주세요");
    return res.render("login", { pageTitle: "Login" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    req.flash("formErrorPassword", "Password을 다시 한번 확인해주세요");
    return res.render("login", { pageTitle: "Login" });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  req.flash("info", `${user.name}님 로그인에 성공하였습니다`);
  return res.redirect("/");
};

export const getJoin = (req, res) => {
  return res.render("join");
};

export const postJoin = async (req, res) => {
  const { email, password, password2, name } = req.body;
  if (password !== password2) {
    req.flash("error", "Password가 같지 않습니다");
    return res.status(400).render("join");
  }
  try {
    await User.create({
      email,
      password,
      password2,
      name,
    });
  } catch (error) {
    req.flash("error", "죄송합니다. Error이 발생했습니다");
    return res.redirect("/404");
  }
  req.flash("info", `${name}님 회원가입이 완료되었습니다`);
  return res.redirect("/login");
};

export const logout = (req, res) => {
  req.flash("info", "정상적으로 로그아웃 되었습니다");

  req.session.loggedIn = false;
  req.session.loggedInUser = undefined;
  return res.redirect("/");
};
