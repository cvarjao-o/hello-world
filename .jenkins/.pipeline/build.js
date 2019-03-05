'use strict';
const phases = require('./lib/config')
const build = require('./lib/build.js')
const options= require('pipeline-cli').Util.parseArguments()

build({phases:phases, options:options})