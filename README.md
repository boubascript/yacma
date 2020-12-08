# yacma
Yet Another (Distributed) Classroom Management App 

## Requirements
* Node >=10

## Setting Up

`git clone` the repo then `cd yacma`.

Run `npm run installer` to install all packages for every service.

### Useful Scripts

`npm run dev` will run both the client and the api locally together, but either can be run independently from the root folder with 

`npm run dev:client` or `npm run dev:api`.

`npm run format` will format all `ts/tsx` files in the project.

## api aka server aka backend
`cd api`
`export GOOGLE_APPLICATION_CREDENTIALS='<path to service key file>'`
`npm run dev` to run the server at [localhost:8080](http://localhost:8080).

## client aka frontend
`cd client`

`npm start` to run the client at [localhost:3000](http://localhost:3000).

Both scripts have hot reloading so they'll auto rerun when edited.

## Deploying

`npm run deploy` in the folder of the service you want to deploy. (client is the default service)


