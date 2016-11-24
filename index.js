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
        object.externalIp = '';
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
                                                                object.externalIp = a;
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
                                                                object.externalIp = a;
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
                                                                object.externalIp = a;
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
                                                                object.externalIp = a;
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
                                                                        object.externalIp = a;
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
                                                                        object.externalIp = a;
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
                                                                        object.externalIp = a;
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
                                                                        object.externalIp = a;
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
                                                                    object.externalIp = a;
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
                                                                    object.externalIp = a;
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
                                                                object.externalIp = a;
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
                                                                object.externalIp = a;
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
                                                                    object.externalIp = a;
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
                                                                    object.externalIp = a;
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
                                                                    object.externalIp = a;
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
                                                                    object.externalIp = a;
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
                                                                object.externalIp = a;
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
                                                                object.externalIp = a;
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
                                                            object.externalIp = a;
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
                                                            object.externalIp = a;
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
                                                                object.externalIp = a;
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
                                                                object.externalIp = a;
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
                                                                object.externalIp = a;
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
                                                                object.externalIp = a;
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
                                                            object.externalIp = a;
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
                                                            object.externalIp = a;
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
                                                        object.externalIp = a;
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
                                                        object.externalIp = a;
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
                                                            object.externalIp = a;
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
                                                            object.externalIp = a;
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
                                                            object.externalIp = a;
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
                                                            object.externalIp = a;
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
                                                        object.externalIp = a;
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
                                                        object.externalIp = a;
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
                                                    object.externalIp = a;
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
                                                    object.externalIp = a;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFZLEVBQUUsV0FBTSxJQUFJLENBQUMsQ0FBQTtBQUN6QixJQUFZLGFBQWEsV0FBTSxlQUFlLENBQUMsQ0FBQTtBQUUvQyxJQUFZLE9BQU8sV0FBTSxVQUFVLENBQUMsQ0FBQTtBQUVwQyxJQUFZLFVBQVUsV0FBTSxZQUFZLENBQUMsQ0FBQTtBQUd6QyxrQ0FBZ0IsbUJBQW1CLENBQUMsQ0FBQTtBQUNwQyx5QkFBa0IsVUFBVSxDQUFDLENBQUE7QUFDN0Isa0NBQWdCLG1CQUFtQixDQUFDLENBQUE7QUFFcEMsK0JBQXFCLGdCQUFnQixDQUFDLENBQUE7QUFHdEMsOEJBQTBCLGVBRTFCLENBQUMsQ0FGd0M7QUFFekMseUJBQXFCLFVBRXJCLENBQUMsQ0FGOEI7QUFFL0IsSUFBWSxPQUFPLFdBQU0sVUFBVSxDQUFDLENBQUE7QUFFcEMsSUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztBQTZJaEM7SUFDSSxNQUFNLENBQUMsSUFBSSxPQUFPLENBQVMsVUFBUyxPQUFPLEVBQUUsTUFBTTtRQUUvQyxVQUFVLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVMsR0FBRyxFQUFFLEdBQUc7WUFDckUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDTixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDZixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDeEIsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDO0FBRUQ7SUFDSSxNQUFNLENBQUMsSUFBSSxPQUFPLENBQVMsVUFBUyxPQUFPLEVBQUUsTUFBTTtRQUcvQyxJQUFJLE1BQU0sR0FBVyxFQUFFLENBQUM7UUFDeEIsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxLQUFLLEdBQThCLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxLQUFLLEdBQThCLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQ3pELElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN2QixJQUFJLElBQUksR0FBRyxVQUFVLENBQUM7WUFDbEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3RCLENBQUM7UUFDTCxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDVixNQUFNLENBQUMsTUFBTSxHQUFHO1lBQ1osT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLEVBQUU7WUFDckIsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLEVBQUU7WUFDckIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRLEVBQUU7WUFDdkIsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLEVBQUU7WUFDckIsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUU7WUFDZixNQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRTtZQUNqQixRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRTtZQUN2QixLQUFLLEVBQUUsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU07U0FDN0IsQ0FBQztRQUNGLE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFBO1FBQ3RCLElBQUksQ0FBQyxxQ0FBcUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxVQUFTLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTTtZQUN6RixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDbEIsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEIsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQ2xCLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25CLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixVQUFVLEdBQUcsSUFBSSxDQUFDO2dCQUNsQixZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRW5CLElBQUksYUFBVyxHQUFHLEtBQUssQ0FBQztnQkFDeEIsSUFBSSxPQUFLLEdBQUcsVUFBVSxDQUFDO29CQUNuQixFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQVcsQ0FBQyxDQUFDLENBQUM7d0JBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO3dCQUM3QyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3RCLENBQUM7Z0JBQ0wsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUVWLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBRXBELElBQUksQ0FBQyxrREFBa0QsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxVQUFTLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTTtvQkFDdEcsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ2hCLGFBQVcsR0FBRyxJQUFJLENBQUM7d0JBQ25CLFlBQVksQ0FBQyxPQUFLLENBQUMsQ0FBQzt3QkFDcEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNsQixDQUFDO29CQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ2xDLGFBQVcsR0FBRyxJQUFJLENBQUM7d0JBQ25CLFlBQVksQ0FBQyxPQUFLLENBQUMsQ0FBQzt3QkFDcEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNuQixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLGFBQVcsR0FBRyxJQUFJLENBQUM7d0JBQ25CLFlBQVksQ0FBQyxPQUFLLENBQUMsQ0FBQzt3QkFFcEIsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO3dCQUVyRCxrQkFBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBSTs0QkFDdEIsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7NEJBQ3pCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDOzRCQUM5Qix1QkFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBZ0I7Z0NBQzFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQ0FDaEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2dDQUM5QixrQkFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7b0NBQ3hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0NBQ0osa0JBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDOzRDQUN6QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dEQUNKLDJCQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFJO29EQUNwQixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7b0RBQzNCLHdCQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO3dEQUNkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFBO3dEQUNsQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs0REFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztnRUFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7Z0VBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dFQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQyxDQUFDLENBQUE7d0RBQ04sQ0FBQzt3REFBQyxJQUFJLENBQUMsQ0FBQzs0REFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7d0RBQ25CLENBQUM7b0RBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRzt3REFDVCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs0REFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztnRUFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7Z0VBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dFQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQyxDQUFDLENBQUE7d0RBQ04sQ0FBQzt3REFBQyxJQUFJLENBQUMsQ0FBQzs0REFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7d0RBQ25CLENBQUM7b0RBQ0wsQ0FBQyxDQUFDLENBQUE7Z0RBQ04sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVMsR0FBRztvREFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztvREFDakIsd0JBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7d0RBQ2QsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUE7d0RBQ2xCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOzREQUNqQixhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO2dFQUNuQixNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQTtnRUFDckIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBOzREQUNuQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0VBQ0wsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBOzREQUNuQixDQUFDLENBQUMsQ0FBQTt3REFDTixDQUFDO3dEQUFDLElBQUksQ0FBQyxDQUFDOzREQUNKLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTt3REFDbkIsQ0FBQztvREFDTCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxHQUFHO3dEQUNULEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOzREQUNqQixhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO2dFQUNuQixNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQTtnRUFDckIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBOzREQUNuQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0VBQ0wsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBOzREQUNuQixDQUFDLENBQUMsQ0FBQTt3REFDTixDQUFDO3dEQUFDLElBQUksQ0FBQyxDQUFDOzREQUNKLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTt3REFDbkIsQ0FBQztvREFDTCxDQUFDLENBQUMsQ0FBQTtnREFDTixDQUFDLENBQUMsQ0FBQzs0Q0FDUCxDQUFDOzRDQUFDLElBQUksQ0FBQyxDQUFDO2dEQUNKLGtCQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO29EQUNoQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dEQUNKLDJCQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFJOzREQUNwQixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7NERBQzFCLHdCQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO2dFQUNkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFBO2dFQUVsQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvRUFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQzt3RUFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7d0VBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtvRUFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO3dFQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtvRUFDbkIsQ0FBQyxDQUFDLENBQUE7Z0VBQ04sQ0FBQztnRUFBQyxJQUFJLENBQUMsQ0FBQztvRUFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7Z0VBQ25CLENBQUM7NERBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRztnRUFDVCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvRUFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQzt3RUFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7d0VBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtvRUFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO3dFQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtvRUFDbkIsQ0FBQyxDQUFDLENBQUE7Z0VBQ04sQ0FBQztnRUFBQyxJQUFJLENBQUMsQ0FBQztvRUFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7Z0VBQ25CLENBQUM7NERBQ0wsQ0FBQyxDQUFDLENBQUE7d0RBQ04sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVMsR0FBRzs0REFDakIsd0JBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7Z0VBQ2QsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUE7Z0VBQ2xCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29FQUNqQixhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO3dFQUNuQixNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQTt3RUFDckIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO29FQUNuQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7d0VBQ0wsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO29FQUNuQixDQUFDLENBQUMsQ0FBQTtnRUFDTixDQUFDO2dFQUFDLElBQUksQ0FBQyxDQUFDO29FQUNKLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtnRUFDbkIsQ0FBQzs0REFDTCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxHQUFHO2dFQUNULEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29FQUNqQixhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO3dFQUNuQixNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQTt3RUFDckIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO29FQUNuQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7d0VBQ0wsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO29FQUNuQixDQUFDLENBQUMsQ0FBQTtnRUFDTixDQUFDO2dFQUFDLElBQUksQ0FBQyxDQUFDO29FQUNKLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtnRUFDbkIsQ0FBQzs0REFDTCxDQUFDLENBQUMsQ0FBQTt3REFDTixDQUFDLENBQUMsQ0FBQztvREFDUCxDQUFDO29EQUFDLElBQUksQ0FBQyxDQUFDO3dEQUNKLHdCQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDOzREQUNkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFBOzREQUNsQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnRUFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztvRUFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7b0VBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtnRUFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO29FQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtnRUFDbkIsQ0FBQyxDQUFDLENBQUE7NERBQ04sQ0FBQzs0REFBQyxJQUFJLENBQUMsQ0FBQztnRUFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7NERBQ25CLENBQUM7d0RBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRzs0REFDVCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnRUFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztvRUFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7b0VBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtnRUFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO29FQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtnRUFDbkIsQ0FBQyxDQUFDLENBQUE7NERBQ04sQ0FBQzs0REFBQyxJQUFJLENBQUMsQ0FBQztnRUFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7NERBQ25CLENBQUM7d0RBQ0wsQ0FBQyxDQUFDLENBQUE7b0RBQ04sQ0FBQztnREFDTCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxHQUFHO29EQUNULHdCQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO3dEQUNkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFBO3dEQUNsQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs0REFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztnRUFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7Z0VBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dFQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQyxDQUFDLENBQUE7d0RBQ04sQ0FBQzt3REFBQyxJQUFJLENBQUMsQ0FBQzs0REFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7d0RBQ25CLENBQUM7b0RBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRzt3REFDVCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs0REFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztnRUFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7Z0VBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dFQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQyxDQUFDLENBQUE7d0RBQ04sQ0FBQzt3REFBQyxJQUFJLENBQUMsQ0FBQzs0REFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7d0RBQ25CLENBQUM7b0RBQ0wsQ0FBQyxDQUFDLENBQUE7Z0RBQ04sQ0FBQyxDQUFDLENBQUE7NENBQ04sQ0FBQzt3Q0FDTCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxHQUFHOzRDQUNULGtCQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO2dEQUNoQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29EQUNKLDJCQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFJO3dEQUNwQixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7d0RBQzFCLHdCQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDOzREQUNkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFBOzREQUNsQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnRUFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztvRUFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7b0VBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtnRUFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO29FQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtnRUFDbkIsQ0FBQyxDQUFDLENBQUE7NERBQ04sQ0FBQzs0REFBQyxJQUFJLENBQUMsQ0FBQztnRUFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7NERBQ25CLENBQUM7d0RBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRzs0REFDVCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnRUFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztvRUFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7b0VBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtnRUFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO29FQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtnRUFDbkIsQ0FBQyxDQUFDLENBQUE7NERBQ04sQ0FBQzs0REFBQyxJQUFJLENBQUMsQ0FBQztnRUFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7NERBQ25CLENBQUM7d0RBQ0wsQ0FBQyxDQUFDLENBQUE7b0RBQ04sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVMsR0FBRzt3REFDakIsd0JBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7NERBQ2QsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUE7NERBQ2xCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dFQUNqQixhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO29FQUNuQixNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQTtvRUFDckIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dFQUNuQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0VBQ0wsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dFQUNuQixDQUFDLENBQUMsQ0FBQTs0REFDTixDQUFDOzREQUFDLElBQUksQ0FBQyxDQUFDO2dFQUNKLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQzt3REFDTCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxHQUFHOzREQUNULEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dFQUNqQixhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO29FQUNuQixNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQTtvRUFDckIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dFQUNuQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0VBQ0wsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dFQUNuQixDQUFDLENBQUMsQ0FBQTs0REFDTixDQUFDOzREQUFDLElBQUksQ0FBQyxDQUFDO2dFQUNKLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQzt3REFDTCxDQUFDLENBQUMsQ0FBQTtvREFDTixDQUFDLENBQUMsQ0FBQztnREFDUCxDQUFDO2dEQUFDLElBQUksQ0FBQyxDQUFDO29EQUNKLHdCQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO3dEQUNkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFBO3dEQUNsQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs0REFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztnRUFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7Z0VBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dFQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQyxDQUFDLENBQUE7d0RBQ04sQ0FBQzt3REFBQyxJQUFJLENBQUMsQ0FBQzs0REFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7d0RBQ25CLENBQUM7b0RBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRzt3REFDVCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs0REFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztnRUFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7Z0VBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dFQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQyxDQUFDLENBQUE7d0RBQ04sQ0FBQzt3REFBQyxJQUFJLENBQUMsQ0FBQzs0REFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7d0RBQ25CLENBQUM7b0RBQ0wsQ0FBQyxDQUFDLENBQUE7Z0RBQ04sQ0FBQzs0Q0FDTCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxHQUFHO2dEQUNULHdCQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO29EQUNkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFBO29EQUNsQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3REFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQzs0REFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7NERBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTt3REFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDOzREQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTt3REFDbkIsQ0FBQyxDQUFDLENBQUE7b0RBQ04sQ0FBQztvREFBQyxJQUFJLENBQUMsQ0FBQzt3REFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7b0RBQ25CLENBQUM7Z0RBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRztvREFDVCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3REFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQzs0REFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7NERBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTt3REFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDOzREQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTt3REFDbkIsQ0FBQyxDQUFDLENBQUE7b0RBQ04sQ0FBQztvREFBQyxJQUFJLENBQUMsQ0FBQzt3REFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7b0RBQ25CLENBQUM7Z0RBQ0wsQ0FBQyxDQUFDLENBQUE7NENBQ04sQ0FBQyxDQUFDLENBQUE7d0NBQ04sQ0FBQyxDQUFDLENBQUE7b0NBQ04sQ0FBQztvQ0FBQyxJQUFJLENBQUMsQ0FBQzt3Q0FDSixrQkFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQzs0Q0FDaEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnREFDSiwyQkFBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBSTtvREFDcEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBO29EQUMxQix3QkFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQzt3REFDZCxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTt3REFFbEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7NERBQ2pCLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7Z0VBQ25CLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBO2dFQUNyQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7NERBQ25CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztnRUFDTCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7NERBQ25CLENBQUMsQ0FBQyxDQUFBO3dEQUNOLENBQUM7d0RBQUMsSUFBSSxDQUFDLENBQUM7NERBQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO3dEQUNuQixDQUFDO29EQUNMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7d0RBQ1QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7NERBQ2pCLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7Z0VBQ25CLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBO2dFQUNyQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7NERBQ25CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztnRUFDTCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7NERBQ25CLENBQUMsQ0FBQyxDQUFBO3dEQUNOLENBQUM7d0RBQUMsSUFBSSxDQUFDLENBQUM7NERBQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO3dEQUNuQixDQUFDO29EQUNMLENBQUMsQ0FBQyxDQUFBO2dEQUNOLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFTLEdBQUc7b0RBQ2pCLHdCQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO3dEQUNkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFBO3dEQUNsQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs0REFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztnRUFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7Z0VBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dFQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQyxDQUFDLENBQUE7d0RBQ04sQ0FBQzt3REFBQyxJQUFJLENBQUMsQ0FBQzs0REFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7d0RBQ25CLENBQUM7b0RBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRzt3REFDVCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs0REFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztnRUFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7Z0VBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dFQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs0REFDbkIsQ0FBQyxDQUFDLENBQUE7d0RBQ04sQ0FBQzt3REFBQyxJQUFJLENBQUMsQ0FBQzs0REFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7d0RBQ25CLENBQUM7b0RBQ0wsQ0FBQyxDQUFDLENBQUE7Z0RBQ04sQ0FBQyxDQUFDLENBQUM7NENBQ1AsQ0FBQzs0Q0FBQyxJQUFJLENBQUMsQ0FBQztnREFDSix3QkFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztvREFDZCxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTtvREFDbEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0RBQ2pCLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7NERBQ25CLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBOzREQUNyQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7d0RBQ25CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzs0REFDTCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7d0RBQ25CLENBQUMsQ0FBQyxDQUFBO29EQUNOLENBQUM7b0RBQUMsSUFBSSxDQUFDLENBQUM7d0RBQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO29EQUNuQixDQUFDO2dEQUNMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7b0RBQ1QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0RBQ2pCLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7NERBQ25CLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBOzREQUNyQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7d0RBQ25CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzs0REFDTCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7d0RBQ25CLENBQUMsQ0FBQyxDQUFBO29EQUNOLENBQUM7b0RBQUMsSUFBSSxDQUFDLENBQUM7d0RBQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO29EQUNuQixDQUFDO2dEQUNMLENBQUMsQ0FBQyxDQUFBOzRDQUNOLENBQUM7d0NBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRzs0Q0FDVCx3QkFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztnREFDZCxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTtnREFDbEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0RBQ2pCLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7d0RBQ25CLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBO3dEQUNyQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7b0RBQ25CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzt3REFDTCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7b0RBQ25CLENBQUMsQ0FBQyxDQUFBO2dEQUNOLENBQUM7Z0RBQUMsSUFBSSxDQUFDLENBQUM7b0RBQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dEQUNuQixDQUFDOzRDQUNMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7Z0RBQ1QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0RBQ2pCLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7d0RBQ25CLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBO3dEQUNyQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7b0RBQ25CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzt3REFDTCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7b0RBQ25CLENBQUMsQ0FBQyxDQUFBO2dEQUNOLENBQUM7Z0RBQUMsSUFBSSxDQUFDLENBQUM7b0RBQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dEQUNuQixDQUFDOzRDQUNMLENBQUMsQ0FBQyxDQUFBO3dDQUNOLENBQUMsQ0FBQyxDQUFBO29DQUNOLENBQUM7Z0NBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRztvQ0FDVCxrQkFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQzt3Q0FDaEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0Q0FDSiwyQkFBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBSTtnREFDcEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBO2dEQUMxQix3QkFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztvREFDZCxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTtvREFDbEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0RBQ2pCLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7NERBQ25CLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBOzREQUNyQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7d0RBQ25CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzs0REFDTCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7d0RBQ25CLENBQUMsQ0FBQyxDQUFBO29EQUNOLENBQUM7b0RBQUMsSUFBSSxDQUFDLENBQUM7d0RBQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO29EQUNuQixDQUFDO2dEQUNMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7b0RBQ1QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0RBQ2pCLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7NERBQ25CLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBOzREQUNyQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7d0RBQ25CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzs0REFDTCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7d0RBQ25CLENBQUMsQ0FBQyxDQUFBO29EQUNOLENBQUM7b0RBQUMsSUFBSSxDQUFDLENBQUM7d0RBQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO29EQUNuQixDQUFDO2dEQUNMLENBQUMsQ0FBQyxDQUFBOzRDQUNOLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFTLEdBQUc7Z0RBQ2pCLHdCQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO29EQUNkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFBO29EQUNsQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3REFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQzs0REFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7NERBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTt3REFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDOzREQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTt3REFDbkIsQ0FBQyxDQUFDLENBQUE7b0RBQ04sQ0FBQztvREFBQyxJQUFJLENBQUMsQ0FBQzt3REFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7b0RBQ25CLENBQUM7Z0RBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRztvREFDVCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3REFDakIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQzs0REFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7NERBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTt3REFDbkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDOzREQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTt3REFDbkIsQ0FBQyxDQUFDLENBQUE7b0RBQ04sQ0FBQztvREFBQyxJQUFJLENBQUMsQ0FBQzt3REFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7b0RBQ25CLENBQUM7Z0RBQ0wsQ0FBQyxDQUFDLENBQUE7NENBQ04sQ0FBQyxDQUFDLENBQUM7d0NBQ1AsQ0FBQzt3Q0FBQyxJQUFJLENBQUMsQ0FBQzs0Q0FDSix3QkFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztnREFDZCxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTtnREFDbEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0RBQ2pCLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7d0RBQ25CLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBO3dEQUNyQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7b0RBQ25CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzt3REFDTCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7b0RBQ25CLENBQUMsQ0FBQyxDQUFBO2dEQUNOLENBQUM7Z0RBQUMsSUFBSSxDQUFDLENBQUM7b0RBQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dEQUNuQixDQUFDOzRDQUNMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7Z0RBQ1QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0RBQ2pCLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7d0RBQ25CLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBO3dEQUNyQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7b0RBQ25CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzt3REFDTCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7b0RBQ25CLENBQUMsQ0FBQyxDQUFBO2dEQUNOLENBQUM7Z0RBQUMsSUFBSSxDQUFDLENBQUM7b0RBQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dEQUNuQixDQUFDOzRDQUNMLENBQUMsQ0FBQyxDQUFBO3dDQUNOLENBQUM7b0NBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRzt3Q0FDVCx3QkFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQzs0Q0FDZCxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTs0Q0FDbEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0RBQ2pCLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7b0RBQ25CLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBO29EQUNyQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7Z0RBQ25CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztvREFDTCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7Z0RBQ25CLENBQUMsQ0FBQyxDQUFBOzRDQUNOLENBQUM7NENBQUMsSUFBSSxDQUFDLENBQUM7Z0RBQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBOzRDQUNuQixDQUFDO3dDQUNMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7NENBQ1QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0RBQ2pCLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7b0RBQ25CLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBO29EQUNyQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7Z0RBQ25CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztvREFDTCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7Z0RBQ25CLENBQUMsQ0FBQyxDQUFBOzRDQUNOLENBQUM7NENBQUMsSUFBSSxDQUFDLENBQUM7Z0RBQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBOzRDQUNuQixDQUFDO3dDQUNMLENBQUMsQ0FBQyxDQUFBO29DQUNOLENBQUMsQ0FBQyxDQUFBO2dDQUNOLENBQUMsQ0FBQyxDQUFBOzRCQUNOLENBQUMsQ0FBQyxDQUFDO3dCQUNQLENBQUMsQ0FBQyxDQUFDO29CQUNQLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUF4akJEO3lCQXdqQkMsQ0FBQTtBQUFBLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBvcyBmcm9tIFwib3NcIjtcbmltcG9ydCAqIGFzIGNoaWxkX3Byb2Nlc3MgZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcblxuaW1wb3J0ICogYXMgUHJvbWlzZSBmcm9tIFwiYmx1ZWJpcmRcIjtcblxuaW1wb3J0ICogYXMgc3VwZXJhZ2VudCBmcm9tIFwic3VwZXJhZ2VudFwiO1xuXG5cbmltcG9ydCBsYXMgZnJvbSBcImxpbnV4LWF1ZGlvLXN0YXRlXCI7XG5pbXBvcnQgbHN1c2IgZnJvbSBcImxzdXNiZGV2XCI7XG5pbXBvcnQgbHZzIGZyb20gXCJsaW51eC12aWRlby1zdGF0ZVwiO1xuXG5pbXBvcnQgdGVtcGNwdXMgZnJvbSBcImxpbnV4LWNwdS10ZW1wXCI7XG5cblxuaW1wb3J0IG5ldHdvcmtzdGF0dXMgZnJvbSBcIm5ldHdvcmtzdGF0dXNcIlxuXG5pbXBvcnQgZGViQ2hlY2sgZnJvbSBcImRlYmNoZWNrXCJcblxuaW1wb3J0ICogYXMgbHNkaXNrcyBmcm9tIFwibHMtZGlza3NcIjtcblxuY29uc3QgZXhlYyA9IGNoaWxkX3Byb2Nlc3MuZXhlYztcblxuaW50ZXJmYWNlIEljb3JlcyB7XG5cbiAgICB0ZW1wOiBudW1iZXI7XG4gICAgdW5pdDogc3RyaW5nXG4gICAgY29yZW51bWJlcjogbnVtYmVyO1xuICAgIHZlcnNpb246IHN0cmluZztcbn1cblxuXG5pbnRlcmZhY2UgSXRlbXAge1xuXG4gICAgdGVtcGVyYXR1cmU6IG51bWJlcjtcbiAgICB1bml0OiBzdHJpbmc7XG4gICAgbWF4OiBudW1iZXI7XG4gICAgbWluOiBudW1iZXI7XG4gICAgY29yZXM6IEljb3Jlc1tdO1xuXG59XG5cbmludGVyZmFjZSBBdWRpb0NoYW5uZWxBbnN3ZXIge1xuICAgIGRldjogc3RyaW5nO1xuICAgIGFjdGl2ZTogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIEF1ZGlvQW5zd2VyIHtcbiAgICBsYWJlbDogc3RyaW5nO1xuICAgIGRldjogc3RyaW5nO1xuICAgIHB1bHNlbmFtZTogc3RyaW5nO1xuICAgIGFjdGl2ZTogYm9vbGVhbjtcbiAgICBjaGFubmVsczogQXVkaW9DaGFubmVsQW5zd2VyW107XG59XG5cbmludGVyZmFjZSBWaWRlb0NoYW5uZWxBbnN3ZXIge1xuICAgIGRldjogc3RyaW5nO1xuICAgIGxhYmVsOiBzdHJpbmc7XG4gICAgYWN0aXZlOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgVmlkZW9BbnN3ZXIge1xuICAgIGRldjogc3RyaW5nO1xuICAgIGxhYmVsOiBzdHJpbmc7XG4gICAgYWN0aXZlOiBib29sZWFuO1xuICAgIGNoYW5uZWxzOiBWaWRlb0NoYW5uZWxBbnN3ZXJbXTtcbiAgICBtb2RlbF9pZDogc3RyaW5nO1xuICAgIHZlbmRvcl9pZDogc3RyaW5nO1xuICAgIHJlc29sdXRpb246IHN0cmluZztcbiAgICBidXM6IHN0cmluZztcbiAgICBzZXJpYWw6IHN0cmluZztcbn1cblxuXG5pbnRlcmZhY2UgSVNjYW4ge1xuICAgIGVzc2lkOiBzdHJpbmc7XG4gICAgbWFjOiBzdHJpbmc7XG4gICAgc2lnbmFsOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBJTmV0d29yayB7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIG1hYzogc3RyaW5nO1xuICAgIGludGVyZmFjZTogc3RyaW5nO1xuICAgIGVzc2lkPzogc3RyaW5nO1xuICAgIHNjYW4/OiBJU2NhbltdO1xuICAgIGlwPzogc3RyaW5nO1xuICAgIGdhdGV3YXk/OiBzdHJpbmc7XG59XG5cblxuaW50ZXJmYWNlIElOZXRTdGF0dXMge1xuXG4gICAgbmV0d29ya3M6IElOZXR3b3JrW107XG4gICAgbmV0d29yazogSU5ldHdvcms7XG59XG5cblxuXG5pbnRlcmZhY2UgTHN1c2JkZXZBbnN3ZXIge1xuICAgIGRldjogc3RyaW5nO1xuICAgIHR5cGU6IHN0cmluZztcbiAgICBodWI6IHN0cmluZztcbiAgICBwcm9kdWN0OiBzdHJpbmc7XG4gICAgaWQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIElQYXJ0aXRpb24ge1xuICAgIHBhcnRpdGlvbjogc3RyaW5nO1xuICAgIHNlY3RvcnM6IG51bWJlcjtcbiAgICBzZWN0b3JzX3N0YXJ0OiBudW1iZXI7XG4gICAgc2VjdG9yc19zdG9wOiBudW1iZXI7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIGJvb3Q6IGJvb2xlYW47XG4gICAgc2l6ZTogbnVtYmVyO1xuICAgIGxhYmVsPzogc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBodW1hbnNpemU6IHN0cmluZztcbiAgICB1c2VkOiBzdHJpbmc7XG4gICAgYXZhaWxhYmxlOiBzdHJpbmc7XG4gICAgcGVyY2VudHVzZWQ6IHN0cmluZztcbiAgICBtb3VudGVkOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBJRGlzayB7XG4gICAgZGlzazogc3RyaW5nO1xuICAgIHNlY3RvcnM6IG51bWJlcjtcbiAgICBzaXplOiBudW1iZXI7XG4gICAgcGFydGl0aW9uczogSVBhcnRpdGlvbltdO1xuICAgIGJsb2NrOiBudW1iZXI7XG4gICAgdXNlZF9ibG9ja3M6IG51bWJlcjtcbn1cblxuXG5pbnRlcmZhY2UgQW5zd2VyIHtcbiAgICBib290SWQ6IHN0cmluZztcbiAgICBib290VGltZTogbnVtYmVyO1xuICAgIHVwZGF0ZWRBdDogbnVtYmVyO1xuICAgIHVzYkRldmljZXM6IExzdXNiZGV2QW5zd2VyW107XG4gICAgZHJpdmVzOiBJRGlza1tdO1xuICAgIG5ldHdvcmtzOiBJTmV0d29ya1tdO1xuICAgIG5ldHdvcms6IElOZXR3b3JrO1xuICAgIHZpZGVvOiB7XG4gICAgICAgIGlucHV0czogVmlkZW9BbnN3ZXJbXTtcbiAgICB9O1xuICAgIGF1ZGlvOiB7XG4gICAgICAgIGlucHV0czogQXVkaW9BbnN3ZXJbXTtcbiAgICB9O1xuICAgIGNwdXRlbXA6IEl0ZW1wO1xuICAgIHN5c3RlbToge1xuICAgICAgICBsb2FkYXZnOiBudW1iZXJbXTtcbiAgICAgICAgZnJlZW1lbTogbnVtYmVyO1xuICAgICAgICB0b3RhbG1lbTogbnVtYmVyO1xuICAgICAgICByZWxlYXNlOiBzdHJpbmc7XG4gICAgICAgIGFyY2g6IHN0cmluZztcbiAgICAgICAgb3N0eXBlOiBzdHJpbmc7XG4gICAgICAgIHBsYXRmb3JtOiBzdHJpbmc7XG4gICAgICAgIGNvcmVzOiBudW1iZXI7XG4gICAgfVxuICAgIGV4dGVybmFsSXA6IHN0cmluZztcbn1cblxuZnVuY3Rpb24gZ2V0RXh0ZXJuYWxJcCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmc+KGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICAgIHN1cGVyYWdlbnQuZ2V0KCdodHRwczovL2FwaS5pcGlmeS5vcmc/Zm9ybWF0PWpzb24nKS5lbmQoZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlcy5ib2R5LmlwKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN5c2luZm8oKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPEFuc3dlcj4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cblxuICAgICAgICBsZXQgb2JqZWN0ID0gPEFuc3dlcj57fTtcbiAgICAgICAgb2JqZWN0LnVwZGF0ZWRBdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBvYmplY3QuYXVkaW8gPSA8eyBpbnB1dHM6IEF1ZGlvQW5zd2VyW10gfT57IGlucHV0czogW10gfTtcbiAgICAgICAgb2JqZWN0LnZpZGVvID0gPHsgaW5wdXRzOiBWaWRlb0Fuc3dlcltdIH0+eyBpbnB1dHM6IFtdIH07XG4gICAgICAgIGxldCBjYWxsYmFja2VkID0gZmFsc2U7XG4gICAgICAgIGxldCB0aW1vID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2tlZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGltZW91dCBib290SWQgcmVhZCB0aW1lb3V0XCIpO1xuICAgICAgICAgICAgICAgIHJlamVjdChcInRpbWVvdXRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMDAwKTtcbiAgICAgICAgb2JqZWN0LnN5c3RlbSA9IHtcbiAgICAgICAgICAgIGxvYWRhdmc6IG9zLmxvYWRhdmcoKSxcbiAgICAgICAgICAgIGZyZWVtZW06IG9zLmZyZWVtZW0oKSxcbiAgICAgICAgICAgIHRvdGFsbWVtOiBvcy50b3RhbG1lbSgpLFxuICAgICAgICAgICAgcmVsZWFzZTogb3MucmVsZWFzZSgpLFxuICAgICAgICAgICAgYXJjaDogb3MuYXJjaCgpLFxuICAgICAgICAgICAgb3N0eXBlOiBvcy50eXBlKCksXG4gICAgICAgICAgICBwbGF0Zm9ybTogb3MucGxhdGZvcm0oKSxcbiAgICAgICAgICAgIGNvcmVzOiBvcy5sb2FkYXZnKCkubGVuZ3RoXG4gICAgICAgIH07XG4gICAgICAgIG9iamVjdC5leHRlcm5hbElwID0gJydcbiAgICAgICAgZXhlYyhcImNhdCAvcHJvYy9zeXMva2VybmVsL3JhbmRvbS9ib290X2lkXCIsIHsgdGltZW91dDogOTAwMCB9LCBmdW5jdGlvbihlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnJvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbW8pO1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0ZGVyciAmJiBzdGRlcnIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1vKTtcbiAgICAgICAgICAgICAgICByZWplY3Qoc3RkZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbW8pO1xuXG4gICAgICAgICAgICAgICAgbGV0IGNhbGxiYWNrZWQyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbGV0IHRpbW8yID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjYWxsYmFja2VkMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0aW1lb3V0IGJvb3RUaW1lIHJlYWQgdGltZW91dFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChcInRpbWVvdXRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAxMDAwMCk7XG5cbiAgICAgICAgICAgICAgICBvYmplY3QuYm9vdElkID0gc3Rkb3V0LnRvU3RyaW5nKCkucmVwbGFjZShcIlxcblwiLCBcIlwiKTtcblxuICAgICAgICAgICAgICAgIGV4ZWMoXCJjYXQgL3Byb2Mvc3RhdCB8IGdyZXAgYnRpbWUgfCBhd2sgJ3sgcHJpbnQgJDIgfSdcIiwgeyB0aW1lb3V0OiA5MDAwIH0sIGZ1bmN0aW9uKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tlZDIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbW8yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RkZXJyICYmIHN0ZGVyciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja2VkMiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltbzIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHN0ZGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja2VkMiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltbzIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuYm9vdFRpbWUgPSBwYXJzZUludChzdGRvdXQudG9TdHJpbmcoKSkgKiAxMDAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsc3VzYigpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC51c2JEZXZpY2VzID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZHJpdmVzID0gbHNkaXNrcy5hbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXR3b3Jrc3RhdHVzKCkudGhlbihmdW5jdGlvbihkYXRhOiBJTmV0U3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrcyA9IGRhdGEubmV0d29ya3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5uZXR3b3JrID0gZGF0YS5uZXR3b3JrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJDaGVjaygndjRsLWNvbmYnKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYkNoZWNrKCd2NGwtdXRpbHMnKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsdnMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QudmlkZW8uaW5wdXRzID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wY3B1cygpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYkNoZWNrKCdwdWxzZWF1ZGlvLXV0aWxzJykudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhcygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmF1ZGlvLmlucHV0cyA9IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJDaGVjaygncHVsc2VhdWRpby11dGlscycpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5hdWRpby5pbnB1dHMgPSBkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wY3B1cygpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGViQ2hlY2soJ3B1bHNlYXVkaW8tdXRpbHMnKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuYXVkaW8uaW5wdXRzID0gZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wY3B1cygpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wY3B1cygpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYkNoZWNrKCdwdWxzZWF1ZGlvLXV0aWxzJykudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhcygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmF1ZGlvLmlucHV0cyA9IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QubmV0d29yaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wY3B1cygpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZXh0ZXJuYWxJcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXh0ZXJuYWxJcCgpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5uZXR3b3JrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHRlcm5hbElwKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5leHRlcm5hbElwID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0Lm5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4dGVybmFsSXAoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmV4dGVybmFsSXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcbiJdfQ==
