import express from "express";
import { fuckRouter, recommendRouter, bigFile } from "./Router";

const app = express();

app.use(express.static("public"));

app.use("/fuck", fuckRouter);
app.use("/recommend", recommendRouter);
app.use("/bigfile", bigFile);

app.listen(2000, () => {
    console.log("success");
});
