module.exports = function(grunt) {
  //project configuration
  grunt.initConfig({
    watch: {
      files: 'app/css/*.css',
      tasks: ['css']
    },
    browserSync: {
      dev: {
        bsFiles: {
          src : [
            'app/css/*.css',
            'app/html/*.html'
          ]
        },
        options: {
          watchTask: true,
          server: 'app/html'
        }
      }
    }
  });

  // load npm tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');

  // default
  grunt.registerTask('default', ['browserSync', 'watch']);
}
