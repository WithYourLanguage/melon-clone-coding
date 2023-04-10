import Song from "../models/Song";
import User from "../models/User";

export const getLogin = (req, res) => {
  return res.render("login");
};

export const postLogin = (req, res) => {
  const { email, password } = req.body;
  console.log(`Email: ${email}, Password: ${password}`);
  console.log("post login");
  return res.send();
};

export const getJoin = (req, res) => {
  return res.render("join");
};

export const postJoin = async (req, res) => {
  const { email, password, password2, name } = req.body;
  if (password !== password2) {
    req.flash("error", "Password가 같지 않습니다");
    console.log("password가 같지 않습니다");
    return res.redirect("/");
  }
  await User.create({
    email,
    password,
    password2,
    name,
  });
  return res.redirect("/login");
};
