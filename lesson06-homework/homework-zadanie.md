# Domácí úkol 4

- Deadline: 18.12.2023 23:59
- Počet bodů: 10

__Cílem tohoto úkolu je implmentovat endpoint pro upload souboru__

- Vyber si jakou metodu chceš použít, jestli pomocí `base64` payloadu nebo `form-data`
- Klidně implementuj obě metody :)
- Endpoint pro upload by měl vrátit v response url k uploadovanému souboru. Pokud ji zadám do prohlížeče, uvidím uploadovaný obrázek (nastav správně `express.static`)
- Implementuj kontrolu typu, tak aby nebylo možné nahrát jiný soubor než obrázek

### Další napády (nepovinné)

- Implementuj i omezení na velikost uploadovaného souboru (např. 1000x1000px) a pokud je obrázek větší, zmenši ho (můžeš použít knihovnu https://www.npmjs.com/package/sharp)
- K obrázku vygeneruj náhled (opět použij knihovnu `sharp`)
- Vyřeš možnost nahrávání souborů se stejným jménem
    - např. složka per uživatel a/nebo pojmenuj soubor dle `uuid` (https://www.npmjs.com/package/uuid) nebo jakýkoliv jiný unikátní identifikátor



Dotazy:
1) ako robit FE? Proste ako vybrat subor.
2) Resize suboru - aj testovat na FE, ze aby neposielal privelikanske subori?
