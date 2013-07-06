/* * * * * * * * * *
 *    konami.js    *
 *  Version 0.3.0  *
 *  License:  MIT  *
 * Simon  Waldherr *
 * * * * * * * * * */

/*jslint browser: true, plusplus: true, indent: 2 */
/*global addEventListener */

var konami = {
  init : function (konamicallback) {
    "use strict";
    konami.db.lastkey = false;
    konami.db.string = (localStorage.getItem('konamistring') !== null) ? localStorage.getItem('konamistring') : '';
    konami.db.kcodes = '';
    konami.db[16] = {};
    konami.db[16].status = false;
    konami.db[20] = {};
    konami.db[20].status = false;

    addEventListener("keydown", function (event) {
      if (konami.db[event.keyCode] === undefined) {
        konami.db[parseInt(event.keyCode, 10)] = {};
      }
      konami.db[parseInt(event.keyCode, 10)].status = true;
      konami.db[parseInt(event.keyCode, 10)].last = event.timeStamp;
      if ((konami.db[16].status || konami.db[20].status) && !(konami.db[16].status && konami.db[20].status)) {
        konami.db.uc = true;
      } else {
        konami.db.uc = false;
      }
    });
    addEventListener("keyup", function (event) {
      var key = (konami.db.uc) ? String.fromCharCode(event.keyCode).toUpperCase() : String.fromCharCode(event.keyCode).toLowerCase();
      key = ((event.keyCode > 31) && (event.keyCode < 127) && (event.keyCode !== 91)) ? key : '';
      if (konami.db[event.keyCode] === undefined) {
        konami.db[parseInt(event.keyCode, 10)] = {};
      }

      konami.db[parseInt(event.keyCode, 10)].status = false;
      konami.db[parseInt(event.keyCode, 10)].last = event.timeStamp;

      konami.db.lastkey = event.keyCode;
      if (event.keyCode !== 8) {
        if (!(event.keyCode > 36 && event.keyCode < 41)) {
          konami.db.string = konami.db.string.substr(-42, 42) + key;
        }
        konami.db.kcodes = konami.db.kcodes.substr(-42, 42) + event.keyCode;
      } else {
        konami.db.string = ' ' + konami.db.string.substr(-42, 41) + key;
        konami.db.kcodes = '  ' + konami.db.kcodes.substr(-42, 40) + event.keyCode;
      }
      if (konami.db.kcodes.substr(-20, 20) === '38384040373937396665') {
        //up up down down left right left right B A
        if (typeof konamicallback === 'function') {
          konamicallback();
        }
      }
      if ((konami.db[16].status || konami.db[20].status) && !(konami.db[16].status && konami.db[20].status)) {
        konami.db.uc = true;
      } else {
        konami.db.uc = false;
      }
    });
    addEventListener("beforeunload", function () {
      localStorage.setItem("konamistring", konami.db.string);
    });
  },
  get : function (key) {
    "use strict";
    var keystatus = konami.db[key.toUpperCase().charCodeAt(0)] === undefined ? null : konami.db[key.toUpperCase().charCodeAt(0)].status,
      lastpressd = konami.db[key.toUpperCase().charCodeAt(0)] === undefined ? null : konami.db[key.toUpperCase().charCodeAt(0)].last;

    return [keystatus, lastpressd];
  },
  reg : function (key, callback) {
    "use strict";
    addEventListener("keydown", function (event) {
      var pressedKey = parseInt(event.keyCode, 10),
        keys_status = true,
        i = 0,
        keys;

      if (typeof key === 'string') {
        if (pressedKey === 16) {
          pressedKey = 'shift';
        } else if (pressedKey === 18) {
          pressedKey = 'alt';
        } else if (pressedKey === 91) {
          pressedKey = 'cmd';
        } else if (pressedKey === 17) {
          pressedKey = 'ctrl';
        } else if (pressedKey === 37) {
          pressedKey = 'left';
        } else if (pressedKey === 39) {
          pressedKey = 'right';
        } else if (pressedKey === 38) {
          pressedKey = 'up';
        } else if (pressedKey === 40) {
          pressedKey = 'down';
        } else if (pressedKey === 13) {
          pressedKey = 'return';
        } else if (pressedKey === 8) {
          pressedKey = 'backspace';
        } else {
          pressedKey = (konami.db.uc) ? String.fromCharCode(pressedKey).toUpperCase() : String.fromCharCode(pressedKey).toLowerCase();
        }
      } else {
        for (keys in key) {
          if (typeof key[keys] === 'string') {
            if (key[keys] === 'shift') {
              key[keys] = 16;
            } else if (key[keys] === 'alt') {
              key[keys] = 18;
            } else if (key[keys] === 'cmd') {
              key[keys] = 91;
            } else if (key[keys] === 'ctrl') {
              key[keys] = 17;
            } else if (key[keys] === 'left') {
              key[keys] = 37;
            } else if (key[keys] === 'right') {
              key[keys] = 39;
            } else if (key[keys] === 'up') {
              key[keys] = 38;
            } else if (key[keys] === 'down') {
              key[keys] = 40;
            } else if (key[keys] === 'return') {
              key[keys] = 13;
            } else if (key[keys] === 'backspace') {
              key[keys] = 8;
            } else if (key[keys].length === 1) {
              key[keys] = key[keys].charCodeAt(0);
            }
          }
        }
      }
      if (typeof key === 'string') {
        if (pressedKey === key) {
          callback();
        }
      } else {
        for (i = 0; i < key.length; i++) {
          if (konami.db[key[i]] !== undefined) {
            if (!konami.db[key[i]].status) {
              keys_status = false;
            }
          } else {
            keys_status = false;
          }
        }
        if (keys_status) {
          callback();
        }
      }
    });
  },
  db : {}
};
