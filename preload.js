const {
    ipcRenderer,
    contextBridge,
    shell
} = require('electron');

const ftp = require("basic-ftp");
const path = require("path");

const { setWindowConsole }  = require("./console.js");
window.console = setWindowConsole(window.console);

// progress bar
function updateProgress(progress, text="") {
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = progress + "%";

    const progressBarText = document.querySelector('.progress-bar-text');
    progressBarText.textContent = text;

    if (progress === 100) {
        setTimeout(() => {
            const progressBarC = document.querySelector('.progress-container');
            progressBarC.classList.remove("active");

            // enable buttons

            const buttons = document.querySelectorAll('button');
            buttons.forEach((button) => {
                button.removeAttribute("disabled");
            });

        }, 1000)
    }

}
function toggleProgress() {
    const progressBar = document.querySelector('.progress-container');
    progressBar.classList.toggle("active");

    if (progressBar.classList.contains("active")) {
        updateProgress(0);

        // disable buttons

        const buttons = document.querySelectorAll('button');
        buttons.forEach((button) => {
            button.setAttribute("disabled", "true");
        });
        
    } else {
        updateProgress(100);

        // enable buttons

        const buttons = document.querySelectorAll('button');
        buttons.forEach((button) => {
            button.removeAttribute("disabled");
        });

    }
}



contextBridge.exposeInMainWorld("os", {
    // open in local browser
    openUrl: (url) => {
        // nodejs open in browser
        shell.openExternal(url);
    },
    setWindowConsole
});

