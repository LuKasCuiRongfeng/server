import { merge } from "webpack-merge";
import config from "./webpack.config";

const webpackProdConfig = merge(config, {
    mode: "production",
    output: {
        publicPath: "./",
    },
    devtool: "source-map",
});

export default webpackProdConfig;
