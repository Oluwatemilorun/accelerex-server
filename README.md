# accelerex-server

> The web server for accelerex

## Build Setup

```bash
# install dependencies
$ yarn install

# run in development mode
$ yarn start:dev

# build for production and launch server
$ yarn build
$ yarn start

# run tests
$ yarn test

# generate client module
$ yarn generate
```

### Environment Variables

Check  `/env` dir for dotenv files. Other variables include

- `BASE_URL`: Application's base url. Used mostly with axios
- `PORT`: Port to run the server on (`4000`)
- `JWT_SECRET`: Will be used to sign tokens and cookie
- `MONGODB_URI`: The Mongo DB connection URI `mongodb+srv://[user]:[password]@[server]/utiliapp?retryWrites=true&w=majority`
