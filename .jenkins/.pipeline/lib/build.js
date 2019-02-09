'use strict';
const {OpenShiftClientX} = require('pipeline-cli')
const path = require('path');
const phases = require('./config')

module.exports = (settings)=>{
  const oc=new OpenShiftClientX({'namespace':phases.build.namespace});
  const phase='build'
  var objects = []

  objects = objects.concat(oc.processDeploymentTemplate(oc.toFileUrl(path.resolve(__dirname, '../../openshift/jenkins-bc.json')), {
    'param':{
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'SOURCE_REPOSITORY_URL': oc.git.http_url,
      'SOURCE_REPOSITORY_REF': oc.git.ref
    }
  }))

  oc.applyRecommendedLabels(objects, phases[phase].name, phase, phases[phase].changeId, phases[phase].instance)
  oc.applyAndBuild(objects)
}