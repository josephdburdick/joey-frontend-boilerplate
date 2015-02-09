/* jshint devel:true */
/* jshint -W079 */
/* exported $, Modernizr */

var sayHello = require('./lib/message'),
    $ = require('jquery'),
    Modernizr = require('modernizr'), //; //,
    test = require('./lib/test');

console.log(Modernizr);
console.log(sayHello('Joe'));

//$(document).ready(function(){
	test();
//});


