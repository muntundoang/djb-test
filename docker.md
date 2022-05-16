# Deploy Dockerizing to Heroku

## Create heroku.yml

ref: [links](https://devcenter.heroku.com/articles/build-docker-images-heroku-yml)

Buatlah `heroku.yml` pada aplikasi docker yang ingin kita deploy, sebagai berikut:

```yml
build:
 docker:
  web: Dockerfile
```

## Setup

Lalu lakukan CLI dalam terminal kalian, posisi terminal berada pada server:

```shell
# heroku create [nama_aplikasi-heroku] --remote [push ke remote mana, nama remote]
heroku create upsalla-service-app --remote heroku-app-microservices
heroku create gomank-apollo --remote heroku-gomank-apollo

# binding remote origin yang sebelumnya dibuat dengan aplikasi heroku
heroku git:remote --remote heroku-gomank-apollo -a gomank-apollo

# info ke heroku bahwa aplikasi ini/ proses deploy menggunakan docker
heroku stack:set container --app gomank-apollo

# git subtree: memastikan yang di push ke heroku adalah folder tertentu saja
# proses ini dilakukan di root git, atau posisi .git berada
# pastikan pada tahap ini, kalian sudah menggunakan process.ENV untuk port
# UNTUK BEBERAPA WINDOWS, penggunaan subtree perlu diinstall
git subtree push --prefix server/services/mamang heroku-gomang-server-mamang rio/test-deployment:main

# Sambil menunggu, kalian bisa tambahkan database postgres di adds-on heroku
# Tambahkan NODE_ENV pada config env heroku: production. Hal ini berkaitan pada model sequelize

# buka bash heroku
heroku run bash -a upsalla-service-app

# lakukan sequelzie migrate dan sequelize seed
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# exit, lalu buka aplikasi
heroku open
```
