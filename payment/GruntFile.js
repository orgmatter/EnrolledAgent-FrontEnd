module.exports = function(grunt) {
  grunt.initConfig({
    eslint: {
      files: ['lib/**/*js', 'index.js'],
      tasks: ['eslint'],
      options: {
        configFile: './.eslintrc.js',
        event: ['changed', 'added']
      }
    },
    mochaTest: {
      test: {
        src: ['test/**/*js'],
        options: {
          log: true,
        },
      },
    },
    watch: {
      files: ['lib/**/*js', 'test/**/*.js', 'index.js'],
      tasks: ['eslint', 'mochaTest']
    }
  })

  grunt.loadNpmTasks('grunt-eslint')
  grunt.loadNpmTasks('grunt-mocha-test')
  grunt.loadNpmTasks('grunt-contrib-watch')
}
