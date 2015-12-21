# to run app in localhost
# please install http server to serve www folder
# for example: using nodejs server
# ( you need install nodejs first)

# install http-server to serve assest
# ( maybe you need run with root access)
npm install -g http-server

# and start server
http-server ./www

# now you can view app in brower
http:127.0.0.1:8080

# let's enjoy ^_^

# =======================
# optional
# =======================
#
# this app is developed based on ionicframework
# url: http://ionicframework.com/
# and very strong js library for image: fabricjs
# url: fabricjs.com
# to start using it for continue develop let's
# start:
npm install -g cordova ionic

# and start server with ionic
# (if using serve of ionic, we don't need http-server)
ionic serve

