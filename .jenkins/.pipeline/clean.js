'use strict';
const build = require('./lib/clean.js')
const phases = require('./lib/config')
const options= require('pipeline-cli').Util.parseArguments()

build({phases:phases, options:options})