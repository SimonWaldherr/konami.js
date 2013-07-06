# * * * * * * * * * *
# *    konami.js    *
# *  Version 0.3.0  *
# *  License:  MIT  *
# * Simon  Waldherr *
# * * * * * * * * * *

konami =
  init: (konamicallback) ->
    "use strict"
    konami.db.lastkey = false
    konami.db.string = (if (localStorage.getItem("konamistring") isnt null) then localStorage.getItem("konamistring") else "")
    konami.db.kcodes = ""
    konami.db[16] = {}
    konami.db[16].status = false
    konami.db[20] = {}
    konami.db[20].status = false
    addEventListener "keydown", (event) ->
      konami.db[parseInt(event.keyCode, 10)] = {}  if konami.db[event.keyCode] is `undefined`
      konami.db[parseInt(event.keyCode, 10)].status = true
      konami.db[parseInt(event.keyCode, 10)].last = event.timeStamp
      if (konami.db[16].status or konami.db[20].status) and not (konami.db[16].status and konami.db[20].status)
        konami.db.uc = true
      else
        konami.db.uc = false

    addEventListener "keyup", (event) ->
      key = (if (konami.db.uc) then String.fromCharCode(event.keyCode).toUpperCase() else String.fromCharCode(event.keyCode).toLowerCase())
      key = (if ((event.keyCode > 31) and (event.keyCode < 127) and (event.keyCode isnt 91)) then key else "")
      konami.db[parseInt(event.keyCode, 10)] = {}  if konami.db[event.keyCode] is `undefined`
      konami.db[parseInt(event.keyCode, 10)].status = false
      konami.db[parseInt(event.keyCode, 10)].last = event.timeStamp
      konami.db.lastkey = event.keyCode
      if event.keyCode isnt 8
        konami.db.string = konami.db.string.substr(-42, 42) + key  unless event.keyCode > 36 and event.keyCode < 41
        konami.db.kcodes = konami.db.kcodes.substr(-42, 42) + event.keyCode
      else
        konami.db.string = " " + konami.db.string.substr(-42, 41) + key
        konami.db.kcodes = "  " + konami.db.kcodes.substr(-42, 40) + event.keyCode

      #up up down down left right left right B A
      konamicallback()  if typeof konamicallback is "function"  if konami.db.kcodes.substr(-20, 20) is "38384040373937396665"
      if (konami.db[16].status or konami.db[20].status) and not (konami.db[16].status and konami.db[20].status)
        konami.db.uc = true
      else
        konami.db.uc = false

    addEventListener "beforeunload", ->
      localStorage.setItem "konamistring", konami.db.string


  get: (key) ->
    "use strict"
    keystatus = (if konami.db[key.toUpperCase().charCodeAt(0)] is `undefined` then null else konami.db[key.toUpperCase().charCodeAt(0)].status)
    lastpressd = (if konami.db[key.toUpperCase().charCodeAt(0)] is `undefined` then null else konami.db[key.toUpperCase().charCodeAt(0)].last)
    [keystatus, lastpressd]

  reg: (key, callback) ->
    "use strict"
    addEventListener "keydown", (event) ->
      pressedKey = parseInt(event.keyCode, 10)
      keys_status = true
      i = 0
      keys = undefined
      if typeof key is "string"
        if pressedKey is 16
          pressedKey = "shift"
        else if pressedKey is 18
          pressedKey = "alt"
        else if pressedKey is 91
          pressedKey = "cmd"
        else if pressedKey is 17
          pressedKey = "ctrl"
        else if pressedKey is 37
          pressedKey = "left"
        else if pressedKey is 39
          pressedKey = "right"
        else if pressedKey is 38
          pressedKey = "up"
        else if pressedKey is 40
          pressedKey = "down"
        else if pressedKey is 13
          pressedKey = "return"
        else if pressedKey is 8
          pressedKey = "backspace"
        else
          pressedKey = (if (konami.db.uc) then String.fromCharCode(pressedKey).toUpperCase() else String.fromCharCode(pressedKey).toLowerCase())
      else
        for keys of key
          if typeof key[keys] is "string"
            if key[keys] is "shift"
              key[keys] = 16
            else if key[keys] is "alt"
              key[keys] = 18
            else if key[keys] is "cmd"
              key[keys] = 91
            else if key[keys] is "ctrl"
              key[keys] = 17
            else if key[keys] is "left"
              key[keys] = 37
            else if key[keys] is "right"
              key[keys] = 39
            else if key[keys] is "up"
              key[keys] = 38
            else if key[keys] is "down"
              key[keys] = 40
            else if key[keys] is "return"
              key[keys] = 13
            else if key[keys] is "backspace"
              key[keys] = 8
            else key[keys] = key[keys].charCodeAt(0)  if key[keys].length is 1
      if typeof key is "string"
        callback()  if pressedKey is key
      else
        i = 0
        while i < key.length
          if konami.db[key[i]] isnt `undefined`
            keys_status = false  unless konami.db[key[i]].status
          else
            keys_status = false
          i++
        callback()  if keys_status


  db: {}
