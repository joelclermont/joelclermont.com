#!/usr/bin/env bash         
 
# login as root and run this script via bash & curl:
 
apt-get update
apt-get install -y build-essential bison openssl libreadline5 libreadline-gplv2-dev curl \
git-core zlib1g zlib1g-dev libopenssl-ruby libcurl4-openssl-dev libssl-dev \
libsqlite3-0 libsqlite3-dev sqlite3 libxml2-dev libmysqlclient-dev \
mysql-client
 
bash -s stable < <(curl -s https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer)
 
cd && echo "[[ -s "/usr/local/rvm/scripts/rvm" ]] && . "/usr/local/rvm/scripts/rvm"" >> .bashrc
 
source /usr/local/rvm/scripts/rvm
 
type rvm | head -n1
 
rvm install 1.9.3
rvm use 1.9.3 --default      
 
echo "gem: --no-rdoc --no-ri" >> /etc/gemrc