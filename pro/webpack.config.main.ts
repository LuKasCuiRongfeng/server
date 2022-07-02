import { resolve } from "path";
import { ProgressPlugin, Configuration } from "webpack";

const config: Configuration = {
    entry: "./src/main/index.ts",
    output: {
        path: resolve(__dirname, "dist/main"),
        filename: "main.js",
        clean: true,
        pathinfo: false,
        publicPath: "/",
    },
    optimization: {
        moduleIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
        },
    },
    externals: ["electron"],
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            main: resolve(__dirname, "src/main"),
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)?$/i,
                include: resolve(__dirname, "src/main"),
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [["@babel/preset-typescript"]],
                        },
                    },
                ],
            },
        ],
    },
    plugins: [new ProgressPlugin()],
};

export default config;
