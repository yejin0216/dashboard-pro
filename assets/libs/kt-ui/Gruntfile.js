module.exports = function(grunt) {
	
	grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-recess');

  grunt.initConfig({
  	pkg: grunt.file.readJSON('package.json'),
  	connect:{
	  	devserver:{
	  		options:{
	  			port: 8000,
	  			hostname : '0.0.0.0',
	  			base : '.',
	  			keepalive: true
	  		}
	  	}
  	},
    jshint: {
      options: {
        multistr: true,
        smarttabs: true,
        ignores: ['src/directives/table/table.js','src/libs/*.js']
      },
      files: ['src/**/*.js']
    },
	  watch: {
      files: ['src/**/*.js','less/**/*.less'],
      tasks: ['jshint','recess','copy','uglify'],
      livereload: {
        options: {
          livereload: true
        },
        files: ['src/**/*.js', 'doc/contents/api/*'],
        tasks: ['uglify']
      }
    },
    recess: {
      options: {
        compile: true
      },
      kt3m: {
        src: ['less/kt3m-ui.less'],
        dest: 'build/css/<%= pkg.name %>.css'
      },
      "kt3m-black": {
        src: ['less/kt3m-ui-black.less'],
        dest: 'build/css/<%= pkg.name %>-black.css'
      },
      "kt3m-white": {
        src: ['less/kt3m-ui-white.less'],
        dest: 'build/css/<%= pkg.name %>-white.css'
      },
      "kt3m-admin": {
        src: ['less/kt3m-ui-admin.less'],
        dest: 'build/css/<%= pkg.name %>-admin.css'
      },
      "kt3m-portal": {
        src: ['less/kt3m-ui-portal.less'],
        dest: 'build/css/<%= pkg.name %>-portal.css'
      },
      "kt3m-event": {
        src: ['less/kt3m-ui-event.less'],
        dest: 'build/css/<%= pkg.name %>-event.css'
      },
      min: {
        options: {
          compress: true
        },
        src: ['less/kt3m-ui.less'],
        dest: 'build/css/<%= pkg.name %>.min.css'
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, src: ['images/**'], dest: 'build/'}
        ]
      }
    },
		uglify: {
      min : {
        options: {
        	wrap : 'ktUi',
          mangle : false,
          compress : false,
          beautify : true,
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          'build/<%= pkg.name %>.js' : [
          'src/libs/*.js',
          'src/module.js',
          'src/services/*.js',
          'src/services/**/*.js',
          'src/filters/*.js',
          'src/directives/**/*.js'
          ]
        }
      },
      concat : {
        options: {
          wrap : 'ktUi',
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          'build/<%= pkg.name %>.min.js' : ['src/libs/*.js',
            'src/module.js',
            'src/services/*.js',
            'src/services/translate/translate.js',
            'src/services/translate/default-interpolation.js',
            'src/services/translate/storage-key.js',
            'src/services/translate/messageformat-interpolation.js',
            'src/services/translate/handler-log.js',
            'src/services/translate/loader-partial.js',
            'src/services/translate/loader-static-files.js',
            'src/services/translate/loader-url.js',
            'src/services/translate/storage-cookie.js',
            'src/services/translate/storage-local.js',
            'src/filters/*.js',
            'src/directives/**/*.js']
        }
      }
    }
  });

  grunt.registerTask('webserver',['connect:devserver'])
  grunt.registerTask('build',['jshint','recess','copy','uglify'])
  grunt.registerTask('default',['build','webserver', 'watch'])
};