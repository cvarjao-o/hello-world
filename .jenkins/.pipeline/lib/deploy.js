'use strict';
const {OpenShiftClientX} = require('pipeline-cli')
const path = require('path');

module.exports = (settings)=>{
  const phases=settings.phases
  const options=settings.options
  const phase=options.env
  const changeId = phases[phase].changeId
  const oc=new OpenShiftClientX({'namespace':phases[phase].namespace});
  var objects = []

  const templatesLocalBaseUrl =oc.toFileUrl(path.resolve(__dirname, '../../openshift'))

  objects.push(...oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/deploy.yaml`, {
    'param':{
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'ROUTE_HOST': `${phases[phase].name}${phases[phase].suffix}-${phases[phase].namespace}.pathfinder.gov.bc.ca`
    }
  }))

  objects.push(...oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/deploy-slave.yaml`, {
    'param':{
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'SLAVE_NAME': 'build',
      'SLAVE_LABELS': 'build deploy',
      'SLAVE_EXECUTORS': '3',
      'CPU_REQUEST': '300m',
      'CPU_LIMIT': '500m',
      'MEMORY_REQUEST': '2Gi',
      'MEMORY_LIMIT': '2Gi'
    }
  }))
  
  objects.push(...oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/deploy-slave.yaml`, {
    'param':{
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'SLAVE_NAME': 'test',
      'SLAVE_LABELS': 'test ui-test',
      'SLAVE_EXECUTORS': '1',
      'CPU_REQUEST': '0',
      'CPU_LIMIT': '0',
      'MEMORY_REQUEST': '0',
      'MEMORY_LIMIT': '0'
    }
  }))

  oc.applyRecommendedLabels(objects, phases[phase].name, phase, `${changeId}`, phases[phase].instance)
  oc.importImageStreams(objects, phases[phase].tag, phases.build.namespace, phases.build.tag)
  oc.applyAndDeploy(objects, phases[phase].instance)

}