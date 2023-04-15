"# ws2024s17hu-r2 submitting"

1. Backend:

- Node.js
- Source\Deploy: www\backend
- Base URL: http://backend.localhost/api/v1
- Additional instruction:

2. Team Admin:

- React
- Source: www\team-admin.src
- Deploy: www\team-admin
- URL: http://team-admin.localhost
- Additional instruction:
  - In the deployed version, routes may not work properly without a proper nginx configuration.
  - nginx fix: https://stackoverflow.com/questions/43555282/react-js-application-showing-404-not-found-in-nginx-server
  - I've done it locally; however, if you don't want to change nginx settings, you should issue the `npm start` command from the `team-admin.src` directory.

3. Runner App:

- React
- Source: www\runner-app.src
- Deploy: www\runner-app
- URL: http://runner-app.localhost
- Additional instruction:
