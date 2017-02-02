import * as os from "os";
import * as child_process from "child_process";

import * as Promise from "bluebird";

import * as superagent from "superagent";


import lsusb from "lsusbdev";

import tempcpus from "linux-cpu-temp";


import networkstatus from "networkstatus"


import * as lsdisks from "ls-disks";

const exec = child_process.exec;

interface Icores {

    temp: number;
    unit: string
    corenumber: number;
    version: string;
}


interface Itemp {

    temperature: number;
    unit: string;
    max: number;
    min: number;
    cores: Icores[];

}




interface IScan {
    essid: string;
    mac: string;
    signal: string;
}

interface INetwork {
    type: string;
    mac: string;
    interface: string;
    essid?: string;
    scan?: IScan[];
    ip?: string;
    gateway?: string;
    externalIp?: string;
}


interface INetStatus {

    networks: INetwork[];
    network: INetwork;
}



interface LsusbdevAnswer {
    dev: string;
    type: string;
    hub: string;
    product: string;
    id: string;
}

interface IPartition {
    partition: string;
    sectors: number;
    sectors_start: number;
    sectors_stop: number;
    type: string;
    boot: boolean;
    size: number;
    label?: string;
    name: string;
    humansize: string;
    used: string;
    available: string;
    percentused: string;
    mounted: string;
}

interface IDisk {
    disk: string;
    sectors: number;
    size: number;
    partitions: IPartition[];
    block: number;
    used_blocks: number;
}


interface Answer {
    bootId: string;
    bootTime: number;
    updatedAt: number;
    usbDevices: LsusbdevAnswer[];
    drives: IDisk[];
    networks: INetwork[];
    network: INetwork;
    cputemp: Itemp;
    system: {
        loadavg: number[];
        freemem: number;
        totalmem: number;
        release: string;
        arch: string;
        ostype: string;
        platform: string;
        cores: number;
    }
}

function getExternalIp(): Promise<string> {
    return new Promise<string>(function (resolve, reject) {

        superagent.get('https://api.ipify.org?format=json').end(function (err, res) {
            if (err) {
                reject(err)
            } else {
                resolve(res.body.ip)
            }
        })
    })
}

export function sysinfo() {
    return new Promise<Answer>(function (resolve, reject) {


        let object = <Answer>{};
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
            cores: os.loadavg().length
        };
        exec("cat /proc/sys/kernel/random/boot_id", { timeout: 9000 }, function (error, stdout, stderr) {
            if (error != null) {
                callbacked = true;
                clearTimeout(timo);
                reject(error);
            } else if (stderr && stderr != null) {
                callbacked = true;
                clearTimeout(timo);
                reject(stderr);
            } else {
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
                    } else if (stderr && stderr != null) {
                        callbacked2 = true;
                        clearTimeout(timo2);
                        reject(stderr);
                    } else {
                        callbacked2 = true;
                        clearTimeout(timo2);

                        object.bootTime = parseInt(stdout.toString()) * 1000;

                        lsusb().then(function (data) {
                            object.usbDevices = data;
                            object.drives = lsdisks.all();
                            networkstatus().then(function (data: INetStatus) {
                                object.networks = data.networks;
                                object.network = data.network;
                                if (object.network) {
                                    object.network.externalIp = ''
                                }

                                tempcpus().then((a) => {
                                    object.cputemp = a
                                    if (object.network) {
                                        getExternalIp().then((a) => {
                                            object.network.externalIp = a
                                            resolve(object)
                                        }).catch(() => {
                                            resolve(object)
                                        })
                                    } else {
                                        resolve(object)
                                    }
                                }).catch((err) => {
                                    if (object.network) {
                                        getExternalIp().then((a) => {
                                            object.network.externalIp = a
                                            resolve(object)
                                        }).catch(() => {
                                            resolve(object)
                                        })
                                    } else {
                                        resolve(object)
                                    }
                                })

                            });
                        });
                    }
                });
            }
        });
    });
};
