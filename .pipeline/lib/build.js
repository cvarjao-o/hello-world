'use strict';
const {OpenShiftClientX} = require('pipeline-cli')
const path = require('path');

module.exports = (settings)=>{
  const phases=settings.phases
  const phase = settings.phase
  const oc=new OpenShiftClientX({'namespace':phases.build.namespace});
  
  var templateBaseUrl = oc.toFileUrl(path.resolve(__dirname, '../../openshift'))

  var objects = oc.process(`${templateBaseUrl}/python-build2.yaml`, {
    'param':{
      'NAME': `${phases[phase].name}1`,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'SOURCE_BASE_CONTEXT_DIR':'app-base',
      'SOURCE_CONTEXT_DIR':'app',
      'SOURCE_REPOSITORY_URL':oc.git.http_url,
      'SOURCE_REPOSITORY_REF':oc.git.branch_ref
    }
  })

  objects.push(...oc.process(`${templateBaseUrl}/python-build.yaml`, {
    'param':{
      'NAME': `${phases[phase].name}2`,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'GIT_DIR':'hello',
      'GIT_URL': oc.git.http_url,
      'GIT_REF': oc.git.branch_ref
    }
  }))

  oc.applyRecommendedLabels(objects, phases[phase].name, phase, phases[phase].changeId, phases[phase].instance)

  oc.applyAndBuild(objects)
}