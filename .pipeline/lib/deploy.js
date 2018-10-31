#!/usr/bin/env node
const cli = require('oc-cli-wrapper')


module.exports = (settings)=>{
  const oc=cli({'options':{'namespace':'csnr-devops-lab-deploy'}});

  oc.util.configureLogging({
    appenders: {
      console: { type: 'console' }
    },
    categories: {
      default: { appenders: ['console'], level: 'info' }
    }
  })
  
  const buildNamespace = 'csnr-devops-lab-tools'
  const buildVersion = '1.0.0'
  const deploymentVersion = 'dev-1.0.0'

  const args2={
    'filename':'openshift/_python36.dc.json',
    'param':{
      'NAME':'hello',
      'SUFFIX':'-dev',
      'VERSION':`${deploymentVersion}`
    }
  }

  return oc.process(args2)
  .then((result) =>{
    return oc.prepare(result)}
  )
  .then((result)=>{
    oc.setBasicLabels(result, 'hello', 'dev', 'pr-1')
    return result;
  })
  .then(result => {
    return oc.fetchSecretsAndConfigMaps(result)
  })
  .then(result => {
    return oc.importImageStreams(result, deploymentVersion, buildNamespace, buildVersion).then(result=>{
      return oc.applyAndWait(result);
    })
  })
  .catch(function(error) {
    console.error(error)
    process.exit(1)
  });
}