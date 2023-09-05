const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("Connected");
  })
  .catch((e) => {
    console.log(e);
  });
