var child_process = require("child_process");
var Promise = require("bluebird");
var linux_audio_state_1 = require("linux-audio-state");
var lsusbdev_1 = require("lsusbdev");
var linux_video_state_1 = require("linux-video-state");
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
                                                    resolve(object);
                                                }).catch(function (err) {
                                                    console.log(err);
                                                    resolve(object);
                                                });
                                            }
                                            else {
                                                debcheck_1.default('pulseaudio-utils').then(function (a) {
                                                    if (a) {
                                                        linux_audio_state_1.default().then(function (data) {
                                                            object.audio.inputs = data;
                                                            resolve(object);
                                                        }).catch(function (err) {
                                                            resolve(object);
                                                        });
                                                    }
                                                    else {
                                                        resolve(object);
                                                    }
                                                }).catch(function (err) {
                                                    resolve(object);
                                                });
                                            }
                                        }).catch(function (err) {
                                            debcheck_1.default('pulseaudio-utils').then(function (a) {
                                                if (a) {
                                                    linux_audio_state_1.default().then(function (data) {
                                                        object.audio.inputs = data;
                                                        resolve(object);
                                                    }).catch(function (err) {
                                                        resolve(object);
                                                    });
                                                }
                                                else {
                                                    resolve(object);
                                                }
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
                                                    resolve(object);
                                                }).catch(function (err) {
                                                    resolve(object);
                                                });
                                            }
                                            else {
                                                resolve(object);
                                            }
                                        }).catch(function (err) {
                                            resolve(object);
                                        });
                                    }
                                }).catch(function (err) {
                                    debcheck_1.default('pulseaudio-utils').then(function (a) {
                                        if (a) {
                                            linux_audio_state_1.default().then(function (data) {
                                                object.audio.inputs = data;
                                                resolve(object);
                                            }).catch(function (err) {
                                                resolve(object);
                                            });
                                        }
                                        else {
                                            resolve(object);
                                        }
                                    }).catch(function (err) {
                                        resolve(object);
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

//# sourceMappingURL=data:application/json;base64,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QUFDLE1BQU0sQ0FBQyxDQUFBO3dDQUNuQixDQUFDLENBQUMsQ0FBQTtvQ0FDTixDQUFDO2dDQUNMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7b0NBQ1Qsa0JBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7d0NBQ2hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NENBQ0osMkJBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUk7Z0RBQ3JCLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtnREFDMUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBOzRDQUNuQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHO2dEQUNsQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7NENBQ25CLENBQUMsQ0FBQyxDQUFDO3dDQUNQLENBQUM7d0NBQUMsSUFBSSxDQUFDLENBQUM7NENBQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO3dDQUNuQixDQUFDO29DQUNMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7d0NBQ1QsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO29DQUNuQixDQUFDLENBQUMsQ0FBQTtnQ0FDTixDQUFDLENBQUMsQ0FBQTs0QkFDTixDQUFDLENBQUMsQ0FBQzt3QkFDUCxDQUFDLENBQUMsQ0FBQztvQkFDUCxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDQSxDQUFDQTtBQUNQQSxDQUFDQTtBQWpKRDt5QkFpSkMsQ0FBQTtBQUFBLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCAqIGFzIGNoaWxkX3Byb2Nlc3MgZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcbmltcG9ydCAqIGFzIFByb21pc2UgZnJvbSBcImJsdWViaXJkXCI7XG5cbmltcG9ydCBsYXMgZnJvbSBcImxpbnV4LWF1ZGlvLXN0YXRlXCI7XG5pbXBvcnQgbHN1c2IgZnJvbSBcImxzdXNiZGV2XCI7XG5pbXBvcnQgbHZzIGZyb20gXCJsaW51eC12aWRlby1zdGF0ZVwiO1xuXG5pbXBvcnQgbmV0d29ya3N0YXR1cyBmcm9tIFwibmV0d29ya3N0YXR1c1wiXG5cbmltcG9ydCBkZWJDaGVjayBmcm9tIFwiZGViY2hlY2tcIlxuXG5pbXBvcnQgKiBhcyBsc2Rpc2tzIGZyb20gXCJscy1kaXNrc1wiO1xuXG5jb25zdCBleGVjID0gY2hpbGRfcHJvY2Vzcy5leGVjO1xuXG5cbmludGVyZmFjZSBBdWRpb0NoYW5uZWxBbnN3ZXIge1xuICAgIGRldjogc3RyaW5nO1xuICAgIGFjdGl2ZTogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIEF1ZGlvQW5zd2VyIHtcbiAgICBsYWJlbDogc3RyaW5nO1xuICAgIGRldjogc3RyaW5nO1xuICAgIHB1bHNlbmFtZTogc3RyaW5nO1xuICAgIGFjdGl2ZTogYm9vbGVhbjtcbiAgICBjaGFubmVsczogQXVkaW9DaGFubmVsQW5zd2VyW107XG59XG5cbmludGVyZmFjZSBWaWRlb0NoYW5uZWxBbnN3ZXIge1xuICAgIGRldjogc3RyaW5nO1xuICAgIGxhYmVsOiBzdHJpbmc7XG4gICAgYWN0aXZlOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgVmlkZW9BbnN3ZXIge1xuICAgIGRldjogc3RyaW5nO1xuICAgIGxhYmVsOiBzdHJpbmc7XG4gICAgYWN0aXZlOiBib29sZWFuO1xuICAgIGNoYW5uZWxzOiBWaWRlb0NoYW5uZWxBbnN3ZXJbXTtcbiAgICBtb2RlbF9pZDogc3RyaW5nO1xuICAgIHZlbmRvcl9pZDogc3RyaW5nO1xuICAgIHJlc29sdXRpb246IHN0cmluZztcbiAgICBidXM6IHN0cmluZztcbiAgICBzZXJpYWw6IHN0cmluZztcbn1cblxuXG5pbnRlcmZhY2UgSVNjYW4ge1xuICAgIGVzc2lkOiBzdHJpbmc7XG4gICAgbWFjOiBzdHJpbmc7XG4gICAgc2lnbmFsOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBJTmV0d29yayB7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIG1hYzogc3RyaW5nO1xuICAgIGludGVyZmFjZTogc3RyaW5nO1xuICAgIGVzc2lkPzogc3RyaW5nO1xuICAgIHNjYW4/OiBJU2NhbltdO1xuICAgIGlwPzogc3RyaW5nO1xuICAgIGdhdGV3YXk/OiBzdHJpbmc7XG59XG5cblxuaW50ZXJmYWNlIElOZXRTdGF0dXMge1xuXG4gICAgbmV0d29ya3M6IElOZXR3b3JrW107XG4gICAgbmV0d29yazogSU5ldHdvcms7XG59XG5cblxuXG5pbnRlcmZhY2UgTHN1c2JkZXZBbnN3ZXIge1xuICAgIGRldjogc3RyaW5nO1xuICAgIHR5cGU6IHN0cmluZztcbiAgICBodWI6IHN0cmluZztcbiAgICBwcm9kdWN0OiBzdHJpbmc7XG4gICAgaWQ6IHN0cmluZztcbn1cblxuXG5cblxuaW50ZXJmYWNlIElQYXJ0aXRpb24ge1xuICAgIHBhcnRpdGlvbjogc3RyaW5nO1xuICAgIHNlY3RvcnM6IG51bWJlcjtcbiAgICBzZWN0b3JzX3N0YXJ0OiBudW1iZXI7XG4gICAgc2VjdG9yc19zdG9wOiBudW1iZXI7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIGJvb3Q6IGJvb2xlYW47XG4gICAgc2l6ZTogbnVtYmVyO1xuICAgIGxhYmVsPzogc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBodW1hbnNpemU6IHN0cmluZztcbiAgICB1c2VkOiBzdHJpbmc7XG4gICAgYXZhaWxhYmxlOiBzdHJpbmc7XG4gICAgcGVyY2VudHVzZWQ6IHN0cmluZztcbiAgICBtb3VudGVkOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBJRGlzayB7XG4gICAgZGlzazogc3RyaW5nO1xuICAgIHNlY3RvcnM6IG51bWJlcjtcbiAgICBzaXplOiBudW1iZXI7XG4gICAgcGFydGl0aW9uczogSVBhcnRpdGlvbltdO1xuICAgIGJsb2NrOiBudW1iZXI7XG4gICAgdXNlZF9ibG9ja3M6IG51bWJlcjtcbn1cblxuXG5pbnRlcmZhY2UgQW5zd2VyIHtcbiAgICBib290SWQ6IHN0cmluZztcbiAgICBib290VGltZTogbnVtYmVyO1xuICAgIHVwZGF0ZWRBdDogbnVtYmVyO1xuICAgIHVzYkRldmljZXM6IExzdXNiZGV2QW5zd2VyW107XG4gICAgZHJpdmVzOiBJRGlza1tdO1xuICAgIG5ldHdvcmtzOiBJTmV0d29ya1tdO1xuICAgIG5ldHdvcms6IElOZXR3b3JrO1xuICAgIHZpZGVvOiB7XG4gICAgICAgIGlucHV0czogVmlkZW9BbnN3ZXJbXTtcbiAgICB9O1xuICAgIGF1ZGlvOiB7XG4gICAgICAgIGlucHV0czogQXVkaW9BbnN3ZXJbXTtcbiAgICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzeXNpbmZvKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxBbnN3ZXI+KGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblxuXG4gICAgICAgIGxldCBvYmplY3QgPSA8QW5zd2VyPnt9O1xuICAgICAgICBvYmplY3QudXBkYXRlZEF0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIG9iamVjdC5hdWRpbyA9IDx7IGlucHV0czogQXVkaW9BbnN3ZXJbXSB9PnsgaW5wdXRzOiBbXSB9O1xuICAgICAgICBvYmplY3QudmlkZW8gPSA8eyBpbnB1dHM6IFZpZGVvQW5zd2VyW10gfT57IGlucHV0czogW10gfTtcbiAgICAgICAgbGV0IGNhbGxiYWNrZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IHRpbW8gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2tlZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGltZW91dCBib290SWQgcmVhZCB0aW1lb3V0XCIpO1xuICAgICAgICAgICAgICAgIHJlamVjdChcInRpbWVvdXRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMDAwKTtcblxuXG4gICAgICAgIGV4ZWMoXCJjYXQgL3Byb2Mvc3lzL2tlcm5lbC9yYW5kb20vYm9vdF9pZFwiLCB7IHRpbWVvdXQ6IDkwMDAgfSwgZnVuY3Rpb24gKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgICAgaWYgKGVycm9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltbyk7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RkZXJyICYmIHN0ZGVyciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbW8pO1xuICAgICAgICAgICAgICAgIHJlamVjdChzdGRlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltbyk7XG5cbiAgICAgICAgICAgICAgICBsZXQgY2FsbGJhY2tlZDIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZXQgdGltbzIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjYWxsYmFja2VkMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0aW1lb3V0IGJvb3RUaW1lIHJlYWQgdGltZW91dFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChcInRpbWVvdXRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAxMDAwMCk7XG5cblxuICAgICAgICAgICAgICAgIG9iamVjdC5ib290SWQgPSBzdGRvdXQudG9TdHJpbmcoKS5yZXBsYWNlKFwiXFxuXCIsIFwiXCIpO1xuXG4gICAgICAgICAgICAgICAgZXhlYyhcImNhdCAvcHJvYy9zdGF0IHwgZ3JlcCBidGltZSB8IGF3ayAneyBwcmludCAkMiB9J1wiLCB7IHRpbWVvdXQ6IDkwMDAgfSwgZnVuY3Rpb24gKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tlZDIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbW8yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RkZXJyICYmIHN0ZGVyciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja2VkMiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltbzIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHN0ZGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja2VkMiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltbzIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuYm9vdFRpbWUgPSBwYXJzZUludChzdGRvdXQudG9TdHJpbmcoKSkgKiAxMDAwO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxzdXNiKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC51c2JEZXZpY2VzID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZHJpdmVzID0gbHNkaXNrcy5hbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXR3b3Jrc3RhdHVzKCkudGhlbihmdW5jdGlvbiAoZGF0YTogSU5ldFN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29ya3MgPSBkYXRhLm5ldHdvcmtzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmV0d29yayA9IGRhdGEubmV0d29yaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGViQ2hlY2soJ3Y0bC1jb25mJykudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJDaGVjaygndjRsLXV0aWxzJykudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbHZzKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC52aWRlby5pbnB1dHMgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGViQ2hlY2soJ3B1bHNlYXVkaW8tdXRpbHMnKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmF1ZGlvLmlucHV0cyA9IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGViQ2hlY2soJ3B1bHNlYXVkaW8tdXRpbHMnKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhcygpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmF1ZGlvLmlucHV0cyA9IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYkNoZWNrKCdwdWxzZWF1ZGlvLXV0aWxzJykudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5hdWRpby5pbnB1dHMgPSBkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJDaGVjaygncHVsc2VhdWRpby11dGlscycpLnRoZW4oKGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXMoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuYXVkaW8uaW5wdXRzID0gZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
