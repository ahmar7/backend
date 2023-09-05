let dotenv = require("dotenv");
const express = require("express");
let app = express();

let cookieParser = require("cookie-parser");
const cors = require("cors");

let userStructure = require("./db/connection");
let dataRouter = require("./routers/router");
require("./db/connection");
// for cookie generate and db connect
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(dataRouter);
app.use(cookieParser());
//  config({ path: ".env" });

dotenv.config({ path: ".env" });
let port = process.env.PORT;

app.listen(port, () => {
  console.log(`running at ${port}`);
});
