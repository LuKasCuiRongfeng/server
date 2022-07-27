import { resolve } from "path";
import {
    ProgressPlugin,
    DefinePlugin,
    Configuration as WebpackConfiguration,
} from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";
interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
    entry: "./src/render/main.tsx",
    output: {
        path: resolve(__dirname, "dist/render"),
        filename: "js/[name].[contenthash].js",
        clean: true,
        pathinfo: false,
        publicPath: "./",
    },
    optimization: {
        moduleIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
        },
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "@": resolve(__dirname, "src/render"),
            "@main": resolve(__dirname, "src/main"),
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.less$/i,
                use: ["style-loader", "css-loader", "less-loader"],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/i,
                include: resolve(__dirname, "src/assets"),
                type: "asset/resource",
            },
            {
                test: /\.(ts|js)x?$/i,
                include: resolve(__dirname, "src"),
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                ["@babel/preset-typescript"],
                                ["@babel/preset-react"],
                            ],
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/render/index.html",
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                minifyCSS: true,
            },
        }),
        new ProgressPlugin(),
        new DefinePlugin({
            WEBPACK_GLOBAL: {},
        }),
    ],
};

export default config;
