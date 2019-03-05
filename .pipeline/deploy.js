'use strict';
const phases = require('./lib/config')
const deploy = require('./lib/deploy')
const options= require('pipeline-cli').Util.parseArguments()

deploy({options:options, phases:phases, phase:options.env})