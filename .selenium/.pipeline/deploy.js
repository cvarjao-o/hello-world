'use strict';
const phases = require('./lib/config')
const deploy = require('./lib/deploy.js')

deploy({phases:phases})