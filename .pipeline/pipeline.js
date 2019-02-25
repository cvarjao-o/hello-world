'use strict';
const {Pipeline:Pipeline, PipelineStage:Stage, PipelineGate:Gate} = require('pipeline-cli')
const stage = Stage.create
const pipeline = function (stages){
  new Pipeline(stages).run()
}

const defaultStep=(ctx, resolve, reject) =>{
  console.log(`Running '${ctx._path}'`)
  resolve(true)
}

const defaultGate=(input, ctx, resolve, reject) =>{
  if (input!=null){
    console.log(`Running '${ctx._path}'`)
    resolve(true)
  }else{
    resolve(undefined)
  }
}

pipeline(
  new Stage("build", async (ctx, resolve, reject)=>{
    await require('./lib/build.js')()
    resolve(true)
  })
  .then("qa", defaultStep)
  .then("test", [
    stage("functional", defaultStep).then("system", defaultStep),
    stage("security", defaultStep)
  ])
  .gate('approve-to-dev', defaultGate,{
    description:'',
    actions:[
      {id:'dev:approve', label:'Approve', description:'Approve deployment to DEV'}
    ]
  })
  .then("deploy-dev", async (ctx, resolve, reject)=>{
    await require('./lib/deploy.js')()
    resolve(true)
  })
  .gate('approve-to-test', defaultGate,{
    description:'',
    actions:[
      {id:'test:approve', label:'Approve', description:'Approve deployment to TEST'}
    ]
  })
  .then("deploy-test", defaultStep)
  .gate('approve-to-prod', defaultGate,{
    description:'',
    actions:[
      {id:'prod:approve', label:'Approve', description:'Approve deployment to PRODUCTION'}
    ]
  })
  .then("deploy-prod", defaultStep)
  .gate('final-approval', defaultGate,{
    description:'',
    actions:[
      {id:'acceptance:approve', label:'Approve', description:'Final deployment/release approval'}
    ]
  })
  .then("clean", async (ctx, resolve, reject)=>{
    await require('./lib/clean.js')()
    resolve(true)
  })
)
