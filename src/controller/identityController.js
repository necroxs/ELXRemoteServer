const os = require('os');
const rp = require("request-promise");
const mac = require('getmac');
module.exports = class IdentityController {

    constructor() {

    }
    async getIdentity() {
        return {
            time: Date.now(),
            hostname: os.hostname(),
            type: os.type(),
            platform: os.platform(),
            arch: os.arch(),
            release: os.release(),
            uptime: os.uptime(),
            loadavg: os.loadavg(),
            totalmem: os.totalmem(),
            freemem: os.freemem(),
            cpus: os.cpus(),
            networkInterfaces: os.networkInterfaces(),
            ip: await this.getpublicIP(),
            macaddress:await this.getMacAddress()

        }

    }
    async getpublicIP() {
        let ipText = await rp('https://api.ipify.org/?format=json');
        let ipObj = JSON.parse(ipText);
        return ipObj.ip;
    }
    async getActionPayload() {
        return {
            tag: 'identity-information',
            payload: await getIdentity()

        }
    }
    async getMacAddress() {
        return new Promise((resolve) => {
            mac.getMac((err, out) => {
                resolve(out);
            });
           
          });
    }
}



