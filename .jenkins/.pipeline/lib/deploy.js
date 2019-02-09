'use strict';
const {OpenShiftClientX} = require('pipeline-cli')
const path = require('path');
const phases = require('./config')
const options= require('pipeline-cli').Util.parseArguments()

module.exports = (settings)=>{
  const phase=options.env
  const changeId = phases[phase].changeId
  const oc=new OpenShiftClientX({'namespace':phases[phase].namespace});
  var objects = []

  objects = objects.concat(oc.processDeploymentTemplate(oc.toFileUrl(path.resolve(__dirname, '../../openshift/jenkins-dc.json')), {
    'param':{
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix
    }
  }))

  oc.applyRecommendedLabels(objects, phases[phase].name, phase, `${changeId}`, phases[phase].instance)
  oc.importImageStreams(objects, phases[phase].tag, phases.build.namespace, phases.build.tag)
  oc.applyAndDeploy(objects, phases[phase].instance)

}