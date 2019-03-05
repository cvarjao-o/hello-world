'use strict';
const deploy = require('./lib/deploy.js')
const options= require('pipeline-cli').Util.parseArguments()
const phases = require('./lib/config')

deploy({options:options, phases:phases, phase:options.env})