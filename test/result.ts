import * as mocha from "mocha";
import * as chai from "chai";
let assert = chai.assert;
import mod = require("../index");
let verb = require("verbo");
let json;

before("get status info", function (done) {
    this.timeout(15000);

    mod().then(function (data) {
        verb(data, "info", "Status Info");
        json = data;
        done()
    }).catch(function (err) {
        console.log(err)
        done()
    })
});

describe("Status Object", function () {
    describe("check json", function () {

        it("validate ", function () {

            assert.isObject(json, "Status is an object");


        });
        it("validate drives", function () {

            assert.isArray(json.drives, "Status is an object");


        });
    });
});
