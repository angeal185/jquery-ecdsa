(function($) {
  function ECDSA(){
    const enc = {
      u82str: function(STR) {
        let str = ''
        for (var i=0; i <  STR.byteLength; i++) {
            str += String.fromCharCode(STR[i])
        }
        return str;
      },
      str2u8: function(string) {
        let arrayBuffer = new ArrayBuffer(string.length * 1);
        let newUint = new Uint8Array(arrayBuffer);
        newUint.forEach((_, i) => {
          newUint[i] = string.charCodeAt(i);
        });
        return newUint;
      },
      a2h: function(byteArray) {
        return Array.prototype.map.call(byteArray, function(byte) {
          return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
      },
      a2b64: function(byteArray) {
        return btoa(enc.u82str(byteArray))
      },
      h2a: function(hexString) {
        let result = [];
        for (var i = 0; i < hexString.length; i += 2) {
          result.push(parseInt(hexString.substr(i, 2), 16));
        }
        return result;
      },
      b642a: function(byteArray) {
        return enc.str2u8(atob(byteArray))
      },
      gen: function(curve, cb){
        window.crypto.subtle.generateKey({name: "ECDSA", namedCurve: 'P-' + curve}, true, ["sign", "verify"])
        .then(function(key){
          let obj = {};
          //public
          window.crypto.subtle.exportKey("jwk", key.publicKey)
          .then(function(kd){
            obj.public = kd

            //private
            window.crypto.subtle.exportKey("jwk", key.privateKey)
              .then(function(kd){
                obj.private = kd;
                  cb(false,obj)
              })
              .catch(function(err){
                cb(err);
              });
          })
          .catch(function(err){
            cb(err);
          });

        })
        .catch(function(err){
            cb(err);
        });
      },
      sign: function(key, data, hash, digest, cb){
        window.crypto.subtle.importKey("jwk",
          key,{
            name: "ECDSA",
            namedCurve: key.crv
          }, true, ["sign"]
        )
        .then(function(i){
          window.crypto.subtle.sign({name: "ECDSA", hash: {name: "SHA-" + hash}}, i, enc.str2u8(data))
          .then(function(signature){
            //console.log(signature)
            let sig = enc.hash(digest, new Uint8Array(signature));
            cb(false,sig);
          })
          .catch(function(err){
              cb(err);
          });
        })
        .catch(function(err){
            cb(err);
        });

      },
      verify: function(key, sig, data, hash, digest, cb){
        window.crypto.subtle.importKey("jwk",
          key,{
            name: "ECDSA",
            namedCurve: key.crv
          }, true, ["verify"]
        ).then(function(i){
          window.crypto.subtle.verify({name: "ECDSA", hash: {name: "SHA-"+ hash}},
              i,
              new Uint8Array(enc.unhash(digest, sig)),
              enc.str2u8(data)
          )
          .then(function(isvalid){
              cb(false, isvalid)
          })
          .catch(function(err){
              cb(err);
          });
        })
        .catch(function(err){
            cb(err);
        });
      },
      hash: function(i,data){
        if(!i){
          return null
        }
        if(typeof i === 'function' || i.toLowerCase() === 'hex'){
          return enc.a2h(data)
        } else if(i.toLowerCase() === 'base64'){
          return enc.a2b64(data)
        } else {
          return data;
        }
      },
      unhash: function(i,data){
        if(!i){
          return null
        }
        if(typeof i === 'function' || i.toLowerCase() === 'hex'){
          return enc.h2a(data)
        } else if(i.toLowerCase() === 'base64'){
          return enc.b642a(data)
        } else {
          return data;
        }
      },
      getData: function(i){
        let data;
        if ($(i).prop('nodeName').toUpperCase() === "INPUT" || "TEXTAREA") {
          data = $(i).val()
        }
        //add text if not textarea/input
        if ($(i).prop('nodeName').toUpperCase() !== "INPUT" || !"TEXTAREA") {
          data = $(i).text()
        }
        return data;
      }
    }

    return enc;
  }
  const ecdsa = new ECDSA();

  $.ecGen = ecdsa.gen;
  $.ecSign = ecdsa.sign;
  $.ecVerify = ecdsa.verify;
  $.fn.ecSign = function(key, hash, digest, cb){
    let data = ecdsa.getData(this);

    ecdsa.sign(key, data, hash, digest, function(err,res){
      if(err){
        cb(err)
        return console.log(err)
      }
      cb(false,res)
    });
  }

  $.fn.ecVerify = function(key, sig, hash, digest, cb){
    let data = ecdsa.getData(this)

    ecdsa.verify(key, sig, data, hash, digest, function(err,res){
      if(err){
        cb(err)
        return console.log(err)
      }
      cb(false,res)
    });
  }

}(jQuery));
