# jquery-ecdsa
ecdsa jquery plugin for the browser using the webcrypto api

Demo: https://angeal185.github.io/jquery-ecdsa

### Installation

npm

```sh
$ npm install jquery-ecdsa --save
```

bower

```sh
$ bower install jquery-ecdsa
```

git
```sh
$ git clone git@github.com:angeal185/jquery-ecdsa.git
```

#### browser

```html
<script src="./dist/jq-ecdsa.min.js"></script>
```

#### API

```javascript

/**
 *  generate ecdsa keypair
 *  @param {string} curve ~ '256'/'384'/'521'
 *  @param {function} cb ~ callback function(err,res)
 **/

$.ecGen(curve, cb)


/**
 *  create signature
 *  @param {string} key ~ valid jwk
 *  @param {string} data ~ data to be signed
 *  @param {string} hash ~ '128'/'256'/'512'
 *  @param {string} digest ~ 'hex'/'base64'/'Uint8'
 *  @param {function} cb ~ callback function(err,res)
 **/

$.ecSign(key, data, hash, digest, cb)


/**
 *  verify signature
 *  @param {string} key ~ valid jwk
 *  @param {string} sig ~ valid signature
 *  @param {string} data ~ data to verify
 *  @param {string} hash ~ '128'/'256'/'512'
 *  @param {string} digest ~ 'hex'/'base64'/'Uint8'
 *  @param {function} cb ~ callback function(err,res)
 **/

$.ecVerify(key, sig, data, hash, digest, cb)

/**
 *  create signature
 *  @param {string} ele ~ location of data to sign
 *  @param {string} key ~ valid jwk
 *  @param {string} hash ~ '128'/'256'/'512'
 *  @param {string} digest ~ 'hex'/'base64'/'Uint8'
 *  @param {function} cb ~ callback function(err,res)
 **/

$(ele).ecSign(key, hash, digest, cb)


/**
 *  verify signature
 *  @param {string} ele ~ location of data to verify
 *  @param {string} key ~ valid jwk
 *  @param {string} sig ~ valid signature
 *  @param {string} hash ~ '128'/'256'/'512'
 *  @param {string} digest ~ 'hex'/'base64'/'Uint8'
 *  @param {function} cb ~ callback function(err,res)
 **/

$(ele).ecVerify(key, sig, hash, digest, cb)



//demo

const config = {
  curve: '521', // P-521
  hash: '512', // SHA-512
  degest: 'hex', // hexadecimal
  data: 'test'
}

//generate p-521 ecdsa keypair
$.ecGen(config.curve, function(err, gen){
  if(err){return console.log(err)}
  console.log(gen)

  //sign some data
  $.ecSign(gen.private, config.data, config.hash, config.digest, function(err, sig){
    if(err){return console.log(err)}
    console.log(res)

    //verify signature
    $.ecVerify(gen.public, sig, config.data, config.hash, config.digest, function(err, res){
      if(err){return console.log(err)}
      if(res){
        return console.log('ecdsa test pass')
      }
      return console.log('ecdsa test fail')
    })
  })


  //sign some data
  $('#data-to-sign').ecSign(gen.private, config.hash, config.digest, function(err, sig){
    if(err){return console.log(err)}
    console.log(res)

    //verify signature
    $('.data-to-verify').ecVerify(gen.public, sig, config.hash, config.digest, function(err, res){
      if(err){return console.log(err)}
      if(res){
        return console.log('ecdsa test pass')
      }
      return console.log('ecdsa test fail')
    })
  })


})




```
