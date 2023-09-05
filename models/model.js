const mongoose = require("mongoose");
let bcrypt = require("bcryptjs");
let validator = require("validator");
let jwt = require("jsonwebtoken");

const personalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error("Invalid Email");
      }
    },
  },
  phone: {
    type: Number,
    required: true,
  },
  work: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
  messages: [
    {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: Number,
      },
      message: {
        type: String,
      },
    },
  ],
});
personalSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});
personalSchema.methods.generateToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    // this.tokens = this.tokens.splice(1, 2, { token: token });
    await this.save();

    return token;
  } catch (error) {
    console.log(error);
  }
};
personalSchema.methods.addMessage = async function (
  name,
  email,
  phone,
  message
) {
  try {
    this.messages = this.messages.concat({ name, email, phone, message });
    await this.save();
    return this.messages;
  } catch (error) {
    // res.status(401).send(error);
    console.log(error);
  }
};
let personalModel = mongoose.model("User", personalSchema);

module.exports = personalModel;
