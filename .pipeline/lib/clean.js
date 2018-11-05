'use strict';
const {OpenShiftClientX} = require('pipeline-cli')

module.exports = (settings)=>{
  const oc=new OpenShiftClientX({'namespace':'csnr-devops-lab-tools'});
  
  //return Promise.all([
  oc.raw('delete', ['all'], {selector:'app-name=hello,env-id=1,env-name!=prod', namespace:'csnr-devops-lab-tools'})
  oc.raw('delete', ['all'], {selector:'app-name=hello,env-id=1,env-name!=prod', namespace:'csnr-devops-lab-deploy'})
  //])
}