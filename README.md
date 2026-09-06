# TerokaKu PWA v1.1.0 — Deep Learning

TerokaKu ialah offline-first Explore & Learn PWA untuk kanak-kanak. v1.1 menukar topik biasa daripada satu halaman ringkas kepada **Deep Learning Journey** berperingkat.

## Apa yang baru dalam v1.1

- 72 topik non-English kini mempunyai kandungan deep learning khusus.
- 364 learning chapters keseluruhan.
- Setiap topik mempunyai sekurang-kurangnya 5 bab; topik utama seperti Sun mempunyai sehingga 7 bab.
- Chapter progress disimpan secara local pada device (`localStorage`).
- Buka topik tidak lagi bermaksud selesai: anak boleh tandakan setiap bab selepas faham.
- Auto-buka bab seterusnya apabila satu bab diselesaikan.
- Audio “Dengar bab ini” menggunakan text-to-speech device.
- Kandungan berubah ikut tahap umur:
  - Explorer 4–6: penerangan inti + point terpilih.
  - Discoverer 7–9: penerangan penuh.
  - Investigator 10–12: penerangan penuh + nota lanjutan bila tersedia.
- Fakta Solar System/Sun dirangka berasaskan rujukan utama NASA Science.
- PWA/service worker dikemas kini ke cache `terokaku-v1.1.0`.
- Semua progress v1.0 Discovery Book kekal kerana storage key sedia ada tidak diubah; v1.1 hanya menambah `tk_topic_progress`.

## Kandungan sedia ada yang dikekalkan

13 worlds, interactive Solar System, English World, vocabulary + pronunciation, Sentence Builder, Conversation, Mini Story, Word Hunt, English Bridge, Discovery Book, badges, age setting, BM/English/BM+English, search, installable PWA dan offline support.

## Deploy

Tiada build step / npm / database diperlukan. Upload semua fail dalam folder ini ke GitHub Pages atau Cloudflare Pages.

Main file: `index.html`
