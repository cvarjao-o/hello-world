'use strict';
const {spawnSync} = require('child_process');
const cli = require('oc-cli-wrapper')

module.exports = (settings)=>{
  const oc=cli({'options':{'namespace':'csnr-devops-lab-tools'}});
  
  return Promise.all([
    oc._ocSpawnAndWait('delete', {resource:'all', selector:'app-name=hello,env-id=pr-1,env-name!=prod', namespace:'csnr-devops-lab-tools'}),
    oc._ocSpawnAndWait('delete', {resource:'all', selector:'app-name=hello,env-id=pr-1,env-name!=prod', namespace:'csnr-devops-lab-deploy'})
  ])
}