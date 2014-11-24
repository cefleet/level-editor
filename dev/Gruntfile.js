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
	       ignores : ['public/ui/Views.js','public/ui/lib/**','public/ui/UI.combined.js']
      },
      all: ['public/**/*.js']
    },

    concat : {
      options : {
        sourceMap :true
      },
      dev : {
        files : {
          'public/ui/UI.combined.js':['public/ui/UI.js','public/ui/Actions.js','public/ui/Actions/*.js','public/ui/Views.js','public/ui/LaunchPad.js','public/ui/Launchers/*.js'],
          'public/editors/MapEditor/MapEditor.combined.js' : ['public/editors/MapEditor/MapEditor.js','public/editors/MapEditor/Map.js','public/editors/MapEditor/componants/*.js']
        }
      }
    },

    watch: {
       handlebars :{
       		files : ["public/ui/templates/**/*.hbs"],
         	tasks : ['handlebars']
      },
      testAndCombine : {
        files : ['public/**/*.js'],
        tasks: ['concat','jshint']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  //This is to run while developing
};
