/* jshint devel:true */

requirejs(['jquery', 'materialize', 'modernizr', 'lodash', 'message'],
function($, materialize, modernizr, lodash, message) {
    console.log('Window width: ' + $(window).width());
    console.log('Message loaded: ' + message);
});
