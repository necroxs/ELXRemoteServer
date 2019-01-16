const electron = require('electron');
const _ = require('lodash');
const FireBaseService = require('./src/services/firebaseService.js');
const IdentityController = require('./src/controller/identityController.js');
const DirectoryController = require('./src/controller/directoryController.js');
const ProcessController = require('./src/controller/processController.js');
const CommunicateController = require('./src/controller/communicateController.js');
const { ipcRenderer } = electron;
var connectionID = null;
var clientData = null;
var Listener = null;
var idn = new IdentityController();
var fs = new FireBaseService();
var dir = new DirectoryController();
var proc = new ProcessController();
var com = new CommunicateController();
init();
//================================ Listener ===============================================

//================================ Listener ===============================================
async function init() {

    await fs.connect();
    //===========================Init Data ==============================
    var idnInformation = await idn.getIdentity();
    var idnRegis = {
        ip: idnInformation.ip,
        name: idnInformation.hostname,
        status: 'online',
        actionResult: []
    }
    idnRegis.actionResult.push({ tag: 'indentity-information', isDone: true, payload: idnInformation, message: null });
    console.log(idnRegis);
    //===========================Init Data ==============================
    fs.add(idnRegis).then((val) => {
        connectionID = val.id;
        console.log('connect success id : ' + val.id);
        var ipText = document.getElementById('connectionIP');
        ipText.innerHTML = 'Connection ID : ' + connectionID;
        listenning(connectionID);
    });
}

async function listenning(connectionID) {
    Listener = setInterval(() => {
        fs.get(connectionID).then((data) => {
            clientData = data.data();
            clientData.actionResult.forEach(action => {
                if (!action.isDone) {
                    var resultAction = RunCommand(action);
                    console.log('Done execute : ' + action.tag);
                    if (resultAction != null) {
                        resultAction.then((out) => {
                            action = out;
                            if (action != null) {
                                fs.update(connectionID, clientData);

                            }

                        });
                        1
                    }
                }
            });


        });

    }, 1000);
}

async function RunCommand(action) {
    let resultAction = null;
    switch (action.tag) {
        case 'getdir':
            resultAction = dir.updateDirectoryAction(action);
            break;
        case 'getdrives':
            resultAction = dir.updateDrivesAction(action);
            break;
        case 'getfile':
            resultAction = dir.updateFileAction(action);
            break;
        case 'getprocesses':
            resultAction = proc.updateProcessAction(action);
            break;
        case 'killprocess':
            resultAction = proc.updateKillProcessAction(action);
            break;
        case 'runprocess':
            resultAction = proc.updateRunProcessAction(action);
            break;
        case 'sendrunprocess':
            resultAction = dir.updateSendExecuteAction(action);
            break;
        case 'sendmessage':
            resultAction = com.updateSendMessageAction(action);
            break;
        default:

    }
    return resultAction;
}

async function putfake() {
    //var tmpAction = "";
    //clientData.actionResult.forEach(action => {
    //   if(action)
    //});
    clientData.actionResult.push({ tag: 'getprocesses', isDone: false, payload: null, message: 'D:\\Untitled.png' });
    clientData.actionResult.push({ tag: 'getdrives', isDone: false, payload: null, message: 'D:\\Untitled.png' });
    //clientData.actionResult.push({ tag: 'getfile', isDone: false, payload: null, message: 'D:\\Untitled.png' });
    //clientData.actionResult.push({ tag: 'killprocess', isDone: false, payload: null, message: '17636' });
    //clientData.actionResult.push({ tag: 'runprocess', isDone: false, payload: null, message: 'D:\\sss.txt' });
    //var testfile = { tag: 'sendrunprocess', isDone: false, payload: null, message: 'test.txt' };
    //testfile.payload = dir.base64_encode('D:\\sss.txt');
    //clientData.actionResult.push(testfile);
    clientData.actionResult.push({ tag: 'sendmessage', isDone: false, payload: null, message: 'Hi this is test' });
    await fs.update(connectionID, clientData);
}

ipcRenderer.on("Exit", async function () {
    try {
        await fs.delete(connectionID);
        ipcRenderer.send("Ready:Close");
    }
    catch (ex) {
        ipcRenderer.send("Ready:Close");
    }
});