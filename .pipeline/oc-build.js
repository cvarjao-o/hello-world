var log4js = require('log4js');
log4js.configure({
  appenders: {
    console: { type: 'console' }
  },
  categories: {
    default: { appenders: ['console'], level: 'trace' }
  }
});

const cli = require('oc-cli-wrapper')

const parameters= process.argv;//.slice(2)
for (let j = 0; j < parameters.length; j++) {  
  console.log(j + ' -> ' + (parameters[j]));
}

//process.exit(0)

const oc=cli({'options':{'namespace':'csnr-devops-lab-tools'}, 'cwd':'/Users/cvarjao/Documents/GitHub/cvarjao-o/hello-world'});

const buildConfigs=[{
  'filename':'.pipeline/_python36.bc.json',
  'param':[
    'NAME=hello',
    'SUFFIX=-prod',
    'VERSION=1.0.0',
    'SOURCE_BASE_CONTEXT_DIR=app-base',
    'SOURCE_CONTEXT_DIR=app',
    'SOURCE_REPOSITORY_URL=https://github.com/cvarjao-o/hello-world.git',
    'SOURCE_REPOSITORY_REF=master'
  ]
}]

oc.process(buildConfigs)
.then(result =>{
  return oc.prepare(result)}
)
.then((result)=>{
  return oc.apply({'filename':result, 'dry-run':'true'});
})
.then((result)=>{
  console.dir(result.length)
})
