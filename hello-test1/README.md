```
export SELENIUM_REMOTE_URL=http://localhost:4444/wd/hub
node ./node_modules/selenium-cucumber-js/index.js -s ./step-definitions -d -b chrome
node ./node_modules/selenium-cucumber-js/index.js -s ./step-definitions -d -b firefox
```