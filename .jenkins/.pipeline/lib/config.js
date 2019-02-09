'use strict';
const options= require('pipeline-cli').Util.parseArguments()
const changeId = options.pr //aka pull-request
const version = '1.1.0'
const NAME = 'jenkins'

const phases = {
  build: {namespace:'csnr-devops-lab-tools' , name: NAME, phase: 'build', changeId:changeId, suffix: `-build-${changeId}`, instance: `${NAME}-build-${changeId}`, version:`${version}-${changeId}`, tag:`${version}-${changeId}`},
    dev: {namespace:'csnr-devops-lab-deploy'   , name: NAME, phase: 'dev'  , changeId:changeId, suffix: `-dev-${changeId}`  , instance: `${NAME}-dev-${changeId}`  , version:`${version}-${changeId}`, tag:`${version}-${changeId}`},
   test: {namespace:'csnr-devops-lab-deploy'  , name: NAME, phase: 'test' , changeId:changeId, suffix: '-test'             , instance: `${NAME}-test`             , version:`${version}-${changeId}`, tag:`${version}`},
   prod: {namespace:'csnr-devops-lab-deploy'  , name: NAME, phase: 'prod' , changeId:changeId, suffix: ''                  , instance: `${NAME}-prod`             , version:`${version}-${changeId}`, tag:`${version}`}
}

module.exports = exports = phases