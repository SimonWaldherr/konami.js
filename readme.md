#konami.js


konami.js logs every keypress and store it for later

##about

License:   MIT  
Version: 0.2.1  
Date:   5.2013  

##demo

Test this code on [simonwaldherr.github.com/konami.js](http://simonwaldherr.github.com/konami.js/).

##howto

The number of the last pressed key is stored in ```konamidb['lastkey']```, to get the associated Char use ```String.fromCharCode(konamidb['lastkey'])```. To get the status of a key, use ```konamidb['65'].status``` or ```konamidb['a'.charCodeAt(0)].status```.  
Take a look at the index.html to see which informations are stored and how.

##contact

Feel free to contact me via [eMail](mailto:contact@simonwaldherr.de), [App.net](http://simon.waldherr.eu/adn) or on [Twitter](http://simon.waldherr.eu/t). This software will be continually developed. Suggestions and tips are always welcome.