import { resolve } from "path";
import { ProgressPlugin, Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
    entry: "./app.ts",
    output: {
        path: resolve(__dirname, "dist"),
        filename: "[name].[contenthash].js",
        clean: true,
        pathinfo: false,
        publicPath: "/",
    },
    optimization: {
        moduleIds: "deterministic",
        runtimeChunk: "single",
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            "@": resolve(__dirname, "src/"),
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)$/i,
                exclude: resolve(__dirname, "node_modules"),
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
