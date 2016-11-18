var child_process = require("child_process");
var Promise = require("bluebird");
var linux_audio_state_1 = require("linux-audio-state");
var lsusbdev_1 = require("lsusbdev");
var linux_video_state_1 = require("linux-video-state");
var linux_cpu_temp_1 = require("linux-cpu-temp");
var networkstatus_1 = require("networkstatus");
var debcheck_1 = require("debcheck");
var lsdisks = require("ls-disks");
var exec = child_process.exec;
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
                var callbacked2 = false;
                var timo2 = setTimeout(function () {
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
                                debcheck_1.default('v4l-conf').then(function (a) {
                                    if (a) {
                                        debcheck_1.default('v4l-utils').then(function (a) {
                                            if (a) {
                                                linux_video_state_1.default().then(function (data) {
                                                    object.video.inputs = data;
                                                    linux_cpu_temp_1.default().then(function (a) {
                                                        object.cputemp = a;
                                                        resolve(object);
                                                    }).catch(function (err) {
                                                        resolve(object);
                                                    });
                                                }).catch(function (err) {
                                                    console.log(err);
                                                    linux_cpu_temp_1.default().then(function (a) {
                                                        object.cputemp = a;
                                                        resolve(object);
                                                    }).catch(function (err) {
                                                        resolve(object);
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
                                                                resolve(object);
                                                            }).catch(function (err) {
                                                                resolve(object);
                                                            });
                                                        }).catch(function (err) {
                                                            linux_cpu_temp_1.default().then(function (a) {
                                                                object.cputemp = a;
                                                                resolve(object);
                                                            }).catch(function (err) {
                                                                resolve(object);
                                                            });
                                                        });
                                                    }
                                                    else {
                                                        linux_cpu_temp_1.default().then(function (a) {
                                                            object.cputemp = a;
                                                            resolve(object);
                                                        }).catch(function (err) {
                                                            resolve(object);
                                                        });
                                                    }
                                                }).catch(function (err) {
                                                    linux_cpu_temp_1.default().then(function (a) {
                                                        object.cputemp = a;
                                                        resolve(object);
                                                    }).catch(function (err) {
                                                        resolve(object);
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
                                                            resolve(object);
                                                        }).catch(function (err) {
                                                            resolve(object);
                                                        });
                                                    }).catch(function (err) {
                                                        linux_cpu_temp_1.default().then(function (a) {
                                                            object.cputemp = a;
                                                            resolve(object);
                                                        }).catch(function (err) {
                                                            resolve(object);
                                                        });
                                                    });
                                                }
                                                else {
                                                    linux_cpu_temp_1.default().then(function (a) {
                                                        object.cputemp = a;
                                                        resolve(object);
                                                    }).catch(function (err) {
                                                        resolve(object);
                                                    });
                                                }
                                            }).catch(function (err) {
                                                linux_cpu_temp_1.default().then(function (a) {
                                                    object.cputemp = a;
                                                    resolve(object);
                                                }).catch(function (err) {
                                                    resolve(object);
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
                                                        resolve(object);
                                                    }).catch(function (err) {
                                                        resolve(object);
                                                    });
                                                }).catch(function (err) {
                                                    linux_cpu_temp_1.default().then(function (a) {
                                                        object.cputemp = a;
                                                        resolve(object);
                                                    }).catch(function (err) {
                                                        resolve(object);
                                                    });
                                                });
                                            }
                                            else {
                                                linux_cpu_temp_1.default().then(function (a) {
                                                    object.cputemp = a;
                                                    resolve(object);
                                                }).catch(function (err) {
                                                    resolve(object);
                                                });
                                            }
                                        }).catch(function (err) {
                                            linux_cpu_temp_1.default().then(function (a) {
                                                object.cputemp = a;
                                                resolve(object);
                                            }).catch(function (err) {
                                                resolve(object);
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
                                                    resolve(object);
                                                }).catch(function (err) {
                                                    resolve(object);
                                                });
                                            }).catch(function (err) {
                                                linux_cpu_temp_1.default().then(function (a) {
                                                    object.cputemp = a;
                                                    resolve(object);
                                                }).catch(function (err) {
                                                    resolve(object);
                                                });
                                            });
                                        }
                                        else {
                                            linux_cpu_temp_1.default().then(function (a) {
                                                object.cputemp = a;
                                                resolve(object);
                                            }).catch(function (err) {
                                                resolve(object);
                                            });
                                        }
                                    }).catch(function (err) {
                                        linux_cpu_temp_1.default().then(function (a) {
                                            object.cputemp = a;
                                            resolve(object);
                                        }).catch(function (err) {
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
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sysinfo;
;

//# sourceMappingURL=data:application/json;base64,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QUE7d0NBQ25CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7NENBQ1QsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO3dDQUNuQixDQUFDLENBQUMsQ0FBQTtvQ0FDTixDQUFDLENBQUMsQ0FBQTtnQ0FDTixDQUFDLENBQUMsQ0FBQTs0QkFDTixDQUFDLENBQUMsQ0FBQzt3QkFDUCxDQUFDLENBQUMsQ0FBQztvQkFDUCxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDQSxDQUFDQTtBQUNQQSxDQUFDQTtBQTNPRDt5QkEyT0MsQ0FBQTtBQUFBLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCAqIGFzIGNoaWxkX3Byb2Nlc3MgZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcbmltcG9ydCAqIGFzIFByb21pc2UgZnJvbSBcImJsdWViaXJkXCI7XG5cbmltcG9ydCBsYXMgZnJvbSBcImxpbnV4LWF1ZGlvLXN0YXRlXCI7XG5pbXBvcnQgbHN1c2IgZnJvbSBcImxzdXNiZGV2XCI7XG5pbXBvcnQgbHZzIGZyb20gXCJsaW51eC12aWRlby1zdGF0ZVwiO1xuXG5pbXBvcnQgdGVtcGNwdXMgZnJvbSBcImxpbnV4LWNwdS10ZW1wXCI7XG5cblxuaW1wb3J0IG5ldHdvcmtzdGF0dXMgZnJvbSBcIm5ldHdvcmtzdGF0dXNcIlxuXG5pbXBvcnQgZGViQ2hlY2sgZnJvbSBcImRlYmNoZWNrXCJcblxuaW1wb3J0ICogYXMgbHNkaXNrcyBmcm9tIFwibHMtZGlza3NcIjtcblxuY29uc3QgZXhlYyA9IGNoaWxkX3Byb2Nlc3MuZXhlYztcblxuXG5cblxuaW50ZXJmYWNlIEljb3JlcyB7XG5cbiAgICB0ZW1wOiBudW1iZXI7XG4gICAgdW5pdDogc3RyaW5nXG4gICAgY29yZW51bWJlcjogbnVtYmVyO1xuICAgIHZlcnNpb246IHN0cmluZztcbn1cblxuXG5pbnRlcmZhY2UgSXRlbXAge1xuXG4gICAgdGVtcGVyYXR1cmU6IG51bWJlcjtcbiAgICB1bml0OiBzdHJpbmc7XG4gICAgbWF4OiBudW1iZXI7XG4gICAgbWluOiBudW1iZXI7XG4gICAgY29yZXM6IEljb3Jlc1tdO1xuXG59XG5cblxuXG5pbnRlcmZhY2UgQXVkaW9DaGFubmVsQW5zd2VyIHtcbiAgICBkZXY6IHN0cmluZztcbiAgICBhY3RpdmU6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBBdWRpb0Fuc3dlciB7XG4gICAgbGFiZWw6IHN0cmluZztcbiAgICBkZXY6IHN0cmluZztcbiAgICBwdWxzZW5hbWU6IHN0cmluZztcbiAgICBhY3RpdmU6IGJvb2xlYW47XG4gICAgY2hhbm5lbHM6IEF1ZGlvQ2hhbm5lbEFuc3dlcltdO1xufVxuXG5pbnRlcmZhY2UgVmlkZW9DaGFubmVsQW5zd2VyIHtcbiAgICBkZXY6IHN0cmluZztcbiAgICBsYWJlbDogc3RyaW5nO1xuICAgIGFjdGl2ZTogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFZpZGVvQW5zd2VyIHtcbiAgICBkZXY6IHN0cmluZztcbiAgICBsYWJlbDogc3RyaW5nO1xuICAgIGFjdGl2ZTogYm9vbGVhbjtcbiAgICBjaGFubmVsczogVmlkZW9DaGFubmVsQW5zd2VyW107XG4gICAgbW9kZWxfaWQ6IHN0cmluZztcbiAgICB2ZW5kb3JfaWQ6IHN0cmluZztcbiAgICByZXNvbHV0aW9uOiBzdHJpbmc7XG4gICAgYnVzOiBzdHJpbmc7XG4gICAgc2VyaWFsOiBzdHJpbmc7XG59XG5cblxuaW50ZXJmYWNlIElTY2FuIHtcbiAgICBlc3NpZDogc3RyaW5nO1xuICAgIG1hYzogc3RyaW5nO1xuICAgIHNpZ25hbDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgSU5ldHdvcmsge1xuICAgIHR5cGU6IHN0cmluZztcbiAgICBtYWM6IHN0cmluZztcbiAgICBpbnRlcmZhY2U6IHN0cmluZztcbiAgICBlc3NpZD86IHN0cmluZztcbiAgICBzY2FuPzogSVNjYW5bXTtcbiAgICBpcD86IHN0cmluZztcbiAgICBnYXRld2F5Pzogc3RyaW5nO1xufVxuXG5cbmludGVyZmFjZSBJTmV0U3RhdHVzIHtcblxuICAgIG5ldHdvcmtzOiBJTmV0d29ya1tdO1xuICAgIG5ldHdvcms6IElOZXR3b3JrO1xufVxuXG5cblxuaW50ZXJmYWNlIExzdXNiZGV2QW5zd2VyIHtcbiAgICBkZXY6IHN0cmluZztcbiAgICB0eXBlOiBzdHJpbmc7XG4gICAgaHViOiBzdHJpbmc7XG4gICAgcHJvZHVjdDogc3RyaW5nO1xuICAgIGlkOiBzdHJpbmc7XG59XG5cblxuXG5cbmludGVyZmFjZSBJUGFydGl0aW9uIHtcbiAgICBwYXJ0aXRpb246IHN0cmluZztcbiAgICBzZWN0b3JzOiBudW1iZXI7XG4gICAgc2VjdG9yc19zdGFydDogbnVtYmVyO1xuICAgIHNlY3RvcnNfc3RvcDogbnVtYmVyO1xuICAgIHR5cGU6IHN0cmluZztcbiAgICBib290OiBib29sZWFuO1xuICAgIHNpemU6IG51bWJlcjtcbiAgICBsYWJlbD86IHN0cmluZztcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgaHVtYW5zaXplOiBzdHJpbmc7XG4gICAgdXNlZDogc3RyaW5nO1xuICAgIGF2YWlsYWJsZTogc3RyaW5nO1xuICAgIHBlcmNlbnR1c2VkOiBzdHJpbmc7XG4gICAgbW91bnRlZDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgSURpc2sge1xuICAgIGRpc2s6IHN0cmluZztcbiAgICBzZWN0b3JzOiBudW1iZXI7XG4gICAgc2l6ZTogbnVtYmVyO1xuICAgIHBhcnRpdGlvbnM6IElQYXJ0aXRpb25bXTtcbiAgICBibG9jazogbnVtYmVyO1xuICAgIHVzZWRfYmxvY2tzOiBudW1iZXI7XG59XG5cblxuaW50ZXJmYWNlIEFuc3dlciB7XG4gICAgYm9vdElkOiBzdHJpbmc7XG4gICAgYm9vdFRpbWU6IG51bWJlcjtcbiAgICB1cGRhdGVkQXQ6IG51bWJlcjtcbiAgICB1c2JEZXZpY2VzOiBMc3VzYmRldkFuc3dlcltdO1xuICAgIGRyaXZlczogSURpc2tbXTtcbiAgICBuZXR3b3JrczogSU5ldHdvcmtbXTtcbiAgICBuZXR3b3JrOiBJTmV0d29yaztcbiAgICB2aWRlbzoge1xuICAgICAgICBpbnB1dHM6IFZpZGVvQW5zd2VyW107XG4gICAgfTtcbiAgICBhdWRpbzoge1xuICAgICAgICBpbnB1dHM6IEF1ZGlvQW5zd2VyW107XG4gICAgfTtcbiAgICBjcHV0ZW1wOiBJdGVtcFxufVxuXG5cblxuXG5cblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzeXNpbmZvKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxBbnN3ZXI+KGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblxuXG4gICAgICAgIGxldCBvYmplY3QgPSA8QW5zd2VyPnt9O1xuICAgICAgICBvYmplY3QudXBkYXRlZEF0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIG9iamVjdC5hdWRpbyA9IDx7IGlucHV0czogQXVkaW9BbnN3ZXJbXSB9PnsgaW5wdXRzOiBbXSB9O1xuICAgICAgICBvYmplY3QudmlkZW8gPSA8eyBpbnB1dHM6IFZpZGVvQW5zd2VyW10gfT57IGlucHV0czogW10gfTtcbiAgICAgICAgbGV0IGNhbGxiYWNrZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IHRpbW8gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2tlZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGltZW91dCBib290SWQgcmVhZCB0aW1lb3V0XCIpO1xuICAgICAgICAgICAgICAgIHJlamVjdChcInRpbWVvdXRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMDAwKTtcblxuXG4gICAgICAgIGV4ZWMoXCJjYXQgL3Byb2Mvc3lzL2tlcm5lbC9yYW5kb20vYm9vdF9pZFwiLCB7IHRpbWVvdXQ6IDkwMDAgfSwgZnVuY3Rpb24gKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgICAgaWYgKGVycm9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltbyk7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RkZXJyICYmIHN0ZGVyciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbW8pO1xuICAgICAgICAgICAgICAgIHJlamVjdChzdGRlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltbyk7XG5cbiAgICAgICAgICAgICAgICBsZXQgY2FsbGJhY2tlZDIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZXQgdGltbzIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjYWxsYmFja2VkMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0aW1lb3V0IGJvb3RUaW1lIHJlYWQgdGltZW91dFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChcInRpbWVvdXRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAxMDAwMCk7XG5cblxuICAgICAgICAgICAgICAgIG9iamVjdC5ib290SWQgPSBzdGRvdXQudG9TdHJpbmcoKS5yZXBsYWNlKFwiXFxuXCIsIFwiXCIpO1xuXG4gICAgICAgICAgICAgICAgZXhlYyhcImNhdCAvcHJvYy9zdGF0IHwgZ3JlcCBidGltZSB8IGF3ayAneyBwcmludCAkMiB9J1wiLCB7IHRpbWVvdXQ6IDkwMDAgfSwgZnVuY3Rpb24gKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tlZDIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbW8yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RkZXJyICYmIHN0ZGVyciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja2VkMiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltbzIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHN0ZGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja2VkMiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltbzIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuYm9vdFRpbWUgPSBwYXJzZUludChzdGRvdXQudG9TdHJpbmcoKSkgKiAxMDAwO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxzdXNiKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC51c2JEZXZpY2VzID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZHJpdmVzID0gbHNkaXNrcy5hbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXR3b3Jrc3RhdHVzKCkudGhlbihmdW5jdGlvbiAoZGF0YTogSU5ldFN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29ya3MgPSBkYXRhLm5ldHdvcmtzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yayA9IGRhdGEubmV0d29yaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGViQ2hlY2soJ3Y0bC1jb25mJykudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJDaGVjaygndjRsLXV0aWxzJykudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbHZzKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC52aWRlby5pbnB1dHMgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYkNoZWNrKCdwdWxzZWF1ZGlvLXV0aWxzJykudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhcygpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5hdWRpby5pbnB1dHMgPSBkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wY3B1cygpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJDaGVjaygncHVsc2VhdWRpby11dGlscycpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuYXVkaW8uaW5wdXRzID0gZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wY3B1cygpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJDaGVjaygncHVsc2VhdWRpby11dGlscycpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhcygpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuYXVkaW8uaW5wdXRzID0gZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wY3B1cygpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuY3B1dGVtcCA9IGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGViQ2hlY2soJ3B1bHNlYXVkaW8tdXRpbHMnKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmF1ZGlvLmlucHV0cyA9IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBjcHVzKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGNwdXMoKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wY3B1cygpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5jcHV0ZW1wID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wY3B1cygpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmNwdXRlbXAgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
