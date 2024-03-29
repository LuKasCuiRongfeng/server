import { merge } from "webpack-merge";
import config from "./webpack.config";

const webpackDevConfig = merge(config, {
    mode: "development",
    devtool: "eval-cheap-module-source-map",
    devServer: {
        open: false,
        port: 12345,
        static: "./dist/render",
        // historyApiFallback: true,
        // proxy: {
        //     "/api": {
        //         target: "http://localhost:2000",
        //         pathRewrite: { "^/api": "" },
        //     },
        //     secure: false,
        // },
    },
    cache: {
        type: "filesystem",
        allowCollectingMemory: true,
        buildDependencies: {
            config: [__filename],
        },
        compression: "gzip",
        maxAge: 1000 * 60 * 60 * 24,
        // memoryCacheUnaffected: true,
    },
});

export default webpackDevConfig;
