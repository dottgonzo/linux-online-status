
import * as child_process from "child_process";
import * as Promise from "bluebird";

import las from "linux-audio-state";
import lsusb from "lsusbdev";
import lvs from "linux-video-state";

import networkstatus from "networkstatus"

import debCheck from "debcheck"

import * as lsdisks from "ls-disks";

const exec = child_process.exec;


interface AudioChannelAnswer {
    dev: string;
    active: boolean;
}

interface AudioAnswer {
    label: string;
    dev: string;
    pulsename: string;
    active: boolean;
    channels: AudioChannelAnswer[];
}

interface VideoChannelAnswer {
    dev: string;
    label: string;
    active: boolean;
}

interface VideoAnswer {
    dev: string;
    label: string;
    active: boolean;
    channels: VideoChannelAnswer[];
    model_id: string;
    vendor_id: string;
    resolution: string;
    bus: string;
    serial: string;
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
    video: {
        inputs: VideoAnswer[];
    };
    audio: {
        inputs: AudioAnswer[];
    };
}

export default function sysinfo() {
    return new Promise<Answer>(function (resolve, reject) {


        let object = <Answer>{};
        object.updatedAt = new Date().getTime();
        object.audio = <{ inputs: AudioAnswer[] }>{ inputs: [] };
        object.video = <{ inputs: VideoAnswer[] }>{ inputs: [] };
        let callbacked = false;
        let timo = setTimeout(function () {
            if (!callbacked) {
                console.log("timeout bootId read timeout");
                reject("timeout");
            }
        }, 10000);


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


                object.bootId = stdout.toString("utf-8").replace("\n", "");

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

                        object.bootTime = parseInt(stdout.toString("utf-8")) * 1000;


                        lsusb().then(function (data) {
                            object.usbDevices = data;
                            object.drives = lsdisks.all();
                            networkstatus().then(function (data: INetStatus) {
                                object.networks = data.networks;
                                object.network = data.network;
                                debCheck('v4l-conf').then((a) => {
                                    if (a) {
                                        debCheck('v4l-utils').then((a) => {
                                            if (a) {
                                                lvs().then(function (data) {
                                                    object.video.inputs = data;
                                                    resolve(object);
                                                }).catch(function (err) {
                                                    console.log(err);
                                                    resolve(object);
                                                });
                                            } else {
                                                debCheck('pulseaudio-utils').then((a) => {
                                                    if (a) {
                                                        las().then(function (data) {
                                                            object.audio.inputs = data
                                                            resolve(object)
                                                        }).catch(function (err) {
                                                            resolve(object)
                                                        });
                                                    } else {
                                                        resolve(object)
                                                    }
                                                }).catch((err) => {
                                                    resolve(object)
                                                })
                                            }
                                        }).catch((err) => {
                                            debCheck('pulseaudio-utils').then((a) => {
                                                if (a) {
                                                    las().then(function (data) {
                                                        object.audio.inputs = data
                                                        resolve(object)
                                                    }).catch(function (err) {
                                                        resolve(object)
                                                    });
                                                } else {
                                                    resolve(object)
                                                }
                                            }).catch((err) => {
                                                resolve(object)
                                            })
                                        })
                                    } else {
                                        debCheck('pulseaudio-utils').then((a) => {
                                            if (a) {
                                                las().then(function (data) {
                                                    object.audio.inputs = data
                                                    resolve(object)
                                                }).catch(function (err) {
                                                    resolve(object)
                                                });
                                            } else {
                                                resolve(object)
                                            }
                                        }).catch((err) => {
                                            resolve(object)
                                        })
                                    }
                                }).catch((err) => {
                                    debCheck('pulseaudio-utils').then((a) => {
                                        if (a) {
                                            las().then(function (data) {
                                                object.audio.inputs = data
                                                resolve(object)
                                            }).catch(function (err) {
                                                resolve(object)
                                            });
                                        } else {
                                            resolve(object)
                                        }
                                    }).catch((err) => {
                                        resolve(object)
                                    })
                                })
                            });
                        });
                    }
                });
            }
        });
    });
};
