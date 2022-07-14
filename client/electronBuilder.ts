import { Configuration, Platform, build } from "electron-builder";

const config: Configuration = {
    appId: "",
    productName: "fullstack",
    copyright: "copyright@${author}",
    directories: {
        output: "release/${productName} ${version}",
    },
    files: ["dist/**"],
    // electronDownload: {
    //     version: "19.0.7",
    //     cache: "./electron-cache",
    // },
    mac: {
        artifactName: "${productName} ${version}.${ext}",
        target: ["dmg"],
        icon: "icon.png",
    },
    win: {
        target: "nsis",
        artifactName: "${productName} Setup ${version}.${ext}",
        icon: "build/icon.ico",
    },
    nsis: {
        oneClick: false,
        perMachine: false,
        allowToChangeInstallationDirectory: true,
        deleteAppDataOnUninstall: true,
        installerIcon: "build/icon.ico",
        uninstallerIcon: "build/icon.ico",
    },
};

async function buildElectron() {
    try {
        const res = await build({
            targets: Platform.WINDOWS.createTarget(),
            config,
        });
        console.log(JSON.stringify(res));
    } catch (err) {
        console.error(err);
    }
}

buildElectron();
