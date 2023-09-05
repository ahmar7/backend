const express = require("express");
let userStructure = require("../db/connection");
let router = new express.Router();
let cookieParser = require("cookie-parser");
let auth = require("../middleware/auth");
let bcrypt = require("bcryptjs");

router.use(cookieParser());

let personalModel = require("../models//model");

router.get("/", (req, res) => {
  res.send("Wordked");
});
router.post("/register", async (req, res) => {
  try {
    let { name, email, phone, work, password, address } = req.body;

    if (!name || !email || !phone || !work || !password || !address) {
      console.log("clear find");
      return res.status(400).send({ message: "Fill all the fields" });
    }

    const userFind = await personalModel.findOne({ email: email });
    if (userFind) {
      console.log(userFind, "old");
      return res.status(400).send({ message: "User already exist" });
    }
    // This method created by me
    // if (userFind.email === email.toLowerCase()) {
    //   console.log(email.toLowerCase(), "old");
    //   return res.status(400).send({ message: "User already exist" });
    // }

    let Users = new personalModel({
      name,
      email,
      phone,
      work,
      password,
      address,
    });
    await Users.save();
    res.status(200).send({ message: "Done" });
  } catch (error) {
    console.log("clear find 2");
    res.status(400).send({ message: error });
  }
});
router.post("/login", async (req, res) => {
  //
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "plz filled the data" });
    }
    res.cookie;
    const userExist = await personalModel.findOne({ email: email });
    console.log(userExist.name, "exist");
    if (userExist) {
      let isMatch = await bcrypt.compare(password, userExist.password);

      if (isMatch) {
        let token = await userExist.generateToken();
        res.cookie("jwttoken", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 1000000),
        });

        console.log(token);
        res.status(200).send({ message: "User successfully loggedin" });
      } else {
        console.log("Error Andar");
        res.status(400).send({ message: "error Andar" });
      }
    } else {
      console.log("Error bahir");
      res.status(400).send({ message: "error Bahir" });
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
});
router.get("/getData", auth, async (req, res) => {
  try {
    await res.status(200).send(req.userFind);
    console.log(req.userFind, "up");
  } catch (error) {
    console.log(error, "bel");
    res.status(400).send(error);
  }
});
router.get("/about", auth, async (req, res) => {
  try {
    await res.send(req.userFind);
  } catch (error) {
    res.status(404).send(error);
    // console.log(error);
  }
});
router.post("/contact", auth, async (req, res) => {
  try {
    let { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.json({ error: "Please fill all the fields" });
    }
    let userContact = await personalModel.findById({ _id: req.userId });

    if (userContact) {
      await userContact.addMessage(name, email, phone, message);
      console.log(message);
      await userContact.save();
      res.status(201).send({ messages: "Suucces" });
    }
  } catch (error) {
    console.log(error);
  }
});
router.get("/logout", async (req, res) => {
  try {
    res.status(200).clearCookie("jwttoken", { path: "/" });
    await res.send("LoggedOut");
    console.log("Done");
  } catch (error) {
    res.status(400).send("No cookie found");
  }
});
module.exports = router;
