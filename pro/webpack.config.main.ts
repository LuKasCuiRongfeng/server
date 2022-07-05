import { resolve } from "path";
import { ProgressPlugin, Configuration } from "webpack";

const config: Configuration = {
    mode: "production",
    entry: {
        main: "./src/main/index.ts",
    },
    output: {
        path: resolve(__dirname, "dist/main"),
        filename: "[name].js",
        clean: true,
        pathinfo: false,
        publicPath: "/",
    },
    devtool: "source-map",
    optimization: {
        moduleIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
        },
    },
    target: "node",
    externals: {
        electron: "commonjs2 electron",
    },
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
