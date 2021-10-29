const sass = require('node-sass');


module.exports = function(grunt) {

    
    
    grunt.config.set('sass', {
        dev: {
            options:{
              implementation:sass
            },
          files: [{
            expand: true,
            cwd: 'assets/styles/',
            src: ['main.scss'],
            dest: '.tmp/public/styles/',
            ext: '.css'
          }], 
        //  implementation:sass
        }
      });

      grunt.loadNpmTasks('grunt-sass');



}