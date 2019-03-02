# hello-world
hello-world

## Setup
```
oc new-project csnr-devops-lab-tools
oc new-project csnr-devops-lab-deploy


oc -n csnr-devops-lab-tools policy add-role-to-group admin 'system:serviceaccounts:csnr-devops-lab-deploy' --rolebinding-name=jenkins

oc -n csnr-devops-lab-tools policy add-role-to-group system:image-puller 'system:serviceaccounts:csnr-devops-lab-deploy' --rolebinding-name=cross-project-pull

cd .pipeline
npm run build -- --pr=0 --dev-mode=true
npm run deploy -- --pr=0 --env=dev


npm run clean -- --pr=0 --env=build
npm run clean -- --pr=0 --env=dev
npm run clean -- --pr=0 --env=test
npm run clean -- --pr=0 --env=pro

```

```
ln -s ~/Documents/GitHub/cvarjao-o/node-oc-cli-wrapper oc-cli-wrapper

```

