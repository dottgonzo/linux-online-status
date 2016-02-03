import los = require("../index");
los().then(function(a) {
    console.log(a);
}).catch(function(err) {
    console.log(err);
});