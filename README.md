# TURSO CONNEXION


```bash
curl -sSfL https://get.tur.so/install.sh | bash
turso auth login
turso db destroy test-legion-athenienne
turso db create test-legion-athenienne --from-file ./prisma/dev.db
```
optionnel si erreur WAL apparait
```bash
sqlite3 ./prisma/dev.db "PRAGMA journal_mode = WAL;"
turso db create test-legion-athenienne --from-file ./prisma/dev.db
```
pour check que tout va bien
```bash
turso db shell dev
```
et ensuite (adapte les requetes sql ci-dessous à la bdd choisie)
```bash
.tables
SELECT id, name, category, price FROM Product LIMIT 5;
SELECT id, name, location FROM Monastery;
```

