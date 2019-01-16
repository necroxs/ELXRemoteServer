const ps = require('ps-node');
const exec = require('node-exec-promise').exec;


module.exports = class ProcessController {
    constructor() {

    }
    getProcesses() {
        return exec('tasklist');
    }
    async updateProcessAction(action) {
        var results = new Array();
        var task = await this.getProcesses();
        var lines = task.stdout.split('\n');
        lines.forEach(function (line) {
            if (line.indexOf('=====') >= 0) {
                var indexes = [], i;
                for (i = 0; i < line.length; i++)
                    if (line[i] === ' ')
                        indexes.push(i);
                lines.forEach(function (lx) {
                    let parts = [];
                    for (var i = 0; i < indexes.length; i++) {
                        if (i == 0) {
                            parts.push(lx.substring(0, indexes[i]).trim());
                        }
                        else if (i == indexes.length) {
                            parts.push(lx.substring(indexes[i]).trim());
                        }
                        else {
                            parts.push(lx.substring(indexes[i - 1], indexes[i]).trim());
                        }
                    }
                    results.push({
                        name: parts[0],
                        id: parts[1],
                        type: parts[2],
                        used: parts[3]
                    });
                });

            }
        });
        var list = results;
        action.payload = JSON.stringify(list);
        action.isDone = true;
        return action;

    }
    async updateKillProcessAction(action) {
        ps.kill(action.message);
        action.message = 'Process with pid ['+action.message +'] has been killed!';
        action.isDone = true;
        return action;

    }
    killProcess(action){
      
          
    }
 

    async updateRunProcessAction(action) {
        exec(action.message);
        action.message = 'Try to run ['+action.message +'] successfully.';
        action.isDone = true;
        return action;
    }


}