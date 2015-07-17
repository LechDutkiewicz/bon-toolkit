module.exports = function(grunt) {

	var jsMapFileList = [
	'assets/js/map.js',
	'assets/js/markerclusterer.js'
	];

	// Project configuration.
	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
			'Gruntfile.js',
			'assets/js/custom.js'
			]
		},
		concat: {
			js: {
				src: [jsMapFileList],
				dest: 'assets/js/map.js',
			},
		},
		uglify: {
			dist: {
				files: {
					'assets/js/map.min.js': [jsMapFileList]
				}
			}
		},
		watch: {
			js: {
				files: [jsMapFileList],
				tasks: ['jshint', 'uglify'],
			},
		},
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['uglify', 'watch']);

};