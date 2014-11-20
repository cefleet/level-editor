module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    handlebars: {
	options : {
		namespace : 'UI.Views',
    processName: function(filePath) {
      var name = filePath.replace(/^.*[\\\/]/, '');
      return name.replace('.hbs','');
    }
	},
    	all: {
        	files: {
            		"public/ui/Views.js": ["public/ui/templates/**/*.hbs"]
        	}
    	}
    },
    jshint: {
	options : {
	    ignores : ['public/ui/Views.js','public/ui/lib/**']
	},
        all: ['public/**/*.js']
    },
    watch: {
       handlebars :{
       		files : ["public/ui/templates/**/*.hbs"],
         	tasks : ['handlebars']
      },
      jshint : {
      		files : ['public/**/*.js'],
		tasks: ['jshint']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-watch');

  //This is to run while developing
};
