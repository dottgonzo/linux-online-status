import {sysinfo} from "../index";
sysinfo().then(function(a) {
    console.log(a);
}).catch(function(err) {
    console.log(err);
});