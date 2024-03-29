import { resolve } from "path";
import { ProgressPlugin, Configuration } from "webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";

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
        publicPath: "./",
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
            "@main": resolve(__dirname, "src/main"),
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)$/i,
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
    plugins: [
        new ProgressPlugin(),
        new CopyWebpackPlugin({
            patterns: [{ from: "src/main/preload", to: "preload" }],
        }),
    ],
    // 启用cache加速打包
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
};

export default config;
