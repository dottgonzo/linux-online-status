var assert = require('chai').assert;
var mod=require('../index');
var verb=require('verbo');


before('get status info',function() {
  return mod().then(function(data){
verb(data,'info','Status Info')
json=data

  })
});

describe('Status Object', function() {
  describe('check json', function () {

    it('validate ', function(){

        assert.isObject(json, 'Status is an object');


    })
    it('validate drives', function(){

        assert.isArray(json.drives, 'Status is an object');


    })
  });
});
