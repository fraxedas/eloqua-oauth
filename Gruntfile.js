module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            files: ['lib/**/*.js', 'test/**/*.js']
        },
        watch: {
            files: ['lib/**/*.js', 'test/**/*.js'],
            tasks : ['jshint']
        }
    });

    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['watch']);

};