'use strict';
const {OpenShiftClientX} = require('pipeline-cli')
const path = require('path');

module.exports = (settings)=>{
  const phases=settings.phases
  const phase=settings.phase

  const oc=new OpenShiftClientX({'namespace':phases[phase].namespace});
  var templateFile = path.resolve(__dirname, '../../openshift/_python36.dc.json')

  var objects = oc.process(oc.toFileUrl(templateFile), {
    'param':{
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
    }
  })

  oc.applyRecommendedLabels(objects, phases[phase].name, phase, `${phases[phase].changeId}`, phases[phase].instance)
  oc.importImageStreams(objects, phases[phase].tag, phases.build.namespace, phases.build.tag)
  oc.applyAndDeploy(objects, phases[phase].instance)

}