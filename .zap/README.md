```
oc new-app registry.hub.docker.com/owasp/zap2docker-bare:2.7.0


oc new-build -D $'FROM registry.hub.docker.com/owasp/zap2docker-stable:2.7.0\nADD https://raw.githubusercontent.com/RHsyseng/container-rhel-examples/master/starter-arbitrary-uid/bin/uid_entrypoint /usr/local/bin/ \nRUN set-x && chgrp -R 0 /etc/passwd && chmod -R g=u /etc/passwd && chgrp -R 0 /zap && chmod -R g=u /zap' --name=zap


oc run zap --image=docker-registry.default.svc:5000/csnr-devops-lab-tools/zap:latest -it --limits=cpu=1 --rm --restart=Never --command -- uid_entrypoint bash

oc run zap --image=docker-registry.default.svc:5000/csnr-devops-lab-tools/zap:latest -it --limits=cpu=1 --rm --restart=Never --command -- /usr/local/bin/uid_entrypoint bash

fix-permission(){ chgrp -R 0 "$1" && chmod -R g=u "$1"; }

zap-baseline.py -t https://hello1-test-csnr-devops-lab-deploy.pathfinder.gov.bc.ca/

zap-baseline.py -c baseline-scan.conf -t http://$(ifconfig en0 | grep "inet " | cut -d " " -f2):8080 -r baseline-scan-report.html

oc run zap-stable --image=registry.hub.docker.com/owasp/zap2docker-stable:2.7.0 -it --rm --restart=Never --command -- /usr/local/bin/uid_entrypoint bash


zap-cli -v quick-scan --self-contained --spider --start-options '-config api.disabledkey=true' -r https://hello1-test-csnr-devops-lab-deploy.pathfinder.gov.bc.ca
```

# References
 https://www.nearform.com/blog/zed-attack-proxy-in-a-ci-pipeline/
