# TerokaKu PWA v1.2.0 — Encyclopedia Lens

Update utama v1.2:
- Encyclopedia Lens pada semua topik non-English.
- Gambar sebenar dimuatkan online secara dinamik daripada Wikipedia/Wikimedia page summary, dengan fallback icon jika offline/gambar tiada.
- At a Glance, bidang ilmu, quick chapter index, Did You Know?, Big Question dan glossary interaktif.
- Quick Index lompat terus ke mana-mana bab Deep Learning.
- Glossary boleh ditekan untuk maksud ringkas dan audio.
- Deep Learning v1.1, Discovery Book, English World, progress local dan PWA install dikekalkan.
- Remote images tidak dimasukkan ke cache Service Worker supaya storage PWA tidak membengkak; core app masih boleh dibuka offline dengan fallback visual.

## Deploy
Upload semua fail dalam folder ini ke GitHub Pages / Cloudflare Pages. Tiada npm atau build step diperlukan.
