'use strict';
const options= require('pipeline-cli').Util.parseArguments()
const changeId = options.pr //aka pull-request
const NAME = 'selenium'

if (options.pr == null){
  throw new Error("Missing --pr argument")
}

const phases = {
    dev: {namespace:'csnr-devops-lab-tools' , name: NAME, phase: 'dev'  , changeId:changeId, suffix: `-dev-${changeId}`  , instance: `${NAME}-dev-${changeId}`},
   prod: {namespace:'csnr-devops-lab-tools' , name: NAME, phase: 'prod' , changeId:changeId, suffix: '-prod'             , instance: `${NAME}-prod`}
}

module.exports = exports = phases