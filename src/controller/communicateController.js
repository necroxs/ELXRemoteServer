const electron = require('electron');
const { ipcRenderer } = electron;
module.exports = class CommunicateController {

    constructor() {

    }
    updateSendMessageAction(action) {
        ipcRenderer.send("SendMessage", action.message);
        action.isDone = true;
        action.message = 'Send message successfully.'
        return action;
    }
}