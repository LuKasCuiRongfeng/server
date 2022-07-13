import webpack from "webpack";
import config from "./webpack.config.main";
import waitOn from "wait-on";
import { ChildProcess, spawn, exec } from "child_process";
import minimist from "minimist";
import chalk from "chalk";
// import ora from "ora";

// 启动electron的shell子进程
let subprocess: ChildProcess;
// 查询所有进程id 的shell子进程
let subprocessTasklist: ChildProcess;

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

        console.log(
            chalk.cyan(
                "[√] main is going to be compiled successfully, waiting for render to be compiled completely ...\n"
            )
        );

        await waitOn({
            resources: [`http://localhost:12345`],
        });

        console.log(
            chalk.yellow(
                "[√] render compiled successfully, ready to run electron ...\n"
            )
        );

        // 注意这里只是杀死了衍生的shell进程，根本没杀死启动的electron进程
        subprocess && process.kill(subprocess.pid, "SIGKILL");

        subprocessTasklist && subprocessTasklist.kill(9);

        // windows 下遍历寻找electron进程并杀死
        subprocessTasklist = exec("tasklist", (err, stdout, stderr) => {
            stdout.split("\n").forEach(line => {
                const msgs = line.trim().split(/\s+/);
                const pname = msgs[0];
                const pid = msgs[1];
                if (pname.indexOf("electron") > -1) {
                    process.kill(+pid);
                }
            });
        });

        // windows 下的 cmd 不能执行electron，改用 powershell执行
        if (process.platform === "win32") {
            subprocess = spawn("powershell", [
                "electron",
                ".",
                `${argv.debug ? "--inspect=5858" : ""}`,
            ]);
        } else {
            subprocess = spawn("electron", [
                ".",
                `${argv.debug ? "--inspect=5858" : ""}`,
            ]);
        }

        subprocess.stdout.on("data", data => {
            console.log(chalk.blueBright(data));
        });
        subprocess.stderr.on("data", data => {
            console.error(chalk.red(data));
        });
        subprocess.on("close", code => {
            console.log(
                chalk.yellow(
                    `[?] supprocess has exited, and exit code is : ${code}`
                )
            );
        });
        subprocess.on("error", err => {
            console.error(chalk.red("[X] failed to start subprocess.", err));
        });

        console.log("subprocessTasklist: ", subprocessTasklist?.pid);
        console.log("subprocess: ", subprocess?.pid);

        // spinner.stop();
    }
);
