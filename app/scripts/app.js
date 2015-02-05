/* jshint devel:true */
/*global define, requirejs, require */
requirejs.config({
	baseUrl: 'scripts/lib',
    paths: {
    	jquery: ['../../bower_components/jquery/dist/jquery.min'],
        materialize: '../../bower_components/materialize/dist/js/materialize.min',
        modernizr: ['../../bower_components/modernizr/modernizr'],
        lodash: ['../../bower_components/lodash/lodash.min']
    },
    shim: {
        'materialize' : ['jquery']
    }
    
});
require(['main']);
