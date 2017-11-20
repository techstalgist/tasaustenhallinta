# Devaus

1. Aja `npm start` => käynnistää sekä clientin että palvelimen. Avaa `localhost:3000` selaimessa käyttääksesi sovellusta. Kun teet muutoksia, sovelluksen pitäisi käynnistyä uudelleen automaattisesti.

# Deploy

1. Aja `./deploy.sh` deployataksesi muutokset tuotantoympäristöön. Skripti buildaa client JS:t ensin, ja siirtää client buildin ja backend-koodit palvelimelle. Riippuvuudet asennetaan palvelimella.
2. Aja `./open_prod.sh` avataksesi sivun https://ruuskmik.users.cs.helsinki.fi/ Google Chromella. Joudut tekemään hard refreshin, jos sivu on välimuistissa.

# Tuotantoympäristö

Testikäyttäjä: "eka", salasana: "testaa"

Kirjautumissivu:
* [kirjautuminen](https://ruuskmik.users.cs.helsinki.fi)

Kirjautumisen vaativat sivut:
* [tasaukset](https://ruuskmik.users.cs.helsinki.fi/auth/adjustments)
* [laskut](https://ruuskmik.users.cs.helsinki.fi/auth/bills)
* [kategoriat](https://ruuskmik.users.cs.helsinki.fi/auth/categories)
* [analyysi](https://ruuskmik.users.cs.helsinki.fi/auth/analysis)

# Dokumentaatio

[Dokumentaatio](https://github.com/techstalgist/tasaustenhallinta/blob/master/doc/dokumentaatio.pdf)
