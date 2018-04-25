"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
let assert = chai.assert;
const index_1 = require("../index");
let verb = require("verbo");
let json;
before("get status info", function (done) {
    this.timeout(15000);
    index_1.sysinfo().then(function (data) {
        verb(data, "info", "Status Info");
        json = data;
        done();
    }).catch(function (err) {
        console.log(err);
        done();
    });
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
