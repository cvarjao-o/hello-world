
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

//https://raw.githubusercontent.com/cvarjao-o/openshift-templates/ee059829c51ccef02c76d22f6c528f56346b2203/jenkins/jenkins.bc.yaml
//https://raw.githubusercontent.com/cvarjao-o/jenkins-pipeline/15da4cbf3777415f1b6d8bb2b1e8e0d4225075b1/.pipeline/jenkins.bc.json

const buildConfigs=[{
  'filename':'https://raw.githubusercontent.com/cvarjao-o/openshift-templates/0392595c602cac7e4144963a9aba7e9fa8f0df76/jenkins/jenkins.bc.yaml',
  'param':{
    'NAME':'jenkins-hello',
    'SUFFIX':'',
    'VERSION':'build-1.0.0',
    'CONTEXT_DIR':'jenkins/base',
    'BASE_IMAGESTREAMIMAGE':'jenkins-pipeline-basic@sha256:9824f2847aeb882f65451044afc7f6bda32361d13117232e4073b62613cb11a8'
  }
}]

//Process Template(s) and create a single List of resources
oc.process(buildConfigs)
.then(result =>{
  //Apply best practices, validate, and apply standard labels/annotaions
  return oc.prepare(result);
})
.then(result =>{
  return oc.setBasicLabels(result, 'jenkins-hello', 'build', 'pr-1');
})
.then((result)=>{
  //Apply the configurations for creating or updating resources
  return oc.apply(result);
})
.then(result => {
  //Build all BuildConfig that needs to be done
  return oc.startBuilds(result)
})
.then((result)=>{
  //Collect some of the resources (bc,build,istag,isimage + build logs) used or produced during build, and save them to disk
  //Maybe archive/publish somewhere elase
  oc.saveBuildArtifactsToDir(result, './output')
  return result
})