#Developing/Troubleshooting pipeline-cli
- clone the pipeline-cli repository
- in the pipeline-cli run:
```
npm link
```

- in this .pipeline folder, run:
```
rm -rf node_modules; npm install; npm link pipeline-cli
```