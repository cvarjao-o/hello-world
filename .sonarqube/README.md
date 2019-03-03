registry.hub.docker.com
7.6-community


oc new-app registry.hub.docker.com/library/sonarqube:7.6-community --dry-run '--name=${NAME}' -o yaml > deployment.yaml
oc process -f deployment.yaml -l 'app=sonarqube'  | oc create -f -

oc create configmap sonarqube --from-file=sonar.properties=files/sonar.properties --dry-run -o yaml



https://github.com/racodond/sonar-gherkin-plugin