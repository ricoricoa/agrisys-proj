
      /*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
    
import bcrypt from "bcrypt";
import { User, sequelize } from "../models/userModel.js";
import { FarmerProfile } from "../models/farmerProfileModel.js";
await sequelize.sync();

export const loginPage = (req, res) => res.render("login", { title: "Login" });
export const registerPage = (req, res) => res.render("register", { title: "Register" });
export const forgotPasswordPage = (req, res) => res.render("forgotpassword", { title: "Forgot Password" });
export const dashboardPage = (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  res.render("dashboard", { title: "Dashboard" });
};

export const loginUser = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!email || !password) {
    req.flash("error_msg", "Email at password ay kailangan.");
    return res.redirect("/login");
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      req.flash("error_msg", "Mali ang email o password.");
      return res.redirect("/login");
    }
    req.session.userId = user.id;
    req.session.role = user.role || "farmer";
    req.session.userName = user.name;
    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Login failed:", error);
    req.flash("error_msg", "Hindi makapag-login sa ngayon. Subukan muli.");
    return res.redirect("/login");
  }
};

export const registerUser = async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const contactNumber = String(req.body.contactNumber || "").trim();
  const address = String(req.body.address || "").trim();
  const barangay = String(req.body.barangay || "").trim();
  if (!name || !email || !contactNumber || !address || password.length < 6) {
    req.flash("error_msg", "Kumpletuhin ang pangalan, contact, address, email, at password na hindi bababa sa 6 characters.");
    return res.redirect("/register");
  }
  try {
    if (await User.findOne({ where: { email } })) {
      req.flash("error_msg", "May account na gamit ang email na ito. Mag-login na lang.");
      return res.redirect("/login");
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, contactNumber, password: hashed, role: "farmer" });
    await FarmerProfile.create({ userId: user.id, address, barangay, registrationStatus: "pending" });
    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.userName = user.name;
    req.flash("success_msg", `Matagumpay ang registration. Welcome, ${user.name}!`);
    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Registration failed:", error);
    req.flash("error_msg", "Hindi makapag-register sa ngayon. Subukan muli.");
    return res.redirect("/register");
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
