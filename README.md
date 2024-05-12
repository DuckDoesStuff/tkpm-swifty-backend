
# Swifty backend

Backend server with Postgresql, Pgadmin4 browser for database operations. Runs on Docker.

## How to build

Step 1: Go to the directory

`cd swifty-backend`

Step 2: Build the docker containers and run

`docker compose up -d`

(Optional) Sync the files update:

`docker compose watch`

(Optional) Monitor the containers logs:

`docker compose logs -f swifty-backend db`


## Note

- The backend will run on `localhost:3333 `
- Use pgadmin4 browser on `localhost:5050/browser/`

Register new server on PgAdmin4 with:
```
Name: (any)
```
Go to Connection tab
```
Host name: db
Username: admin
Password: admin
Maintenance database: swifty
```


## Defaults

- Default pgadmin4 account is: `email@email.com : password`

- Default Postgres variables:
```     
POSTGRES_USER: admin
POSTGRES_PASSWORD: admin
POSTGRES_DB: swifty 
```