const {spawnSync} = require('child_process');

const cli = require('oc-cli-wrapper')
const oc=cli({'options':{'namespace':'csnr-devops-lab-tools'}});
oc.util.configureLogging({
  appenders: {
    console: { type: 'console' }
  },
  categories: {
    default: { appenders: ['console'], level: 'info' }
  }
})

const gitRepositoryURL = spawnSync('git', ['config', '--get', 'remote.origin.url'], {encoding:'utf-8'}).stdout.trim()
var gitBranchRef = `refs/pull/${oc.settings['pr'] || 0}/head`

if (gitBranchRef == 'refs/pull/0/head'){
  gitBranchRef = spawnSync('git', ['name-rev','--name-only','HEAD'], {encoding:'utf-8'}).stdout.trim()
  gitBranchRef = spawnSync('git', ['config', `branch.${gitBranchRef}.merge`], {encoding:'utf-8'}).stdout.trim()
}

const buildConfigs=[{
  'filename':'openshift/_python36.bc.json',
  'param':{
    'NAME':'hello',
    'SUFFIX':'-prod',
    'VERSION':'1.0.0',
    'SOURCE_BASE_CONTEXT_DIR':'app-base',
    'SOURCE_CONTEXT_DIR':'app',
    'SOURCE_REPOSITORY_URL':`${gitRepositoryURL}`,
    'SOURCE_REPOSITORY_REF':`${gitBranchRef}`
  }
}]

//Process Template(s) and create a single List of resources
oc.process(buildConfigs)
.then(result =>{
  //Apply best practices, validate, and apply standard labels/annotaions
  return oc.prepare(result)
})
.then((result)=>{
  oc.setBasicLabels(result, 'hello', 'build', 'pr-1')
  return result;
})
.then((result)=>{
  //Apply the configurations for creating or updating resources
  return oc.apply(result);
})
.then(result => {
  //Build all BuildConfig that needs to be done
  return oc.startBuilds(result)
})
