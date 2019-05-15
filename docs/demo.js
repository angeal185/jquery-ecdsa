
//demo
$('body').append('<div class="container-fluid"><h1 class="text-center mt-4 mb-4">ECDSA</h1><div class="row main"></div></div>')

$.each(['curve','hash'], function(i,e){
  $('.main').append('<div class="col-sm-6 text-center mb-4"><label>select '+ e +'</label><select id="'+ e +'Key" class="custom-select"></select></div>')
})

$.each(['256','384','521'], function(i,e){
  $('#curveKey').append('<option value="'+ e +'">P-'+ e +'</option>')
})

$.each(['256','384','512'], function(i,e){
  $('#hashKey').append('<option value="'+ e +'">SHA-'+ e +'</option>')
})



$.each(['public','private'], function(i,e){
  $('.main').append('<div class="col-sm-6 text-center"><label>'+ e +' key</label><textarea id="'+ e +'Key" class="form-control keyOut"></textarea></div>')
})

$.each(['data','sign','verify'], function(i,e){
  $('.main').append('<div class="col-sm-4 text-center mb-4"><label>'+ e +'</label><input id="'+ e +'Key" class="form-control"></div>')
})


$.each(['test'], function(i,e){
  $('.main').append('<div class="col-sm-6 text-center"><label>'+ e +' key</label><textarea id="'+ e +'Key" class="form-control keyOut"></textarea></div>')
})

$('#hashKey').off().on('change', function(){
  $('#dataKey').keyup();
});

$(document).ready(function() {
  $.each(['public','private','sign','verify'], function(i,e){
    $('#'+ e +'Key').attr('readonly','true')
  })
  $('#signKey,#verifyKey').attr('readonly','true')
  $('#curveKey').on('change', function(){
    let crv = $(this).val()

    $.ecGen(crv, function(err, gen){
      if(err){return console.log(err)}
      $.each({'public': gen.public,'private': gen.private}, function(i,e){
        $('#'+i+ 'Key').text(JSON.stringify(e,0,2))
      })
      //console.log(gen)
      $('#dataKey').off().on('keyup', function(){

        let str = $(this).val(),
        hashVal = $('#hashKey').val();
        $.ecSign(gen.private, str, hashVal, 'hex', function(err, res){
          if(err){return console.log(err)}
          $('#signKey').val(res);
          $.ecVerify(gen.public, res, str, hashVal, 'hex', function(err, res){
            if(err){return console.log(err)}
            if(res){
              $('#verifyKey').val('ecdsa test pass');
              return
            }
            $('#verifyKey').val('ecdsa test fail');
            return
          })
        })
      })
    })
   });

  $('#curveKey').change();





  const ss = {
    get: function(){
      return JSON.parse(sessionStorage.getItem('time'));
    },
    set: function(i){
      sessionStorage.setItem('time', JSON.stringify(i));
      return
    }
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }



  function test(crv,hash,digest, msg){
    let time = Date.now();

    $.ecGen(crv, function(err, gen){
      $('#sig').ecSign(gen.private, hash, digest, function(err, res1){
        if(err){return console.log(err)}
        $('#sigRes').append(res1 + '\n')
      })
    })

    $.ecGen(crv, function(err, gen){
      if(err){return console.log(err)}

      //console.log(gen)
      $.ecSign(gen.private, 'test', hash, digest, function(err, res){
        if(err){return console.log(err)}
        //console.log(res)
        $.ecVerify(gen.public, res, 'test', hash, digest, function(err, res){
          if(err){return console.log(err)}
          if(res){
            document.body.innerHTML += 'ecdsa '+ msg +' pass <br>';
            console.log('ecdsa '+ msg +' pass')
            ss.set(ss.get()+1)
            if(ss.get() === 15){
              document.body.innerHTML += 'Test finished in '+ (Date.now() - time) +'ms';
            }
            return;
          }
          console.log('ecdsa '+ msg +' fail')
          document.body.innerHTML += 'ecdsa '+ msg +' fail <br>'
          return ss.set(ss.get()+1)
        })
      })
    })
  }


  ss.set(0)
  let CRV = shuffle(['256','384','521']),
  HASH = shuffle(['256','384','512']),
  DIGEST = shuffle(['hex','base64','Uint8Array']);

  try {
    for (let x = 0; x < 5; x++) {
      for (let i = 0; i < CRV.length; i++) {
        let arr = ['curve ' + CRV[i], 'hash ' + HASH[i], 'digest ' + DIGEST[i]],
        msg = arr.join(', ');
        test(CRV[i], HASH[i], DIGEST[i], msg + ' test ' + (x + 1) +' round ' + (i + 1))
      }
    }

  } catch (err) {
    if(err){
      console.log(err)
    }
  }

});
