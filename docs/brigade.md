## Install - Client Side
```
curl -sSL -o /usr/local/bin/brig https://github.com/brigadecore/brigade/releases/download/v1.0.0/brig-darwin-amd64 && chmod +x /usr/local/bin/brig
```

## Install - Server Side
```
helm repo add brigade https://brigadecore.github.io/charts
helm fetch --untar --untardir './brigade' brigade/brigade

(cd ./brigade/brigade && rm -rf ../resources && mkdir -p ../resources && helm template . --debug --name brigade --output-dir '../resources' --set 'brigade-github-app.enabled=true,brigade-github-app.ingress.enabled=false,rbac.enabled=true,brigade-github-app.rbac.enabled=true,brigade-github-app.github.appID=${GITHUB_APP_ID},brigade-github-app.github.key=${GITHUB_APP_KEY}')

oc create -f brigade/resources/ -R --dry-run -o json | jq -s 'del(.[] | .metadata.namespace) | { "apiVersion": "v1", "kind": "Template","objects": .}' | oc create -f - --dry-run -o yaml > brigade/brigade.yaml

oc new-build -D $'FROM brigadecore/brigade-worker:v1.0.0\nRUN chgrp -R 0 /home/src && chmod -R g=u /home/src' --name=brigade-worker --dry-run=true -o yaml > build.yaml

# remove .metadata
# add .parameters

oc process -f brigade/brigade.yaml --param-file=brigade/vars.local "--param=GITHUB_APP_KEY=$(<brigade/cvarjao-bot.private-key.pem)" -l app=brigade | oc create -f -

oc process -f brigade/build.yaml -l app=brigade | oc create -f -

oc delete all -l app=brigade && oc delete -l app=brigade
```

```
#Create Brigade Project
brig -n csnr-devops-lab-tools project create


```
Reference
- https://brigade.sh/
