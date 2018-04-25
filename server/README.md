# socket-joystick-server

Simple node application
- handles multiple clients connected by sockets with shared host.

## run application
```
npm install
npm start
```

To run on specified port:
```
env PORT=port npm start
```

## run tests

```
npm test
```
Script runs server and tests. After all should kill server process.
Server output should be in file test-integration.log. Tests output in console. 
If port set in scripts/test.script.ts is in use, server fails quiet.
