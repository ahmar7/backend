const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://root:root@cluster1.pdjfuml.mongodb.net/firstMERN")
  .then(() => {
    console.log("Connected");
  })
  .catch((e) => {
    console.log(e);
  });
