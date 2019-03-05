## How to create build and deploy configurations
```
oc new-build registry.access.redhat.com/rhscl/python-36-rhel7:1~https://github.com/cvarjao-o/hello-world --strategy=source --dry-run -o yaml '--name=${NAME}${SUFFIX}' '--context-dir=${GIT_DIR}'

oc new-app registry.access.redhat.com/rhscl/python-36-rhel7:1 --dry-run -o yaml '--name=${NAME}${SUFFIX}'

```
