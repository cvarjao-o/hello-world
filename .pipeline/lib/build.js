'use strict';
const {OpenShiftClientX} = require('pipeline-cli')
const path = require('path');

module.exports = (settings)=>{
  const phases=settings.phases
  const phase = settings.phase
  const oc=new OpenShiftClientX({'namespace':phases.build.namespace});
  var templateFile = path.resolve(__dirname, '../../openshift/_python36.bc.json')

  var objects = oc.process(oc.toFileUrl(templateFile), {
    'param':{
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'SOURCE_BASE_CONTEXT_DIR':'app-base',
      'SOURCE_CONTEXT_DIR':'app',
      'SOURCE_REPOSITORY_URL':`${oc.git.http_url}`,
      'SOURCE_REPOSITORY_REF':`${oc.git.branch_ref}`
    }
  })

  oc.applyRecommendedLabels(objects, phases[phase].name, phase, phases[phase].changeId, phases[phase].instance)

  oc.applyAndBuild(objects)
}