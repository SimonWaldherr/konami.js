# * * * * * * * * * *
# *    konami.js    *
# *  Version 0.2.3  *
# *  License:  MIT  *
# * Simon  Waldherr *
# * * * * * * * * * *

#jslint browser: true, plusplus: true, indent: 2 

#global addEventListener, console 
konamidb = {}
konami_init = ->
  konamidb.lastkey = false
  konamidb.string = (if (localStorage.getItem("konamistring") isnt null) then localStorage.getItem("konamistring") else "")
  konamidb.kcodes = ""
  konamidb[16] = {}
  konamidb[16].status = false
  konamidb[20] = {}
  konamidb[20].status = false
  addEventListener "keydown", (event) ->
    konamidb[parseInt(event.keyCode, 10)] = {}  if konamidb[event.keyCode] is `undefined`
    konamidb[parseInt(event.keyCode, 10)].status = true
    konamidb[parseInt(event.keyCode, 10)].last = event.timeStamp
    if (konamidb[16].status or konamidb[20].status) and not (konamidb[16].status and konamidb[20].status)
      konamidb.uc = true
    else
      konamidb.uc = false

  addEventListener "keyup", (event) ->
    key = (if (konamidb.uc) then String.fromCharCode(event.keyCode).toUpperCase() else String.fromCharCode(event.keyCode).toLowerCase())
    key = (if ((event.keyCode > 31) and (event.keyCode < 127) and (event.keyCode isnt 91)) then key else "")
    konamidb[parseInt(event.keyCode, 10)] = {}  if konamidb[event.keyCode] is `undefined`
    konamidb[parseInt(event.keyCode, 10)].status = false
    konamidb[parseInt(event.keyCode, 10)].last = event.timeStamp
    konamidb.lastkey = event.keyCode
    if event.keyCode isnt 8
      konamidb.string = konamidb.string.substr(-42, 42) + key
      konamidb.kcodes = konamidb.kcodes.substr(-42, 42) + event.keyCode
    else
      konamidb.string = " " + konamidb.string.substr(-42, 41) + key
      konamidb.kcodes = "  " + konamidb.kcodes.substr(-42, 40) + event.keyCode
    console.log "konami"  if konamidb.kcodes.substr(-20, 20) is "38384040373937396665"
    if (konamidb[16].status or konamidb[20].status) and not (konamidb[16].status and konamidb[20].status)
      konamidb.uc = true
    else
      konamidb.uc = false

  addEventListener "beforeunload", ->
    localStorage.setItem "konamistring", konamidb.string


konami_get = (key) ->
  [konamidb[key.toUpperCase().charCodeAt(0)].status, konamidb[key.toUpperCase().charCodeAt(0)].last]

konami_reg = (key, callback) ->
  addEventListener "keydown", (event) ->
    pressedKey = parseInt(event.keyCode, 10)
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
      pressedKey = (if (konamidb.uc) then String.fromCharCode(pressedKey).toUpperCase() else String.fromCharCode(pressedKey).toLowerCase())
    callback()  if pressedKey is key


window.onload = konami_init()
