module.exports = function(grunt) {
  //project configuration
  grunt.initConfig({
    browserSync: {
      dev: {
        bsFiles: {
          src : [
            'app/css/**.css',
            'app/**.html',
            'app/js/**.js'
          ]
        },
        options: {
          server: 'app'
        }
      }
    }
  });

  // load npm tasks
  grunt.loadNpmTasks('grunt-browser-sync')
  // default
  grunt.registerTask('default', ['browserSync']);
}
