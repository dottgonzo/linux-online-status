"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const child_process = require("child_process");
const Promise = require("bluebird");
const superagent = require("superagent");
const lsusbdev_1 = require("lsusbdev");
const linux_cpu_temp_1 = require("linux-cpu-temp");
const networkstatus_1 = require("networkstatus");
const lsdisks = require("ls-disks");
const exec = child_process.exec;
function getExternalIp() {
    return new Promise(function (resolve, reject) {
        superagent.get('https://api.ipify.org?format=json').end(function (err, res) {
            if (err) {
                reject(err);
            }
            else {
                resolve(res.body.ip);
            }
        });
    });
}
function sysinfo() {
    return new Promise(function (resolve, reject) {
        let object = {};
        object.updatedAt = new Date().getTime();
        let callbacked = false;
        let timo = setTimeout(function () {
            if (!callbacked) {
                console.log("timeout bootId read timeout");
                reject("timeout");
            }
        }, 10000);
        object.system = {
            loadavg: os.loadavg(),
            freemem: os.freemem(),
            totalmem: os.totalmem(),
            release: os.release(),
            arch: os.arch(),
            ostype: os.type(),
            platform: os.platform(),
            cores: os.cpus()
        };
        exec("cat /proc/sys/kernel/random/boot_id", { timeout: 9000 }, function (error, stdout, stderr) {
            if (error != null) {
                callbacked = true;
                clearTimeout(timo);
                reject(error);
            }
            else if (stderr && stderr != null) {
                callbacked = true;
                clearTimeout(timo);
                reject(stderr);
            }
            else {
                callbacked = true;
                clearTimeout(timo);
                let callbacked2 = false;
                let timo2 = setTimeout(function () {
                    if (!callbacked2) {
                        console.log("timeout bootTime read timeout");
                        reject("timeout");
                    }
                }, 10000);
                object.bootId = stdout.toString().replace("\n", "");
                exec("cat /proc/stat | grep btime | awk '{ print $2 }'", { timeout: 9000 }, function (error, stdout, stderr) {
                    if (error != null) {
                        callbacked2 = true;
                        clearTimeout(timo2);
                        reject(error);
                    }
                    else if (stderr && stderr != null) {
                        callbacked2 = true;
                        clearTimeout(timo2);
                        reject(stderr);
                    }
                    else {
                        callbacked2 = true;
                        clearTimeout(timo2);
                        object.bootTime = parseInt(stdout.toString()) * 1000;
                        lsusbdev_1.default().then(function (data) {
                            object.usbDevices = data;
                            object.drives = lsdisks.all();
                            networkstatus_1.default().then(function (data) {
                                object.networks = data.networks;
                                object.network = data.network;
                                if (object.network) {
                                    object.network.externalIp = '';
                                }
                                linux_cpu_temp_1.default().then((a) => {
                                    object.cputemp = a;
                                    if (object.network) {
                                        getExternalIp().then((a) => {
                                            object.network.externalIp = a;
                                            resolve(object);
                                        }).catch(() => {
                                            resolve(object);
                                        });
                                    }
                                    else {
                                        resolve(object);
                                    }
                                }).catch((err) => {
                                    if (object.network) {
                                        getExternalIp().then((a) => {
                                            object.network.externalIp = a;
                                            resolve(object);
                                        }).catch(() => {
                                            resolve(object);
                                        });
                                    }
                                    else {
                                        resolve(object);
                                    }
                                });
                            });
                        });
                    }
                });
            }
        });
    });
}
exports.sysinfo = sysinfo;
;
