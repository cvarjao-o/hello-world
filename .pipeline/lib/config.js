'use strict';
const options= require('pipeline-cli').Util.parseArguments()
const changeId = options.pr //aka pull-request
const version = 'v1'
const NAME = 'hello'

const phases = {
  build: {namespace:`${options['build-namespace'] || 'csnr-devops-lab-tools'}`   , name: NAME, phase: 'build', changeId:changeId, suffix: `-build-${changeId}`, instance: `${NAME}-build-${changeId}` , tag:`build-${version}-${changeId}`},
    dev: {namespace:`${options['dev-namespace']   || 'csnr-devops-lab-deploy'}`  , name: NAME, phase: 'dev'  , changeId:changeId, suffix: `-dev-${changeId}`  , instance: `${NAME}-dev-${changeId}`   , tag:`dev-${version}-${changeId}`},
   test: {namespace:`${options['test-namespace']  || 'csnr-devops-lab-deploy'}`  , name: NAME, phase: 'test' , changeId:changeId, suffix: '-test'             , instance: `${NAME}-test`              , tag:`test-${version}`},
   prod: {namespace:`${options['prod-namespace']  || 'csnr-devops-lab-deploy'}`  , name: NAME, phase: 'prod' , changeId:changeId, suffix: ''                  , instance: `${NAME}-prod`              , tag:`prod-${version}`}
}

module.exports = exports = phases