import webpack from "webpack";
import config from "./webpack.config.main";
import waitOn from "wait-on";
import { ChildProcess, spawn } from "child_process";
import minimist from "minimist";
import chalk from "chalk";
// import ora from "ora";

let childProcess: ChildProcess;

const compiler = webpack(config);

const argv = minimist(process.argv.slice(2));

// const spinner = ora({
//     text: "webpack 开始执行 main 和render 的编译 ...",
// }).start();

compiler.watch(
    {
        aggregateTimeout: 500,
        poll: 1000,
    },
    async (err, stats) => {
        if (err) {
            console.error(err.stack || err);
            return;
        }
        const info = stats.toJson("minimal");
        if (stats.hasErrors()) {
            console.error(info.errors);
        }
        if (stats.hasWarnings()) {
            console.log(info.warnings);
        }

        console.log(chalk.cyan("main 编译完成, 等待render编译完成 ..."));

        await waitOn({
            resources: [`tcp:12345`],
        });

        console.log(chalk.yellow("开始执行electron 命令"));

        if (childProcess != null) {
            childProcess.kill();
        }

        childProcess = spawn("electron", [
            ".",
            `${argv.debug ? "--inspect=5858" : ""}`,
        ]);

        childProcess.stdout.on("data", data => {
            console.log(chalk.blueBright(data));
        });
        childProcess.stderr.on("data", data => {
            console.error(chalk.red(data));
        });
        childProcess.on("close", code => {
            console.log(chalk.yellow(`进程退出, 退出码: ${code}`));
        });
        childProcess.on("error", err => {
            console.error(chalk.red("Failed to start subprocess.", err));
        });

        // spinner.stop();
    }
);
