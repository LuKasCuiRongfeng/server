import express from "express";
import { fuckRouter } from "./Router"

const app = express();

app.use(express.static("public"));

app.use("/fuck", fuckRouter);

app.listen(2000, () => {
  console.log("success");
});
