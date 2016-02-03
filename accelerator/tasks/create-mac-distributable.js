module.exports = function (grunt) {
  'use strict'

  grunt.loadNpmTasks('grunt-electron-installer')

  grunt.registerTask('create-mac-distributable', 'Builds a distributable for Mac', function () {
    var buildOptions

    buildOptions = grunt.option('buildOptions')

    grunt.extendConfig({
      'create-mac-installer': {
        x64: {
          appDirectory: 'builds/' + buildOptions.applicationName + '-darwin-x64',
          outputDirectory: buildOptions.releaseDirectory + '/mac/' + buildOptions.applicationName + '-setup',
          authors: buildOptions.authors,
          exe: buildOptions.applicationName + '.dmg'
        }
      }
    })

    if (process.platform !== 'darwin') {
      grunt.log.warn('Skipping creating darwin distributable because the current platform is not win32')
      return
    }

    if (buildOptions.platform === 'all' || buildOptions.platform === 'darwin') {
      grunt.task.run('create-mac-installer:x64')
    }
  })
}
