import express from "express";
import { fuckRouter, recomandRouter } from "./Router";

const app = express();

app.use(express.static("public"));

app.use("/fuck", fuckRouter);
app.use("/recomand", recomandRouter);

app.listen(2000, () => {
    console.log("success");
});
