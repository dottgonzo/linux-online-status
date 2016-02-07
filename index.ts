
import * as child_process from "child_process";
import * as Promise from "bluebird";

import las = require("linux-audio-state");
import lsusb = require("lsusbdev");
import lvs = require("linux-video-state");

let netw = require("netw");

let diskinfo = require("diskinfo");



let exec = child_process.exec;


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


interface ScanAnswer {
    essid: string;
    mac: string;
    signal: string;
}

interface NetworkAnswer {
    type: string;
    mac: string;
    interface: string;
    essid?: string;
    scan?: ScanAnswer[];
    ip?: string;
    gateway?: string;
}



interface LsusbdevAnswer {
    dev: string;
    type: string;
    hub: string;
    product: string;
    id: string;
}

interface GetDrivesAnswer {
    filesystem: string;
    blocks: string;
    used: string;
    available: string;
    capacity: string;
    mounted: string;
}

interface Answer {
    bootId: string;
    bootTime: number;
    updatedAt: number;
    usbDevices: LsusbdevAnswer[];
    drives: GetDrivesAnswer[];
    networks: NetworkAnswer[];
    video: {
        inputs: VideoAnswer[];
    };
    audio: {
        inputs: AudioAnswer[];
    };
}

export = function() {
    return new Promise<Answer>(function(resolve, reject) {


        let object = <Answer>{};
        object.updatedAt = new Date().getTime();
        object.audio = <{ inputs: AudioAnswer[] }>{};
        object.video = <{ inputs: VideoAnswer[] }>{};
        let callbacked = false;
        let timo = setTimeout(function() {
            if (!callbacked) {
                console.log("timeout bootId read timeout");
                reject("timeout");
            }
        }, 10000);


        exec("cat /proc/sys/kernel/random/boot_id", { timeout: 9000 }, function(error, stdout, stderr) {
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
        let timo2 = setTimeout(function() {
            if (!callbacked2) {
                console.log("timeout bootTime read timeout");
                reject("timeout");
            }
        }, 10000);


                object.bootId = stdout.toString("utf-8");

                exec("cat /proc/stat | grep btime | awk '{ print $2 }'", { timeout: 9000 }, function(error, stdout, stderr) {
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


                        lsusb().then(function(data) {
                            object.usbDevices = data;

                            diskinfo.getDrives(function(err, aDrives: GetDrivesAnswer[]) {
                                object.drives = aDrives;

                                netw().then(function(data: NetworkAnswer[]) {
                                    object.networks = data;

                                    las().then(function(data) {
                                        object.audio.inputs = data;
                                        lvs().then(function(data) {
                                            object.video.inputs = data;
                                            resolve(object);
                                        }).catch(function(err) {
                                            console.log(err);
                                            resolve(object);
                                        });
                                    }).catch(function(err) {
                                        lvs().then(function(data) {
                                            object.video.inputs = data;
                                            resolve(object);
                                        }).catch(function(err) {
                                            console.log(err);
                                            resolve(object);
                                        });
                                    });


                                });

                            });

                        });

                    }
                });
            }

        });


    });

};
