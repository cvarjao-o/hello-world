```
oc port-forward "$(oc get pod -l 'deploymentconfig=selenium-hub' -o name)" 4444
oc port-forward "$(oc get pod -l 'deploymentconfig=selenium-firefox' -o name)" 5901:5900

export SELENIUM_REMOTE_URL=http://localhost:4444/wd/hub
node ./node_modules/selenium-cucumber-js/index.js -s ./step-definitions -d -b chrome
node ./node_modules/selenium-cucumber-js/index.js -s ./step-definitions -d -b firefox

node ./node_modules/selenium-cucumber-js/index.js -s ./step-definitions -d -b chrome -j ./reports/junit

```
# SonarQube

```
https://github.com/racodond/sonar-gherkin-plugin/

sed -i '' "s|$(git rev-parse --show-toplevel)/hello-test1/||g" ./reports/junit/junit-report.xml

sonar-scanner -X
```

# Known Issues
- https://github.com/SeleniumHQ/docker-selenium/issues/858
