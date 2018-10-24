
const fs = require('fs');
const cli = require('oc-cli-wrapper')
const oc=cli({'options':{'namespace':'csnr-devops-lab-tools'}});

oc.util.configureLogging({
  appenders: {
    console: { type: 'console' }
  },
  categories: {
    default: { appenders: ['console'], level: 'all' }
  }
});

const buildNamespace = 'csnr-devops-lab-tools'
const buildVersion = 'build-1.0.0'
const deploymentVersion = 'dev-1.0.0'

const deploymentConfigs=[{
  'filename':'https://raw.githubusercontent.com/cvarjao-o/openshift-templates/0392595c602cac7e4144963a9aba7e9fa8f0df76/jenkins/jenkins.dc.yaml',
  'param':{
    'NAME':'jenkins-cvarjao',
    'BC_NAME':'jenkins-hello',
    'SUFFIX':'',
    'VERSION': buildVersion,
    'ROUTE_HOST': 'jenkinns-cvarjao.pathfinder.gov.bc.ca'
  }
}]

//Process Template(s) and create a single List of resources
oc.process(deploymentConfigs)
.then(result =>{
  //Apply best practices, validate, and apply standard labels/annotaions
  return oc.prepare(result);
})
.then(result =>{
  return oc.setBasicLabels(result, 'jenkins-cvarjao', 'prod', 'pr-1');
})
.then(result => {
  return oc.fetchSecretsAndConfigMaps(result)
})
.then(result => {
  return oc.importImageStreams(result, deploymentVersion, buildNamespace, buildVersion).then(result=>{
    return oc.applyAndWait(result);
  })
})