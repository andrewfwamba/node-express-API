const express = require("express");
require("dotenv").config();

require("./models/db");
const User = require("./models/user");
const userRouter = require("./routes/user");

const app = express();

// app.use((req,res, next)=> {
//     req.on('data', chunk => {
//         const data = JSON.parse(chunk);
//         req.body = data;
//         next();
//     })
// })

app.use(express.json());

app.use(userRouter);

const test = async (email, password) => {
  const user = await User.findOne({ email: email });
  const result = await user.comparePassword(password);
  console.log(result);
};
test("steine112@gmail.com", "rerere2020");

app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend is linked" });
});

app.listen(8000, () => {
  console.log("Port is listening at 8000");
});
