module.exports = function (grunt) {
  'use strict'

  var buildOptions = require('../config.json')

  grunt.option('buildOptions', buildOptions)

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-extend-config')

  grunt.initConfig({
    clean: {
      builds: [buildOptions.buildsDirectory]
    }
  })

  grunt.loadTasks('./accelerator/tasks')

  grunt.registerTask('default', ['build'])
}
