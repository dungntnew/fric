# install cairo and its dependencies  for node-canvas required by fabric
# https://github.com/Automattic/node-canvas/wiki/Installation---Fedora
sudo yum install cairo cairo-devel cairomm-devel libjpeg-turbo-devel pango pango-devel pangomm pangomm-devel giflib-deve

# in centos some font will not be installed by default, so need install it yourself
# for example: yum search arial 
yum install liberation-sans-fonts.noarch

# install node fabric
npm install fabric




