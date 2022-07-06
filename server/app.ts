import express from "express";
import { fuckRouter, recommendRouter } from "./Router";

const app = express();

app.use(express.static("public"));

app.use("/fuck", fuckRouter);
app.use("/recommend", recommendRouter);

app.listen(2000, () => {
    console.log("success");
});
