/* jshint devel:true */
/* jshint -W079 */
/* exported $, Modernizr */

var sayHello = require('./lib/message'),
    $ = require('jquery'),
    Modernizr = require('modernizr');

console.log(Modernizr);
console.log(sayHello('Joe'));
