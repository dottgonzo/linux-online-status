"use strict";
var os = require("os");
var child_process = require("child_process");
var Promise = require("bluebird");
var superagent = require("superagent");
var linux_audio_state_1 = require("linux-audio-state");
var lsusbdev_1 = require("lsusbdev");
var linux_video_state_1 = require("linux-video-state");
var linux_cpu_temp_1 = require("linux-cpu-temp");
var networkstatus_1 = require("networkstatus");
var debcheck_1 = require("debcheck");
var lsdisks = require("ls-disks");
var exec = child_process.exec;
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
        var object = {};
        object.updatedAt = new Date().getTime();
        object.audio = { inputs: [] };
        object.video = { inputs: [] };
        var callbacked = false;
        var timo = setTimeout(function () {
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
                var callbacked2_1 = false;
                var timo2_1 = setTimeout(function () {
                    if (!callbacked2_1) {
                        console.log("timeout bootTime read timeout");
                        reject("timeout");
                    }
                }, 10000);
                object.bootId = stdout.toString().replace("\n", "");
                exec("cat /proc/stat | grep btime | awk '{ print $2 }'", { timeout: 9000 }, function (error, stdout, stderr) {
                    if (error != null) {
                        callbacked2_1 = true;
                        clearTimeout(timo2_1);
                        reject(error);
                    }
                    else if (stderr && stderr != null) {
                        callbacked2_1 = true;
                        clearTimeout(timo2_1);
                        reject(stderr);
                    }
                    else {
                        callbacked2_1 = true;
                        clearTimeout(timo2_1);
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
                                debcheck_1.default('v4l-conf').then(function (a) {
                                    if (a) {
                                        debcheck_1.default('v4l-utils').then(function (a) {
                                            if (a) {
                                                linux_video_state_1.default().then(function (data) {
                                                    object.video.inputs = data;
                                                    linux_cpu_temp_1.default().then(function (a) {
                                                        object.cputemp = a;
                                                        if (object.network) {
                                                            getExternalIp().then(function (a) {
                                                                object.network.externalIp = a;
                                                                resolve(object);
                                                            }).catch(function () {
                                                                resolve(object);
                                                            });
                                                        }
                                                        else {
                                                            resolve(object);
                                                        }
                                                    }).catch(function (err) {
                                                        if (object.network) {
                                                            getExternalIp().then(function (a) {
                                                                object.network.externalIp = a;
                                                                resolve(object);
                                                            }).catch(function () {
                                                                resolve(object);
                                                            });
                                                        }
                                                        else {
                                                            resolve(object);
                                                        }
                                                    });
                                                }).catch(function (err) {
                                                    console.log(err);
                                                    linux_cpu_temp_1.default().then(function (a) {
                                                        object.cputemp = a;
                                                        if (object.network) {
                                                            getExternalIp().then(function (a) {
                                                                object.network.externalIp = a;
                                                                resolve(object);
                                                            }).catch(function () {
                                                                resolve(object);
                                                            });
                                                        }
                                                        else {
                                                            resolve(object);
                                                        }
                                                    }).catch(function (err) {
                                                        if (object.network) {
                                                            getExternalIp().then(function (a) {
                                                                object.network.externalIp = a;
                                                                resolve(object);
                                                            }).catch(function () {
                                                                resolve(object);
                                                            });
                                                        }
                                                        else {
                                                            resolve(object);
                                                        }
                                                    });
                                                });
                                            }
                                            else {
                                                debcheck_1.default('pulseaudio-utils').then(function (a) {
                                                    if (a) {
                                                        linux_audio_state_1.default().then(function (data) {
                                                            object.audio.inputs = data;
                                                            linux_cpu_temp_1.default().then(function (a) {
                                                                object.cputemp = a;
                                                                if (object.network) {
                                                                    getExternalIp().then(function (a) {
                                                                        object.network.externalIp = a;
                                                                        resolve(object);
                                                                    }).catch(function () {
                                                                        resolve(object);
                                                                    });
                                                                }
                                                                else {
                                                                    resolve(object);
                                                                }
                                                            }).catch(function (err) {
                                                                if (object.network) {
                                                                    getExternalIp().then(function (a) {
                                                                        object.network.externalIp = a;
                                                                        resolve(object);
                                                                    }).catch(function () {
                                                                        resolve(object);
                                                                    });
                                                                }
                                                                else {
                                                                    resolve(object);
                                                                }
                                                            });
                                                        }).catch(function (err) {
                                                            linux_cpu_temp_1.default().then(function (a) {
                                                                object.cputemp = a;
                                                                if (object.network) {
                                                                    getExternalIp().then(function (a) {
                                                                        object.network.externalIp = a;
                                                                        resolve(object);
                                                                    }).catch(function () {
                                                                        resolve(object);
                                                                    });
                                                                }
                                                                else {
                                                                    resolve(object);
                                                                }
                                                            }).catch(function (err) {
                                                                if (object.network) {
                                                                    getExternalIp().then(function (a) {
                                                                        object.network.externalIp = a;
                                                                        resolve(object);
                                                                    }).catch(function () {
                                                                        resolve(object);
                                                                    });
                                                                }
                                                                else {
                                                                    resolve(object);
                                                                }
                                                            });
                                                        });
                                                    }
                                                    else {
                                                        linux_cpu_temp_1.default().then(function (a) {
                                                            object.cputemp = a;
                                                            if (object.network) {
                                                                getExternalIp().then(function (a) {
                                                                    object.network.externalIp = a;
                                                                    resolve(object);
                                                                }).catch(function () {
                                                                    resolve(object);
                                                                });
                                                            }
                                                            else {
                                                                resolve(object);
                                                            }
                                                        }).catch(function (err) {
                                                            if (object.network) {
                                                                getExternalIp().then(function (a) {
                                                                    object.network.externalIp = a;
                                                                    resolve(object);
                                                                }).catch(function () {
                                                                    resolve(object);
                                                                });
                                                            }
                                                            else {
                                                                resolve(object);
                                                            }
                                                        });
                                                    }
                                                }).catch(function (err) {
                                                    linux_cpu_temp_1.default().then(function (a) {
                                                        object.cputemp = a;
                                                        if (object.network) {
                                                            getExternalIp().then(function (a) {
                                                                object.network.externalIp = a;
                                                                resolve(object);
                                                            }).catch(function () {
                                                                resolve(object);
                                                            });
                                                        }
                                                        else {
                                                            resolve(object);
                                                        }
                                                    }).catch(function (err) {
                                                        if (object.network) {
                                                            getExternalIp().then(function (a) {
                                                                object.network.externalIp = a;
                                                                resolve(object);
                                                            }).catch(function () {
                                                                resolve(object);
                                                            });
                                                        }
                                                        else {
                                                            resolve(object);
                                                        }
                                                    });
                                                });
                                            }
                                        }).catch(function (err) {
                                            debcheck_1.default('pulseaudio-utils').then(function (a) {
                                                if (a) {
                                                    linux_audio_state_1.default().then(function (data) {
                                                        object.audio.inputs = data;
                                                        linux_cpu_temp_1.default().then(function (a) {
                                                            object.cputemp = a;
                                                            if (object.network) {
                                                                getExternalIp().then(function (a) {
                                                                    object.network.externalIp = a;
                                                                    resolve(object);
                                                                }).catch(function () {
                                                                    resolve(object);
                                                                });
                                                            }
                                                            else {
                                                                resolve(object);
                                                            }
                                                        }).catch(function (err) {
                                                            if (object.network) {
                                                                getExternalIp().then(function (a) {
                                                                    object.network.externalIp = a;
                                                                    resolve(object);
                                                                }).catch(function () {
                                                                    resolve(object);
                                                                });
                                                            }
                                                            else {
                                                                resolve(object);
                                                            }
                                                        });
                                                    }).catch(function (err) {
                                                        linux_cpu_temp_1.default().then(function (a) {
                                                            object.cputemp = a;
                                                            if (object.network) {
                                                                getExternalIp().then(function (a) {
                                                                    object.network.externalIp = a;
                                                                    resolve(object);
                                                                }).catch(function () {
                                                                    resolve(object);
                                                                });
                                                            }
                                                            else {
                                                                resolve(object);
                                                            }
                                                        }).catch(function (err) {
                                                            if (object.network) {
                                                                getExternalIp().then(function (a) {
                                                                    object.network.externalIp = a;
                                                                    resolve(object);
                                                                }).catch(function () {
                                                                    resolve(object);
                                                                });
                                                            }
                                                            else {
                                                                resolve(object);
                                                            }
                                                        });
                                                    });
                                                }
                                                else {
                                                    linux_cpu_temp_1.default().then(function (a) {
                                                        object.cputemp = a;
                                                        if (object.network) {
                                                            getExternalIp().then(function (a) {
                                                                object.network.externalIp = a;
                                                                resolve(object);
                                                            }).catch(function () {
                                                                resolve(object);
                                                            });
                                                        }
                                                        else {
                                                            resolve(object);
                                                        }
                                                    }).catch(function (err) {
                                                        if (object.network) {
                                                            getExternalIp().then(function (a) {
                                                                object.network.externalIp = a;
                                                                resolve(object);
                                                            }).catch(function () {
                                                                resolve(object);
                                                            });
                                                        }
                                                        else {
                                                            resolve(object);
                                                        }
                                                    });
                                                }
                                            }).catch(function (err) {
                                                linux_cpu_temp_1.default().then(function (a) {
                                                    object.cputemp = a;
                                                    if (object.network) {
                                                        getExternalIp().then(function (a) {
                                                            object.network.externalIp = a;
                                                            resolve(object);
                                                        }).catch(function () {
                                                            resolve(object);
                                                        });
                                                    }
                                                    else {
                                                        resolve(object);
                                                    }
                                                }).catch(function (err) {
                                                    if (object.network) {
                                                        getExternalIp().then(function (a) {
                                                            object.network.externalIp = a;
                                                            resolve(object);
                                                        }).catch(function () {
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
                                    else {
                                        debcheck_1.default('pulseaudio-utils').then(function (a) {
                                            if (a) {
                                                linux_audio_state_1.default().then(function (data) {
                                                    object.audio.inputs = data;
                                                    linux_cpu_temp_1.default().then(function (a) {
                                                        object.cputemp = a;
                                                        if (object.network) {
                                                            getExternalIp().then(function (a) {
                                                                object.network.externalIp = a;
                                                                resolve(object);
                                                            }).catch(function () {
                                                                resolve(object);
                                                            });
                                                        }
                                                        else {
                                                            resolve(object);
                                                        }
                                                    }).catch(function (err) {
                                                        if (object.network) {
                                                            getExternalIp().then(function (a) {
                                                                object.network.externalIp = a;
                                                                resolve(object);
                                                            }).catch(function () {
                                                                resolve(object);
                                                            });
                                                        }
                                                        else {
                                                            resolve(object);
                                                        }
                                                    });
                                                }).catch(function (err) {
                                                    linux_cpu_temp_1.default().then(function (a) {
                                                        object.cputemp = a;
                                                        if (object.network) {
                                                            getExternalIp().then(function (a) {
                                                                object.network.externalIp = a;
                                                                resolve(object);
                                                            }).catch(function () {
                                                                resolve(object);
                                                            });
                                                        }
                                                        else {
                                                            resolve(object);
                                                        }
                                                    }).catch(function (err) {
                                                        if (object.network) {
                                                            getExternalIp().then(function (a) {
                                                                object.network.externalIp = a;
                                                                resolve(object);
                                                            }).catch(function () {
                                                                resolve(object);
                                                            });
                                                        }
                                                        else {
                                                            resolve(object);
                                                        }
                                                    });
                                                });
                                            }
                                            else {
                                                linux_cpu_temp_1.default().then(function (a) {
                                                    object.cputemp = a;
                                                    if (object.network) {
                                                        getExternalIp().then(function (a) {
                                                            object.network.externalIp = a;
                                                            resolve(object);
                                                        }).catch(function () {
                                                            resolve(object);
                                                        });
                                                    }
                                                    else {
                                                        resolve(object);
                                                    }
                                                }).catch(function (err) {
                                                    if (object.network) {
                                                        getExternalIp().then(function (a) {
                                                            object.network.externalIp = a;
                                                            resolve(object);
                                                        }).catch(function () {
                                                            resolve(object);
                                                        });
                                                    }
                                                    else {
                                                        resolve(object);
                                                    }
                                                });
                                            }
                                        }).catch(function (err) {
                                            linux_cpu_temp_1.default().then(function (a) {
                                                object.cputemp = a;
                                                if (object.network) {
                                                    getExternalIp().then(function (a) {
                                                        object.network.externalIp = a;
                                                        resolve(object);
                                                    }).catch(function () {
                                                        resolve(object);
                                                    });
                                                }
                                                else {
                                                    resolve(object);
                                                }
                                            }).catch(function (err) {
                                                if (object.network) {
                                                    getExternalIp().then(function (a) {
                                                        object.network.externalIp = a;
                                                        resolve(object);
                                                    }).catch(function () {
                                                        resolve(object);
                                                    });
                                                }
                                                else {
                                                    resolve(object);
                                                }
                                            });
                                        });
                                    }
                                }).catch(function (err) {
                                    debcheck_1.default('pulseaudio-utils').then(function (a) {
                                        if (a) {
                                            linux_audio_state_1.default().then(function (data) {
                                                object.audio.inputs = data;
                                                linux_cpu_temp_1.default().then(function (a) {
                                                    object.cputemp = a;
                                                    if (object.network) {
                                                        getExternalIp().then(function (a) {
                                                            object.network.externalIp = a;
                                                            resolve(object);
                                                        }).catch(function () {
                                                            resolve(object);
                                                        });
                                                    }
                                                    else {
                                                        resolve(object);
                                                    }
                                                }).catch(function (err) {
                                                    if (object.network) {
                                                        getExternalIp().then(function (a) {
                                                            object.network.externalIp = a;
                                                            resolve(object);
                                                        }).catch(function () {
                                                            resolve(object);
                                                        });
                                                    }
                                                    else {
                                                        resolve(object);
                                                    }
                                                });
                                            }).catch(function (err) {
                                                linux_cpu_temp_1.default().then(function (a) {
                                                    object.cputemp = a;
                                                    if (object.network) {
                                                        getExternalIp().then(function (a) {
                                                            object.network.externalIp = a;
                                                            resolve(object);
                                                        }).catch(function () {
                                                            resolve(object);
                                                        });
                                                    }
                                                    else {
                                                        resolve(object);
                                                    }
                                                }).catch(function (err) {
                                                    if (object.network) {
                                                        getExternalIp().then(function (a) {
                                                            object.network.externalIp = a;
                                                            resolve(object);
                                                        }).catch(function () {
                                                            resolve(object);
                                                        });
                                                    }
                                                    else {
                                                        resolve(object);
                                                    }
                                                });
                                            });
                                        }
                                        else {
                                            linux_cpu_temp_1.default().then(function (a) {
                                                object.cputemp = a;
                                                if (object.network) {
                                                    getExternalIp().then(function (a) {
                                                        object.network.externalIp = a;
                                                        resolve(object);
                                                    }).catch(function () {
                                                        resolve(object);
                                                    });
                                                }
                                                else {
                                                    resolve(object);
                                                }
                                            }).catch(function (err) {
                                                if (object.network) {
                                                    getExternalIp().then(function (a) {
                                                        object.network.externalIp = a;
                                                        resolve(object);
                                                    }).catch(function () {
                                                        resolve(object);
                                                    });
                                                }
                                                else {
                                                    resolve(object);
                                                }
                                            });
                                        }
                                    }).catch(function (err) {
                                        linux_cpu_temp_1.default().then(function (a) {
                                            object.cputemp = a;
                                            if (object.network) {
                                                getExternalIp().then(function (a) {
                                                    object.network.externalIp = a;
                                                    resolve(object);
                                                }).catch(function () {
                                                    resolve(object);
                                                });
                                            }
                                            else {
                                                resolve(object);
                                            }
                                        }).catch(function (err) {
                                            if (object.network) {
                                                getExternalIp().then(function (a) {
                                                    object.network.externalIp = a;
                                                    resolve(object);
                                                }).catch(function () {
                                                    resolve(object);
                                                });
                                            }
                                            else {
                                                resolve(object);
                                            }
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
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sysinfo;
;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QkM7QUFBQSxDQUFDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgb3MgZnJvbSBcIm9zXCI7XG5pbXBvcnQgKiBhcyBjaGlsZF9wcm9jZXNzIGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5cbmltcG9ydCAqIGFzIFByb21pc2UgZnJvbSBcImJsdWViaXJkXCI7XG5cbmltcG9ydCAqIGFzIHN1cGVyYWdlbnQgZnJvbSBcInN1cGVyYWdlbnRcIjtcblxuXG5pbXBvcnQgbGFzIGZyb20gXCJsaW51eC1hdWRpby1zdGF0ZVwiO1xuaW1wb3J0IGxzdXNiIGZyb20gXCJsc3VzYmRldlwiO1xuaW1wb3J0IGx2cyBmcm9tIFwibGludXgtdmlkZW8tc3RhdGVcIjtcblxuaW1wb3J0IHRlbXBjcHVzIGZyb20gXCJsaW51eC1jcHUtdGVtcFwiO1xuXG5cbmltcG9ydCBuZXR3b3Jrc3RhdHVzIGZyb20gXCJuZXR3b3Jrc3RhdHVzXCJcblxuaW1wb3J0IGRlYkNoZWNrIGZyb20gXCJkZWJjaGVja1wiXG5cbmltcG9ydCAqIGFzIGxzZGlza3MgZnJvbSBcImxzLWRpc2tzXCI7XG5cbmNvbnN0IGV4ZWMgPSBjaGlsZF9wcm9jZXNzLmV4ZWM7XG5cbmludGVyZmFjZSBJY29yZXMge1xuXG4gICAgdGVtcDogbnVtYmVyO1xuICAgIHVuaXQ6IHN0cmluZ1xuICAgIGNvcmVudW1iZXI6IG51bWJlcjtcbiAgICB2ZXJzaW9uOiBzdHJpbmc7XG59XG5cblxuaW50ZXJmYWNlIEl0ZW1wIHtcblxuICAgIHRlbXBlcmF0dXJlOiBudW1iZXI7XG4gICAgdW5pdDogc3RyaW5nO1xuICAgIG1heDogbnVtYmVyO1xuICAgIG1pbjogbnVtYmVyO1xuICAgIGNvcmVzOiBJY29yZXNbXTtcblxufVxuXG5pbnRlcmZhY2UgQXVkaW9DaGFubmVsQW5zd2VyIHtcbiAgICBkZXY6IHN0cmluZztcbiAgICBhY3RpdmU6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBBdWRpb0Fuc3dlciB7XG4gICAgbGFiZWw6IHN0cmluZztcbiAgICBkZXY6IHN0cmluZztcbiAgICBwdWxzZW5hbWU6IHN0cmluZztcbiAgICBhY3RpdmU6IGJvb2xlYW47XG4gICAgY2hhbm5lbHM6IEF1ZGlvQ2hhbm5lbEFuc3dlcltdO1xufVxuXG5pbnRlcmZhY2UgVmlkZW9DaGFubmVsQW5zd2VyIHtcbiAgICBkZXY6IHN0cmluZztcbiAgICBsYWJlbDogc3RyaW5nO1xuICAgIGFjdGl2ZTogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFZpZGVvQW5zd2VyIHtcbiAgICBkZXY6IHN0cmluZztcbiAgICBsYWJlbDogc3RyaW5nO1xuICAgIGFjdGl2ZTogYm9vbGVhbjtcbiAgICBjaGFubmVsczogVmlkZW9DaGFubmVsQW5zd2VyW107XG4gICAgbW9kZWxfaWQ6IHN0cmluZztcbiAgICB2ZW5kb3JfaWQ6IHN0cmluZztcbiAgICByZXNvbHV0aW9uOiBzdHJpbmc7XG4gICAgYnVzOiBzdHJpbmc7XG4gICAgc2VyaWFsOiBzdHJpbmc7XG59XG5cblxuaW50ZXJmYWNlIElTY2FuIHtcbiAgICBlc3NpZDogc3RyaW5nO1xuICAgIG1hYzogc3RyaW5nO1xuICAgIHNpZ25hbDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgSU5ldHdvcmsge1xuICAgIHR5cGU6IHN0cmluZztcbiAgICBtYWM6IHN0cmluZztcbiAgICBpbnRlcmZhY2U6IHN0cmluZztcbiAgICBlc3NpZD86IHN0cmluZztcbiAgICBzY2FuPzogSVNjYW5bXTtcbiAgICBpcD86IHN0cmluZztcbiAgICBnYXRld2F5Pzogc3RyaW5nO1xuICAgIGV4dGVybmFsSXA/OiBzdHJpbmc7XG59XG5cblxuaW50ZXJmYWNlIElOZXRTdGF0dXMge1xuXG4gICAgbmV0d29ya3M6IElOZXR3b3JrW107XG4gICAgbmV0d29yazogSU5ldHdvcms7XG59XG5cblxuXG5pbnRlcmZhY2UgTHN1c2JkZXZBbnN3ZXIge1xuICAgIGRldjogc3RyaW5nO1xuICAgIHR5cGU6IHN0cmluZztcbiAgICBodWI6IHN0cmluZztcbiAgICBwcm9kdWN0OiBzdHJpbmc7XG4gICAgaWQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIElQYXJ0aXRpb24ge1xuICAgIHBhcnRpdGlvbjogc3RyaW5nO1xuICAgIHNlY3RvcnM6IG51bWJlcjtcbiAgICBzZWN0b3JzX3N0YXJ0OiBudW1iZXI7XG4gICAgc2VjdG9yc19zdG9wOiBudW1iZXI7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIGJvb3Q6IGJvb2xlYW47XG4gICAgc2l6ZTogbnVtYmVyO1xuICAgIGxhYmVsPzogc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBodW1hbnNpemU6IHN0cmluZztcbiAgICB1c2VkOiBzdHJpbmc7XG4gICAgYXZhaWxhYmxlOiBzdHJpbmc7XG4gICAgcGVyY2VudHVzZWQ6IHN0cmluZztcbiAgICBtb3VudGVkOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBJRGlzayB7XG4gICAgZGlzazogc3RyaW5nO1xuICAgIHNlY3RvcnM6IG51bWJlcjtcbiAgICBzaXplOiBudW1iZXI7XG4gICAgcGFydGl0aW9uczogSVBhcnRpdGlvbltdO1xuICAgIGJsb2NrOiBudW1iZXI7XG4gICAgdXNlZF9ibG9ja3M6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIElDcHUge1xuICAgIG1vZGVsOiBzdHJpbmc7XG4gICAgc3BlZWQ6IG51bWJlcjtcbiAgICB0aW1lczoge1xuICAgICAgICB1c2VyOiBudW1iZXI7XG4gICAgICAgIG5pY2U6IG51bWJlcjtcbiAgICAgICAgc3lzOiBudW1iZXI7XG4gICAgICAgIGlkbGU6IG51bWJlcjtcbiAgICAgICAgaXJxOiBudW1iZXJcbiAgICB9XG59XG5pbnRlcmZhY2UgQW5zd2VyIHtcbiAgICBib290SWQ6IHN0cmluZztcbiAgICBib290VGltZTogbnVtYmVyO1xuICAgIHVwZGF0ZWRBdDogbnVtYmVyO1xuICAgIHVzYkRldmljZXM6IExzdXNiZGV2QW5zd2VyW107XG4gICAgZHJpdmVzOiBJRGlza1tdO1xuICAgIG5ldHdvcmtzOiBJTmV0d29ya1tdO1xuICAgIG5ldHdvcms6IElOZXR3b3JrO1xuICAgIHZpZGVvOiB7XG4gICAgICAgIGlucHV0czogVmlkZW9BbnN3ZXJbXTtcbiAgICB9O1xuICAgIGF1ZGlvOiB7XG4gICAgICAgIGlucHV0czogQXVkaW9BbnN3ZXJbXTtcbiAgICB9O1xuICAgIGNwdXRlbXA6IEl0ZW1wO1xuICAgIHN5c3RlbToge1xuICAgICAgICBsb2FkYXZnOiBudW1iZXJbXTtcbiAgICAgICAgZnJlZW1lbTogbnVtYmVyO1xuICAgICAgICB0b3RhbG1lbTogbnVtYmVyO1xuICAgICAgICByZWxlYXNlOiBzdHJpbmc7XG4gICAgICAgIGFyY2g6IHN0cmluZztcbiAgICAgICAgb3N0eXBlOiBzdHJpbmc7XG4gICAgICAgIHBsYXRmb3JtOiBzdHJpbmc7XG4gICAgICAgIGNvcmVzOiBJQ3B1W107XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRFeHRlcm5hbElwKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4oZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICAgIHN1cGVyYWdlbnQuZ2V0KCdodHRwczovL2FwaS5pcGlmeS5vcmc/Zm9ybWF0PWpzb24nKS5lbmQoZnVuY3Rpb24gKGVyciwgcmVzKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXMuYm9keS5pcClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzeXNpbmZvKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxBbnN3ZXI+KGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblxuXG4gICAgICAgIGxldCBvYmplY3QgPSA8QW5zd2VyPnt9O1xuICAgICAgICBvYmplY3QudXBkYXRlZEF0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIG9iamVjdC5hdWRpbyA9IDx7IGlucHV0czogQXVkaW9BbnN3ZXJbXSB9PnsgaW5wdXRzOiBbXSB9O1xuICAgICAgICBvYmplY3QudmlkZW8gPSA8eyBpbnB1dHM6IFZpZGVvQW5zd2VyW10gfT57IGlucHV0czogW10gfTtcbiAgICAgICAgbGV0IGNhbGxiYWNrZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IHRpbW8gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2tlZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGltZW91dCBib290SWQgcmVhZCB0aW1lb3V0XCIpO1xuICAgICAgICAgICAgICAgIHJlamVjdChcInRpbWVvdXRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMDAwKTtcbiAgICAgICAgb2JqZWN0LnN5c3RlbSA9IHtcbiAgICAgICAgICAgIGxvYWRhdmc6IG9zLmxvYWRhdmcoKSxcbiAgICAgICAgICAgIGZyZWVtZW06IG9zLmZyZWVtZW0oKSxcbiAgICAgICAgICAgIHRvdGFsbWVtOiBvcy50b3RhbG1lbSgpLFxuICAgICAgICAgICAgcmVsZWFzZTogb3MucmVsZWFzZSgpLFxuICAgICAgICAgICAgYXJjaDogb3MuYXJjaCgpLFxuICAgICAgICAgICAgb3N0eXBlOiBvcy50eXBlKCksXG4gICAgICAgICAgICBwbGF0Zm9ybTogb3MucGxhdGZvcm0oKSxcbiAgICAgICAgICAgIGNvcmVzOiBvcy5jcHVzKClcbiAgICAgICAgfTtcbiAgICAgICAgZXhlYyhcImNhdCAvcHJvYy9zeXMva2VybmVsL3JhbmRvbS9ib290X2lkXCIsIHsgdGltZW91dDogOTAwMCB9LCBmdW5jdGlvbiAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1vKTtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdGRlcnIgJiYgc3RkZXJyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltbyk7XG4gICAgICAgICAgICAgICAgcmVqZWN0KHN0ZGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1vKTtcblxuICAgICAgICAgICAgICAgIGxldCBjYWxsYmFja2VkMiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGxldCB0aW1vMiA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNhbGxiYWNrZWQyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInRpbWVvdXQgYm9vdFRpbWUgcmVhZCB0aW1lb3V0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KFwidGltZW91dFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIDEwMDAwKTtcblxuICAgICAgICAgICAgICAgIG9iamVjdC5ib290SWQgPSBzdGRvdXQudG9TdHJpbmcoKS5yZXBsYWNlKFwiXFxuXCIsIFwiXCIpO1xuXG4gICAgICAgICAgICAgICAgZXhlYyhcImNhdCAvcHJvYy9zdGF0IHwgZ3JlcCBidGltZSB8IGF3ayAneyBwcmludCAkMiB9J1wiLCB7IHRpbWVvdXQ6IDkwMDAgfSwgZnVuY3Rpb24gKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tlZDIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbW8yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RkZXJyICYmIHN0ZGVyciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja2VkMiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltbzIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHN0ZGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja2VkMiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltbzIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuYm9vdFRpbWUgPSBwYXJzZUludChzdGRvdXQudG9TdHJpbmcoKSkgKiAxMDAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsc3VzYigpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QudXNiRGV2aWNlcyA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmRyaXZlcyA9IGxzZGlza3MuYWxsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV0d29ya3N0YXR1cygpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IElOZXRTdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmtzID0gZGF0YS5uZXR3b3JrcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsgPSBkYXRhLm5ldHdvcms7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGViQ2hlY2soJ3Y0bC1jb25mJykudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJDaGVjaygndjRsLXV0aWxzJykudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbHZzKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC52aWRlby5pbnB1dHMgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGViQ2hlY2soJ3B1bHNlYXVkaW8tdXRpbHMnKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmF1ZGlvLmlucHV0cyA9IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYkNoZWNrKCdwdWxzZWF1ZGlvLXV0aWxzJykudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXMoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5hdWRpby5pbnB1dHMgPSBkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJDaGVjaygncHVsc2VhdWRpby11dGlscycpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhcygpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuYXVkaW8uaW5wdXRzID0gZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGViQ2hlY2soJ3B1bHNlYXVkaW8tdXRpbHMnKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmF1ZGlvLmlucHV0cyA9IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wY3B1cygpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuIl19
