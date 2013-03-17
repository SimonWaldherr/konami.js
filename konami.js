/* * * * * * * * * *
 *    konami.js    *
 *  Version   0.1  *
 *  License:  MIT  *
 * Simon  Waldherr *
 * * * * * * * * * */

var konamidb = {};

var konami = function () {
  
};

var konami_init = function () {
  
  konamidb['lastkey'] = false;
  konamidb['string'] = (localStorage.getItem('konamistring') !== null) ? localStorage.getItem('konamistring') : '';
  konamidb['kcodes']  = '';
  konamidb[16] = {};
  konamidb[16].status = false;
  konamidb[20] = {};
  konamidb[20].status = false;
  
  addEventListener("keydown", function(event) {
    if(typeof(konamidb[event.keyCode]) === 'undefined') {
      konamidb[parseInt(event.keyCode,10)] = {};
    }
    konamidb[parseInt(event.keyCode,10)].status = true;
    konamidb[parseInt(event.keyCode,10)].last = event.timeStamp;
    if( ( konamidb[16].status || konamidb[20].status ) && !( konamidb[16].status && konamidb[20].status ) ) {
      konamidb['uc'] = true;
    } else {
      konamidb['uc'] = false;
    }
  });
  addEventListener("keyup", function(event) {
    var key = (konamidb['uc']) ? String.fromCharCode(event.keyCode).toUpperCase() : String.fromCharCode(event.keyCode).toLowerCase();
    key = ((event.keyCode > 31)&&(event.keyCode < 127)&&(event.keyCode !== 91)) ? key : '';
    if(typeof(konamidb[event.keyCode]) === 'undefined') {
      konamidb[parseInt(event.keyCode,10)] = {};
    }
    
    konamidb[parseInt(event.keyCode,10)].status = false;
    konamidb[parseInt(event.keyCode,10)].last = event.timeStamp;
    
    konamidb['lastkey'] = event.keyCode;
    if(event.keyCode !== 8) {
      konamidb['string'] = konamidb['string'].substr(-42,42) + key;
      konamidb['kcodes'] = konamidb['kcodes'].substr(-42,42) + event.keyCode;
    } else {
      konamidb['string'] = ' '+konamidb['string'].substr(-42,41) + key;
      konamidb['kcodes'] = '  '+konamidb['kcodes'].substr(-42,40) + event.keyCode;
    }
    if(konamidb['kcodes'].substr(-20,20) === '38384040373937396665'){
      console.log('konami');
    }
    if( ( konamidb[16].status || konamidb[20].status ) && !( konamidb[16].status && konamidb[20].status ) ) {
      konamidb['uc'] = true;
    } else {
      konamidb['uc'] = false;
    }
  });
  addEventListener("beforeunload", function(e) {
    localStorage.setItem("konamistring", konamidb['string']);
  });
};

var konami_get = function (key) {
  return [konamidb[key.toUpperCase().charCodeAt(0)].status, konamidb[key.toUpperCase().charCodeAt(0)].last];
}

window.onload = konami_init();
