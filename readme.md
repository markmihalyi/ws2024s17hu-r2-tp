# WS2024 S17 R2 HU Test Project
## Urls
- Team admin: http://team.admin.localhost
- Runner app: http://runner-app.localhost
- Backend: http://backend.localhost
- Backend-2: http://backend-2.localhost
- PhpMyAdmin: http://pma.localhost

## Setup
### PHP / Laravel
1. Remove node.js entrypoint at `backend/app.js`
2. Start the project:

```shell
docker-compose -f docker-compose.yml -f docker-compose.php.yml up -d
```


### Node.js
1. Remove php entrypoint at `backend/public`
2. Start the project:

```shell
docker-compose -f docker-compose.yml -f docker-compose.nodejs.yml up -d
```

## Development
### Frontend
#### With framework
1. Copy the base project from the assets folder to the dev/[task] folder
2. Start the app with `npm run start`. You will be able to preview your work on localhost.
3. When you are done, **deploy it** by building, and moving the compiled assets to the deploy/[task] folder

#### Without framework
1. Work in the deploy/[task] folder
2. You will be able to preview your work on http://[task].localhost

---

### Backend
#### Database
- Host: `db`
- Username: `root`
- Password: `password`

#### PHP
1. Delete the `deploy/backend/app.js` file
2. Work in `deploy/backend`. The entrypoint for your application is `deploy/backend/public/index.php`.
3. Preview your work at `http://backend.localhost`

#### Laravel
1. Delete the `deploy/backend/app.js` file
2. Copy the laravel assets to `deploy/backend`.
3. Work in `deploy/backend`.
4. Preview your work at `http://backend.localhost`

#### Node.js
1. Delete the `deploy/backend/public` folder.
2. Work in `deploy/backend`. The entrypoint for your application is `deploy/backend/app.js`.
3. Preview your work at `http://backend.localhost`. The application automatically reloads using nodemon.
4. To view the console, use the following command: 
```shell
docker-compose -f docker-compose.yml -f docker-compose.nodejs.yml logs -ft backend
```
