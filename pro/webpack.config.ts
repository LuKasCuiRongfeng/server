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
