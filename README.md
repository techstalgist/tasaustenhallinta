# Devaus

1. Aja `npm run dev-start` => käynnistää sekä clientin että palvelimen. Avaa `localhost:3000` selaimessa käyttääksesi sovellusta. Kun teet muutoksia, sovelluksen pitäisi käynnistyä uudelleen automaattisesti.

Sovellus pyöri ennen Herokussa, mutta 17.09.2022 otin Herokun tuotannosta tietokantadumpin ja otin sen käyttöön 
paikallisessa ympäristössä.

Kirjautuminen paikalliseen ympäristöön toimii samoin kuten Herokussa pyörivään sovellukseenkin.
Crontabista löytyy ajastettu backup-komento, joka ottaa tietokantadumpin Documents/backups:in alle jos kone on käynnissä 
ajastetun backupin aikaan.

# Dokumentaatio

[Dokumentaatio](https://github.com/techstalgist/tasaustenhallinta/blob/master/doc/dokumentaatio.pdf)
