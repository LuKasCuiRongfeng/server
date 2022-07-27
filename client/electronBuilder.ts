import { Configuration, Platform, build } from "electron-builder";

const config: Configuration = {
    appId: "",
    productName: "FreeChat",
    copyright: "copyright@${author}",
    directories: {
        output: "release/${productName}${version}",
    },
    files: ["dist/**", "icon.ico"],
    electronDownload: {
        version: "19.0.7",
        cache: "./cache",
    },
    mac: {
        artifactName: "${productName}${version}.${ext}",
        target: ["dmg"],
        icon: "icon.png",
    },
    win: {
        target: "nsis",
        artifactName: "${productName}${version}-setup.${ext}",
        icon: "icon.ico",
    },
    nsis: {
        oneClick: false,
        perMachine: false,
        allowToChangeInstallationDirectory: true,
        deleteAppDataOnUninstall: true,
        installerIcon: "icon.ico",
        uninstallerIcon: "icon.ico",
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
