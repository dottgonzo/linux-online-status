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
            cores: os.loadavg().length
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUE7NENBQ25CLENBQUM7d0NBQ0wsQ0FBQyxDQUFDLENBQUE7b0NBQ04sQ0FBQyxDQUFDLENBQUE7Z0NBQ04sQ0FBQyxDQUFDLENBQUE7NEJBQ04sQ0FBQyxDQUFDLENBQUM7d0JBQ1AsQ0FBQyxDQUFDLENBQUM7b0JBQ1AsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQTFqQkQ7eUJBMGpCQyxDQUFBO0FBQUEsQ0FBQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIG9zIGZyb20gXCJvc1wiO1xuaW1wb3J0ICogYXMgY2hpbGRfcHJvY2VzcyBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuXG5pbXBvcnQgKiBhcyBQcm9taXNlIGZyb20gXCJibHVlYmlyZFwiO1xuXG5pbXBvcnQgKiBhcyBzdXBlcmFnZW50IGZyb20gXCJzdXBlcmFnZW50XCI7XG5cblxuaW1wb3J0IGxhcyBmcm9tIFwibGludXgtYXVkaW8tc3RhdGVcIjtcbmltcG9ydCBsc3VzYiBmcm9tIFwibHN1c2JkZXZcIjtcbmltcG9ydCBsdnMgZnJvbSBcImxpbnV4LXZpZGVvLXN0YXRlXCI7XG5cbmltcG9ydCB0ZW1wY3B1cyBmcm9tIFwibGludXgtY3B1LXRlbXBcIjtcblxuXG5pbXBvcnQgbmV0d29ya3N0YXR1cyBmcm9tIFwibmV0d29ya3N0YXR1c1wiXG5cbmltcG9ydCBkZWJDaGVjayBmcm9tIFwiZGViY2hlY2tcIlxuXG5pbXBvcnQgKiBhcyBsc2Rpc2tzIGZyb20gXCJscy1kaXNrc1wiO1xuXG5jb25zdCBleGVjID0gY2hpbGRfcHJvY2Vzcy5leGVjO1xuXG5pbnRlcmZhY2UgSWNvcmVzIHtcblxuICAgIHRlbXA6IG51bWJlcjtcbiAgICB1bml0OiBzdHJpbmdcbiAgICBjb3JlbnVtYmVyOiBudW1iZXI7XG4gICAgdmVyc2lvbjogc3RyaW5nO1xufVxuXG5cbmludGVyZmFjZSBJdGVtcCB7XG5cbiAgICB0ZW1wZXJhdHVyZTogbnVtYmVyO1xuICAgIHVuaXQ6IHN0cmluZztcbiAgICBtYXg6IG51bWJlcjtcbiAgICBtaW46IG51bWJlcjtcbiAgICBjb3JlczogSWNvcmVzW107XG5cbn1cblxuaW50ZXJmYWNlIEF1ZGlvQ2hhbm5lbEFuc3dlciB7XG4gICAgZGV2OiBzdHJpbmc7XG4gICAgYWN0aXZlOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgQXVkaW9BbnN3ZXIge1xuICAgIGxhYmVsOiBzdHJpbmc7XG4gICAgZGV2OiBzdHJpbmc7XG4gICAgcHVsc2VuYW1lOiBzdHJpbmc7XG4gICAgYWN0aXZlOiBib29sZWFuO1xuICAgIGNoYW5uZWxzOiBBdWRpb0NoYW5uZWxBbnN3ZXJbXTtcbn1cblxuaW50ZXJmYWNlIFZpZGVvQ2hhbm5lbEFuc3dlciB7XG4gICAgZGV2OiBzdHJpbmc7XG4gICAgbGFiZWw6IHN0cmluZztcbiAgICBhY3RpdmU6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBWaWRlb0Fuc3dlciB7XG4gICAgZGV2OiBzdHJpbmc7XG4gICAgbGFiZWw6IHN0cmluZztcbiAgICBhY3RpdmU6IGJvb2xlYW47XG4gICAgY2hhbm5lbHM6IFZpZGVvQ2hhbm5lbEFuc3dlcltdO1xuICAgIG1vZGVsX2lkOiBzdHJpbmc7XG4gICAgdmVuZG9yX2lkOiBzdHJpbmc7XG4gICAgcmVzb2x1dGlvbjogc3RyaW5nO1xuICAgIGJ1czogc3RyaW5nO1xuICAgIHNlcmlhbDogc3RyaW5nO1xufVxuXG5cbmludGVyZmFjZSBJU2NhbiB7XG4gICAgZXNzaWQ6IHN0cmluZztcbiAgICBtYWM6IHN0cmluZztcbiAgICBzaWduYWw6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIElOZXR3b3JrIHtcbiAgICB0eXBlOiBzdHJpbmc7XG4gICAgbWFjOiBzdHJpbmc7XG4gICAgaW50ZXJmYWNlOiBzdHJpbmc7XG4gICAgZXNzaWQ/OiBzdHJpbmc7XG4gICAgc2Nhbj86IElTY2FuW107XG4gICAgaXA/OiBzdHJpbmc7XG4gICAgZ2F0ZXdheT86IHN0cmluZztcbiAgICBleHRlcm5hbElwPzogc3RyaW5nO1xufVxuXG5cbmludGVyZmFjZSBJTmV0U3RhdHVzIHtcblxuICAgIG5ldHdvcmtzOiBJTmV0d29ya1tdO1xuICAgIG5ldHdvcms6IElOZXR3b3JrO1xufVxuXG5cblxuaW50ZXJmYWNlIExzdXNiZGV2QW5zd2VyIHtcbiAgICBkZXY6IHN0cmluZztcbiAgICB0eXBlOiBzdHJpbmc7XG4gICAgaHViOiBzdHJpbmc7XG4gICAgcHJvZHVjdDogc3RyaW5nO1xuICAgIGlkOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBJUGFydGl0aW9uIHtcbiAgICBwYXJ0aXRpb246IHN0cmluZztcbiAgICBzZWN0b3JzOiBudW1iZXI7XG4gICAgc2VjdG9yc19zdGFydDogbnVtYmVyO1xuICAgIHNlY3RvcnNfc3RvcDogbnVtYmVyO1xuICAgIHR5cGU6IHN0cmluZztcbiAgICBib290OiBib29sZWFuO1xuICAgIHNpemU6IG51bWJlcjtcbiAgICBsYWJlbD86IHN0cmluZztcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgaHVtYW5zaXplOiBzdHJpbmc7XG4gICAgdXNlZDogc3RyaW5nO1xuICAgIGF2YWlsYWJsZTogc3RyaW5nO1xuICAgIHBlcmNlbnR1c2VkOiBzdHJpbmc7XG4gICAgbW91bnRlZDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgSURpc2sge1xuICAgIGRpc2s6IHN0cmluZztcbiAgICBzZWN0b3JzOiBudW1iZXI7XG4gICAgc2l6ZTogbnVtYmVyO1xuICAgIHBhcnRpdGlvbnM6IElQYXJ0aXRpb25bXTtcbiAgICBibG9jazogbnVtYmVyO1xuICAgIHVzZWRfYmxvY2tzOiBudW1iZXI7XG59XG5cblxuaW50ZXJmYWNlIEFuc3dlciB7XG4gICAgYm9vdElkOiBzdHJpbmc7XG4gICAgYm9vdFRpbWU6IG51bWJlcjtcbiAgICB1cGRhdGVkQXQ6IG51bWJlcjtcbiAgICB1c2JEZXZpY2VzOiBMc3VzYmRldkFuc3dlcltdO1xuICAgIGRyaXZlczogSURpc2tbXTtcbiAgICBuZXR3b3JrczogSU5ldHdvcmtbXTtcbiAgICBuZXR3b3JrOiBJTmV0d29yaztcbiAgICB2aWRlbzoge1xuICAgICAgICBpbnB1dHM6IFZpZGVvQW5zd2VyW107XG4gICAgfTtcbiAgICBhdWRpbzoge1xuICAgICAgICBpbnB1dHM6IEF1ZGlvQW5zd2VyW107XG4gICAgfTtcbiAgICBjcHV0ZW1wOiBJdGVtcDtcbiAgICBzeXN0ZW06IHtcbiAgICAgICAgbG9hZGF2ZzogbnVtYmVyW107XG4gICAgICAgIGZyZWVtZW06IG51bWJlcjtcbiAgICAgICAgdG90YWxtZW06IG51bWJlcjtcbiAgICAgICAgcmVsZWFzZTogc3RyaW5nO1xuICAgICAgICBhcmNoOiBzdHJpbmc7XG4gICAgICAgIG9zdHlwZTogc3RyaW5nO1xuICAgICAgICBwbGF0Zm9ybTogc3RyaW5nO1xuICAgICAgICBjb3JlczogbnVtYmVyO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0RXh0ZXJuYWxJcCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmc+KGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgICBzdXBlcmFnZW50LmdldCgnaHR0cHM6Ly9hcGkuaXBpZnkub3JnP2Zvcm1hdD1qc29uJykuZW5kKGZ1bmN0aW9uIChlcnIsIHJlcykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzLmJvZHkuaXApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3lzaW5mbygpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8QW5zd2VyPihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cblxuICAgICAgICBsZXQgb2JqZWN0ID0gPEFuc3dlcj57fTtcbiAgICAgICAgb2JqZWN0LnVwZGF0ZWRBdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBvYmplY3QuYXVkaW8gPSA8eyBpbnB1dHM6IEF1ZGlvQW5zd2VyW10gfT57IGlucHV0czogW10gfTtcbiAgICAgICAgb2JqZWN0LnZpZGVvID0gPHsgaW5wdXRzOiBWaWRlb0Fuc3dlcltdIH0+eyBpbnB1dHM6IFtdIH07XG4gICAgICAgIGxldCBjYWxsYmFja2VkID0gZmFsc2U7XG4gICAgICAgIGxldCB0aW1vID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInRpbWVvdXQgYm9vdElkIHJlYWQgdGltZW91dFwiKTtcbiAgICAgICAgICAgICAgICByZWplY3QoXCJ0aW1lb3V0XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxMDAwMCk7XG4gICAgICAgIG9iamVjdC5zeXN0ZW0gPSB7XG4gICAgICAgICAgICBsb2FkYXZnOiBvcy5sb2FkYXZnKCksXG4gICAgICAgICAgICBmcmVlbWVtOiBvcy5mcmVlbWVtKCksXG4gICAgICAgICAgICB0b3RhbG1lbTogb3MudG90YWxtZW0oKSxcbiAgICAgICAgICAgIHJlbGVhc2U6IG9zLnJlbGVhc2UoKSxcbiAgICAgICAgICAgIGFyY2g6IG9zLmFyY2goKSxcbiAgICAgICAgICAgIG9zdHlwZTogb3MudHlwZSgpLFxuICAgICAgICAgICAgcGxhdGZvcm06IG9zLnBsYXRmb3JtKCksXG4gICAgICAgICAgICBjb3Jlczogb3MubG9hZGF2ZygpLmxlbmd0aFxuICAgICAgICB9O1xuICAgICAgICBleGVjKFwiY2F0IC9wcm9jL3N5cy9rZXJuZWwvcmFuZG9tL2Jvb3RfaWRcIiwgeyB0aW1lb3V0OiA5MDAwIH0sIGZ1bmN0aW9uIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnJvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbW8pO1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0ZGVyciAmJiBzdGRlcnIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1vKTtcbiAgICAgICAgICAgICAgICByZWplY3Qoc3RkZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbW8pO1xuXG4gICAgICAgICAgICAgICAgbGV0IGNhbGxiYWNrZWQyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbGV0IHRpbW8yID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY2FsbGJhY2tlZDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGltZW91dCBib290VGltZSByZWFkIHRpbWVvdXRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoXCJ0aW1lb3V0XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgMTAwMDApO1xuXG4gICAgICAgICAgICAgICAgb2JqZWN0LmJvb3RJZCA9IHN0ZG91dC50b1N0cmluZygpLnJlcGxhY2UoXCJcXG5cIiwgXCJcIik7XG5cbiAgICAgICAgICAgICAgICBleGVjKFwiY2F0IC9wcm9jL3N0YXQgfCBncmVwIGJ0aW1lIHwgYXdrICd7IHByaW50ICQyIH0nXCIsIHsgdGltZW91dDogOTAwMCB9LCBmdW5jdGlvbiAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja2VkMiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltbzIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdGRlcnIgJiYgc3RkZXJyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrZWQyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1vMik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoc3RkZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrZWQyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1vMik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5ib290VGltZSA9IHBhcnNlSW50KHN0ZG91dC50b1N0cmluZygpKSAqIDEwMDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxzdXNiKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC51c2JEZXZpY2VzID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZHJpdmVzID0gbHNkaXNrcy5hbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXR3b3Jrc3RhdHVzKCkudGhlbihmdW5jdGlvbiAoZGF0YTogSU5ldFN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29ya3MgPSBkYXRhLm5ldHdvcmtzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yayA9IGRhdGEubmV0d29yaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gJydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJDaGVjaygndjRsLWNvbmYnKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYkNoZWNrKCd2NGwtdXRpbHMnKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsdnMoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnZpZGVvLmlucHV0cyA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJDaGVjaygncHVsc2VhdWRpby11dGlscycpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXMoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuYXVkaW8uaW5wdXRzID0gZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wY3B1cygpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wY3B1cygpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGViQ2hlY2soJ3B1bHNlYXVkaW8tdXRpbHMnKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhcygpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmF1ZGlvLmlucHV0cyA9IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wY3B1cygpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wY3B1cygpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYkNoZWNrKCdwdWxzZWF1ZGlvLXV0aWxzJykudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5hdWRpby5pbnB1dHMgPSBkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wY3B1cygpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wY3B1cygpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5ldHdvcmsuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJDaGVjaygncHVsc2VhdWRpby11dGlscycpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXMoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuYXVkaW8uaW5wdXRzID0gZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrLmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yay5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG4iXX0=
