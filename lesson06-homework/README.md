# Co je, resp. nie je implementovane

- Posielanie cez `form-data`
- Ukladanie pod /public/upload/{userId}
- Vracia URL k súboru aj k náhľadu
- Meno súboru sa znormalizuje (zruší sa diakritika a nekomfortné znaky sa nahradia za "_")
- Ak už súbor existuje, tak skúša iné mená "hugo.jpg" -> "hugo(2).jpg" -> "hugo(3).jpg" -> "hugo(4).jpg" ... S uuid by to bolo príliš jednoduche a z pohľadu endusera trochu škaredé :-)
- Thumbnail 96px
- Kontrola či je obrázok: Len podľa podvrhnutej prípony súboru a mimetype, voľáko sa mi nepodarilo odchytiť chybu, keď sa sharp-u niečo nepáči
- ked je širší alebo vyšší ako 1000px -> resizne sa
- príklady su v test.http