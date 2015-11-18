var netw=require('netw'),
las=require('linux-audio-state'),
getIP = require('external-ip')(),
Promise=require('promise'),
diskinfo = require('diskinfo'),
exec=require('exec-sync');
lsusb=require('lsusbdev'),
lvs=require('linux-video-state');

module.exports=function(){
  return new Promise(function (resolve, reject) {

  var j={bootId:exec('cat /proc/sys/kernel/random/boot_id')};

    lsusb().then(function(data){
      j.usbDevices=data

    diskinfo.getDrives(function(err, aDrives) {
j.drives=aDrives;

  netw.pure().then(function(data){
    j.networking=data
    if(data.network){
      getIP(function (err, ip) {
        if (err) {
          resolve(err);

            // every service in the list has failed
            throw err;
        } else{
          j.networking.network.externalIp=ip;
          las.pure().then(function(data){
            j.audio=data.audioInputs;
            lvs.pure().then(function(data){
              j.video=data.videoInputs;
            resolve(j);
          }).catch(function(err){
            reject(err)
          })



          }).catch(function(err){
            reject(err)
          })
        }



    })
  } else{
    las.pure().then(function(data){
      j.audio=data.audioInputs;
      lvs.pure().then(function(data){
        j.video=data.videoInputs;
      resolve(j);
    }).catch(function(err){
      reject(err)
    })



    }).catch(function(err){
      reject(err)
    })
  }

  });

          })

    })
})

}