contextBridge.exposeInMainWorld("ftp", {
    getDirname: () => __dirname,
    getAllFiles: async (files, options) => {
        return new Promise(async (resolve, reject) => {
            let {
                FTP_HOST,
                FTP_USER,
                FTP_PASS,
                FTP_SECURE,
                FTP_LOCALPATH,
                FTP_EXTPATH,
                FTP_PORT,
                FTP_VERBOSE
            } = options;

            // set verbose if undefined
            if (FTP_VERBOSE === undefined) {
                FTP_VERBOSE = false;
            }

            // check all options are set
            if (!FTP_HOST || !FTP_USER || !FTP_PASS || !FTP_LOCALPATH || !FTP_EXTPATH || !FTP_PORT) {
                reject("Missing options");
            }

            let opts = {
                host: FTP_HOST,
                user: FTP_USER,
                password: FTP_PASS,
                port: FTP_PORT,
                secure: false
            };
            let externalPath = FTP_EXTPATH;
            let localPath = path.join(FTP_LOCALPATH);

            const client = new ftp.Client();
            client.ftp.verbose = true;
            try {
                console.info("Connecting to FTP server...");
                await client.access(opts);
                client.on("close", () => {
                    console.info(`Disconnected from ${FTP_HOST}!`);
                })
            } catch (error) {
                reject(error);
                return;
            }

            console.info(`Connected to ${FTP_HOST}!`);
            console.info(`Getting (${files.length}) files from ${externalPath}`);
            console.info(`Saving files to ${localPath}`);



            toggleProgress();

            let dlFiles = [];

            for (let index = 0; index < files.length; index++) {
                const file = files[index];

                if (!dlFiles.includes(file)) {
                    try {
                        let externalPath = path.join(FTP_EXTPATH, file);
                        let localPath = path.join(FTP_LOCALPATH, file);
                        externalPath = externalPath.replace(/\\/g, "/");
                        // console.log(`${externalPath} => ${localPath}`);
                        await client.downloadTo(localPath, externalPath);
                        // update progress bar
    
                    } catch (error) {
                        console.warn(error);
                    }
    
                    dlFiles.push(file);
                } else {
                    console.info(`Skipping ${file}, already downloaded.`);
                }

                
                let progress = Math.round((index / files.length) * 100);
                updateProgress(progress, `Downloading ${file} (${index + 1}/${files.length})`);
                
            }

            console.info("Done downloading files");

            const buttons = document.querySelectorAll('button');
            buttons.forEach((button) => {
                button.removeAttribute("disabled");
            });
            
            client.close();
            resolve();


        });
    },
        removeAllFiles: async (files, options) => {
            return new Promise(async (resolve, reject) => {
                let {
                    FTP_HOST,
                    FTP_USER,
                    FTP_PASS,
                    FTP_SECURE,
                    FTP_LOCALPATH,
                    FTP_EXTPATH,
                    FTP_PORT,
                    FTP_VERBOSE
                } = options;

                // set verbose if undefined
                if (FTP_VERBOSE === undefined) {
                    FTP_VERBOSE = false;
                }

                // check all options are set
                if (!FTP_HOST || !FTP_USER || !FTP_PASS || !FTP_LOCALPATH || !FTP_EXTPATH || !FTP_PORT) {
                    reject("Missing options");
                }
                let opts = {
                    host: FTP_HOST,
                    user: FTP_USER,
                    password: FTP_PASS,
                    port: FTP_PORT,
                    secure: false
                };
                let externalPath = FTP_EXTPATH;
                let localPath = path.join(FTP_LOCALPATH);

                const client = new ftp.Client();
                client.ftp.verbose = true;
                try {
                    console.info("Connecting to FTP server...");
                    await client.access(opts);

                    client.on("close", () => {
                        console.info(`Disconnected from ${FTP_HOST}!`);
                    })
                } catch (error) {
                    reject(error);
                    return;
                }

                toggleProgress();

                let rmFiles = [];

                for (let index = 0; index < files.length; index++) {
                    const file = files[index];
                    if (!rmFiles.includes(file)) {

                        try {
                            let externalPath = path.join(FTP_EXTPATH, file);
                            externalPath = externalPath.replace(/\\/g, "/");
                            await client.remove(externalPath);
                            
                        } catch (error) {
                            console.warn(error);
                        }

                        rmFiles.push(file)
                    } else {
                        console.info(`Skipping ${file}, already removed.`);
                    }

                        
                    let progress = Math.round((index / files.length) * 100);
                    updateProgress(progress, `Removing ${file} (${index + 1}/${files.length})`);
                }

                console.info("Done removing files");

                const buttons = document.querySelectorAll('button');
                buttons.forEach((button) => {
                    button.removeAttribute("disabled");
                });
                
                client.close();
                resolve();

            });
        },
    get: (file, options) => {
        return new Promise((resolve, reject) => {
            let {
                FTP_HOST,
                FTP_USER,
                FTP_PASS,
                FTP_SECURE,
                FTP_LOCALPATH,
                FTP_EXTPATH,
                FTP_PORT,
                FTP_VERBOSE
            } = options;

            // set verbose if undefined
            if (FTP_VERBOSE === undefined) {
                FTP_VERBOSE = false;
            }

            // check all options are set
            if (!FTP_HOST || !FTP_USER || !FTP_PASS || !FTP_LOCALPATH || !FTP_EXTPATH || !FTP_PORT) {
                reject("Missing options");
            }
            let opts = {
                host: FTP_HOST,
                user: FTP_USER,
                password: FTP_PASS,
                port: FTP_PORT,
                secure: false
            };
            let externalPath = path.join(FTP_EXTPATH, file);
            let localPath = path.join(__dirname, FTP_LOCALPATH, file);

            console.log(localPath, externalPath);

            const client = new ftp.Client();
            client.ftp.verbose = true;
            console.log("Connecting to FTP server...");
            
            client.access(opts)
            .then(() => {
                // return client.list("/Saves/Multiplayer/");
                externalPath = externalPath.replace(/\\/g, "/");
                // externalPath = FTP_EXTPATH;
                // return client.list(externalPath);
                return client.downloadTo(localPath, externalPath);
            }).then(() => {
                client.close();
                resolve();
            }
            ).catch(err => {
                client.close();
                reject(err);
            });
        });
    },
    removeFile: (file, options) => {
        return new Promise((resolve, reject) => {
            let {
                FTP_HOST,
                FTP_USER,
                FTP_PASS,
                FTP_SECURE,
                FTP_LOCALPATH,
                FTP_EXTPATH,
                FTP_PORT,
                FTP_VERBOSE
            } = options;

            // set verbose if undefined
            if (FTP_VERBOSE === undefined) {
                FTP_VERBOSE = false;
            }

            // check all options are set
            if (!FTP_HOST || !FTP_USER || !FTP_PASS || !FTP_LOCALPATH || !FTP_EXTPATH || !FTP_PORT) {
                reject("Missing options");
            }
            let opts = {
                host: FTP_HOST,
                user: FTP_USER,
                password: FTP_PASS,
                port: FTP_PORT,
                secure: false
            };
            let externalPath = path.join(FTP_EXTPATH, file);
            let localPath = path.join(__dirname, FTP_LOCALPATH, file);

            // console.log(localPath, externalPath);

            const client = new ftp.Client();
            client.ftp.verbose = true;

            client.access(opts)
            .then(() => {
                // return client.list("/Saves/Multiplayer/");
                externalPath = externalPath.replace(/\\/g, "/");
                // externalPath = FTP_EXTPATH;
                // return client.list(externalPath);
                console.log("Removing file: " + externalPath);
                // return client.downloadTo(localPath, externalPath);
                return client.remove(externalPath);
            }).then(() => {
                client.close();
                resolve();
            }
            ).catch(err => {
                client.close();
                reject(err);
            });
        });
    },
});

window.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById("closeButton");
    const fitBtn = document.getElementById("fitScreenButton");
    const miniBtn = document.getElementById("minimizeButton");
    const title = document.getElementById("title");


    // Window controls

    closeBtn.onclick = () => ipcRenderer.send("close");
    fitBtn.onclick = () => ipcRenderer.send("max");
    miniBtn.onclick = () => ipcRenderer.send("min");
    // -------------------

});