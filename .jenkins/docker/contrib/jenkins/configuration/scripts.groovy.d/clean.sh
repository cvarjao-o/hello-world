#!/usr/bin/env bash
set -Eeu
#set -o pipefail

NAMESPACES=''
#APP=''
#PR=1
for i in "$@"
do
case $i in
    --namespaces=*)
    NAMESPACES="${i#*=}"
    shift # past argument=value
    ;;
    --pr=*)
    PR="${i#*=}"
    shift # past argument=value
    ;;
    --app=*)
    APP="${i#*=}"
    shift # past argument=value
    ;;
    *)
    # unknown option
    ;;
esac
done


IFS=","
for NAMESPACE in $NAMESPACES; do
  SELECTOR="env-id=pr-${PR},app-name=${APP},env-name!=prod,env-name!=test"
  #echo "SELECTOR:${SELECTOR}"

  # Delete tags produced by buildConfig
  oc -n $NAMESPACE get bc -l "$SELECTOR" -o json | jq -cMr '.items[].spec.output.to | select (. != null) | .name' | sort | uniq | xargs -t -I {} oc -n $NAMESPACE tag '{}' -d

  #Delete tags used by DeploymentConfig
  oc -n $NAMESPACE get dc -l "$SELECTOR" -o json | jq -cMr '.items[].spec.triggers[] | select(.type == "ImageChange") | .imageChangeParams.from.name' | sort | uniq | xargs -t -I {} oc -n $NAMESPACE tag '{}' -d

  set -x
  oc -n $NAMESPACE delete all -l "$SELECTOR"
  oc -n $NAMESPACE delete 'PersistentVolumeClaim,Secret,ConfigMap,RoleBinding' -l "$SELECTOR"
  { set +x; } 2>/dev/null
done
unset IFS
