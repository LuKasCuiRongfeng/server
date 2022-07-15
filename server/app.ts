import express from "express";
import { Router } from "./Router";

const PORT = 2000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

new Router(app);

app.listen(PORT, () => {
    console.log(`Server listening port ${PORT}`);
});
