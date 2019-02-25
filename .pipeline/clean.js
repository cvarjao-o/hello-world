'use strict';
const phases = require('./lib/config')
const clean = require('./lib/clean')
const options= require('pipeline-cli').Util.parseArguments()

clean({options:options, phases:phases, phase:options.env})