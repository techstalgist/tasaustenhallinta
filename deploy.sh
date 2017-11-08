#!/bin/bash

# Luo frontend build ensin
cd client
npm run build
cd ..

# Missä kansiossa komento suoritetaan
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

source $DIR/environment.sh

echo "Siirretään tiedostot users-palvelimelle..."

# Tämä komento siirtää tiedostot palvelimelle
rsync -z -r -e ssh $DIR/client/build $DIR/backend $DIR/sql $DIR/server.js $DIR/ecosystem.json $DIR/package.json users.cs:$PROJECT_FOLDER

echo "Valmis!"

echo "Suoritetaan build palvelimella"

# Asennetaan riippuvuudet, stopataan ja startataan
# pm2 toimii, koska palvelimen ~/.bashrc :ssä sourcetetaan nvm -bash skripti
ssh users.cs "
cd $PROJECT_FOLDER
npm install
pm2 stop all
pm2 start ecosystem.json --env production
exit"

echo "Valmis! Sovelluksesi on nyt valmiina osoitteessa $USERNAME.users.cs.helsinki.fi"
