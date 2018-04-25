#!/usr/bin/env node

var serverinfo=require("../index");

serverinfo.sysinfo().then(function(a) {
    console.log(a);
}).catch(function(err) {
    console.log(err);
});