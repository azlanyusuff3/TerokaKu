const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={
  age:localStorage.getItem('tk_age')||'discoverer',
  language:localStorage.getItem('tk_language')||'dual',
  audio:localStorage.getItem('tk_audio')!=='false',
  discoveries:JSON.parse(localStorage.getItem('tk_discoveries')||'[]'),
  topicProgress:JSON.parse(localStorage.getItem('tk_topic_progress')||'{}'),
  currentWorld:null,currentTopic:null,deferredPrompt:null
};
const worldMap=Object.fromEntries(TEROKA_DATA.worlds.map(w=>[w.id,w]));
function save(){localStorage.setItem('tk_age',state.age);localStorage.setItem('tk_language',state.language);localStorage.setItem('tk_audio',state.audio);localStorage.setItem('tk_discoveries',JSON.stringify(state.discoveries));localStorage.setItem('tk_topic_progress',JSON.stringify(state.topicProgress));}
function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('show'),1900)}
function displayName(t){return state.language==='en'?t.name:state.language==='ms'?(t.ms||t.name):`${t.ms||t.name} · ${t.name}`}
function speak(text,lang='en-US'){if(!state.audio||!('speechSynthesis'in window))return; speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=lang;u.rate=.9;speechSynthesis.speak(u)}
function setView(id){$$('.view').forEach(v=>v.classList.remove('active'));$('#'+id+'View').classList.add('active');$('#main').focus({preventScroll:true});scrollTo({top:0,behavior:'smooth'});$$('.nav-item').forEach(n=>n.classList.remove('active'));}
function renderHome(){setView('home');$$('.nav-item[data-nav="home"]').forEach(n=>n.classList.add('active'));const grid=$('#worldGrid');grid.innerHTML='';TEROKA_DATA.worlds.forEach(w=>{const b=document.createElement('button');b.className='world-card';b.style.setProperty('--wc1',w.colors[0]);b.style.setProperty('--wc2',w.colors[1]);b.innerHTML=`<span class="world-count">${w.topics.length} topics</span><span class="world-icon">${w.icon}</span><h3>${state.language==='en'?w.en:w.name}</h3><p>${w.tag}</p>`;b.onclick=()=>openWorld(w.id);grid.appendChild(b)});renderHomeDiscovery();renderDaily();}
function renderHomeDiscovery(){const items=state.discoveries.slice(-6).reverse().map(id=>TEROKA_DATA.topics[id]).filter(Boolean);$('#recentDiscoveries').innerHTML=items.length?items.map(t=>`<div class="discovery-chip"><span>${t.icon}</span><small>${t.ms||t.name}</small></div>`).join(''):`<p style="color:var(--muted);font-size:13px">Belum ada penemuan. Tekan mana-mana topik untuk mula.</p>`;const total=Object.keys(TEROKA_DATA.topics).length,p=Math.min(100,Math.round(state.discoveries.length/total*100));$('#discoveryRing').style.setProperty('--progress',p+'%');$('#discoveryRing span').textContent=state.discoveries.length;}
function renderDaily(){const ids=Object.keys(TEROKA_DATA.topics).filter(id=>TEROKA_DATA.topics[id].summary);const id=ids[(new Date().getDate()+new Date().getMonth()*7)%ids.length],t=TEROKA_DATA.topics[id];$('#dailyIcon').textContent=t.icon;$('#dailyTitle').textContent=`${t.ms||t.name} · ${t.name}`;$('#dailyText').textContent=(t.facts?.[0]?.[2])||t.short;$('#dailyExploreBtn').onclick=()=>openTopic(id);}
function openWorld(id){state.currentWorld=id;const w=worldMap[id];setView('world');$$(`.nav-item[data-nav="${id==='english'?'english':'explore'}"]`).forEach(n=>n.classList.add('active'));const h=$('#worldHero');h.style.setProperty('--wh1',w.colors[0]);h.style.setProperty('--wh2',w.colors[1]);h.innerHTML=`<div class="giant-icon">${w.icon}</div><span class="eyebrow">${id==='english'?'LANGUAGE DISCOVERY':'EXPLORE WORLD'}</span><h1>${state.language==='en'?w.en:w.name}</h1><p>${w.description}</p>`;const content=$('#worldContent');if(id==='space') content.innerHTML=renderSolarSystem()+renderTopicGrid(w);else if(id==='english') content.innerHTML=renderEnglishDashboard(w)+renderTopicGrid(w);else content.innerHTML=renderTopicGrid(w);bindDynamic();}
function renderTopicGrid(w){return `<section class="section-block"><div class="section-head"><div><span class="eyebrow">TOPICS</span><h2>Jom pilih satu</h2></div></div><div class="topic-grid">${w.topics.map(id=>{const t=TEROKA_DATA.topics[id],done=state.discoveries.includes(id);return `<button class="topic-card" data-topic="${id}">${done?'<span class="learned">✓</span>':''}<span class="emoji">${t.icon}</span><h3>${displayName(t)}</h3><p>${t.short||''}</p></button>`}).join('')}</div></section>`}
function renderSolarSystem(){const planets=[['mercury','🪨',55,18,5],['venus','🟡',78,22,7],['earth','🌍',103,24,9],['mars','🔴',128,21,12],['jupiter','🟤',162,36,18],['saturn','🪐',197,39,24],['uranus','🩵',228,27,31],['neptune','🔵',260,27,38]];return `<section class="solar-wrap"><div class="solar-toolbar"><div><span class="eyebrow">INTERACTIVE</span><h2 style="margin:3px 0">Solar System</h2></div><button class="pill-btn" data-topic="solar-system">📘 Apa itu Solar System?</button></div><div class="solar-stage"><div class="sun-core">☀️</div>${planets.map(([id,ico,r,size,speed])=>`<div class="orbit-line" style="width:${r*2}px;height:${r*1.22}px"></div><div class="planet-orbiter" style="--radius:${r}px;--size:${size}px;--speed:${speed}s"><button class="planet-btn" data-topic="${id}">${ico}<span class="planet-label">${TEROKA_DATA.topics[id].name}</span></button></div>`).join('')}</div><p style="color:var(--muted);font-size:12px;margin:10px 5px 0">Tekan mana-mana planet. Orbit ini untuk visual learning — bukan skala astronomi sebenar.</p></section>`}
function renderEnglishDashboard(){return `<section class="english-dashboard"><article class="english-feature big"><span class="eyebrow">HOW WE LEARN</span><div class="big-emoji">🍎 🔊</div><h2>See → Hear → Understand → Use</h2><p style="color:var(--muted)">English diajar ikut benda sebenar, bukan hafal grammar dahulu.</p><div class="lesson-path"><div class="lesson-step"><span class="step-no">1</span><div><b>See it</b><small style="display:block;color:var(--muted)">🍎 Apple</small></div></div><div class="lesson-step"><span class="step-no">2</span><div><b>Hear it</b><small style="display:block;color:var(--muted)">Tekan audio pronunciation</small></div></div><div class="lesson-step"><span class="step-no">3</span><div><b>Use it</b><small style="display:block;color:var(--muted)">“I eat an apple.”</small></div></div><div class="lesson-step"><span class="step-no">4</span><div><b>Build it</b><small style="display:block;color:var(--muted)">Susun perkataan menjadi ayat</small></div></div></div></article><article class="english-feature"><span class="eyebrow">QUICK START</span><h2>🔤 Vocabulary</h2><p>Gambar + meaning + pronunciation + simple sentence.</p><button class="wide-btn" data-topic="english-first-words">Mula belajar</button></article><article class="english-feature"><span class="eyebrow">PLAY</span><h2>🔎 Word Hunt</h2><p>Dengar arahan dan cari objek yang betul.</p><button class="wide-btn alt" data-topic="word-hunt">Main Word Hunt</button></article></section>`}
function bindDynamic(){$$('[data-topic]').forEach(el=>el.onclick=()=>openTopic(el.dataset.topic));}
function addDiscovery(id){if(!state.discoveries.includes(id)){state.discoveries.push(id);save();const t=TEROKA_DATA.topics[id];showToast(`✨ New discovery: ${t.ms||t.name}`)}}
function openTopic(id){const t=TEROKA_DATA.topics[id];if(!t)return;state.currentTopic=id;state.currentWorld=t.world;addDiscovery(id);setView('topic');$('#topicContent').innerHTML=renderTopic(t,id);bindTopicInteractions(t,id);loadEncyclopediaPhoto(id,t);}
function renderTopic(t,id){
  if(t.mode==='vocab')return renderVocab(t,id);
  if(t.mode==='sentence')return renderSentence(t,id);
  if(t.mode==='conversation')return renderConversation(t,id);
  if(t.mode==='story')return renderStory(t,id);
  if(t.mode==='hunt')return renderHunt(t,id);
  const summary=t.summary?.[state.age]||t.short||'';
  return `<div class="topic-hero"><div class="topic-emoji">${t.icon}</div><div><span class="eyebrow">${worldMap[t.world]?.name||'DISCOVERY'}</span><h1>${displayName(t)}</h1><div class="topic-subtitle">${t.short||''}</div><p class="topic-summary">${summary}</p><div class="topic-actions"><button class="pill-btn" id="speakTopic">🔊 Dengar penerangan</button><button class="pill-btn" id="markAgain">✨ Discovered</button>${t.name!==t.ms?`<button class="pill-btn" id="speakWord">🗣️ ${t.name}</button>`:''}</div></div></div>${t.mode==='solar'?renderSolarSystem():''}${renderEncyclopediaLens(t,id)}${renderDeepJourney(t,id)}<div class="fact-layout"><section class="info-panel"><span class="eyebrow">QUICK RECAP</span><h2>Perkara penting</h2><div class="fact-list">${(t.facts||[]).map(f=>`<div class="fact-row"><span style="font-size:25px">${f[0]}</span><div><b>${f[1]}</b><small>${f[2]}</small></div></div>`).join('')}</div></section><section class="info-panel why-card"><span class="eyebrow">❓ WHY?</span><h2>${t.why?.[0]||'Soalan untuk difikirkan'}</h2><p style="color:#e8ddc8;line-height:1.7">${t.why?.[1]||'Cuba terangkan semula dengan ayat sendiri. Bila kita boleh menerangkan sesuatu, biasanya kita lebih betul-betul faham.'}</p><button class="pill-btn" id="speakWhy">🔊 Dengarkan</button></section></div>${renderEnglishBridge(t)}${renderCompare(t,id)}${renderCrossLink(t)}`;
}

function encyclopediaText(t,id){
  const chapters=typeof DEEP_CONTENT!=='undefined'?(DEEP_CONTENT[id]||[]):[];
  return [t.short,...(t.facts||[]).flat(),...(t.why||[]),...chapters.flatMap(c=>[c.title,c.lead,c.detail,...(c.bullets||[]),c.investigator])].filter(Boolean).join(' ').toLowerCase();
}
function encyclopediaGlossary(t,id){
  if(typeof ENCYCLOPEDIA==='undefined')return[];
  const hay=encyclopediaText(t,id);
  return Object.entries(ENCYCLOPEDIA.glossary).filter(([key])=>hay.includes(key)).slice(0,6).map(([,v])=>v);
}
function renderEncyclopediaLens(t,id){
  if(t.world==='english')return'';
  const chapters=typeof DEEP_CONTENT!=='undefined'?(DEEP_CONTENT[id]||[]):[];
  const fields=(typeof ENCYCLOPEDIA!=='undefined'&&ENCYCLOPEDIA.field[t.world])||['Pengetahuan','Discovery'];
  const glossary=encyclopediaGlossary(t,id);
  const fact=(t.facts||[])[0];
  const didYouKnow=fact?.[2]||chapters[0]?.bullets?.[0]||t.short||'';
  const progress=getTopicProgress(id).size;
  return `<section class="encyclopedia-lens" id="encyclopediaLens">
    <div class="encyclopedia-titlebar"><div><span class="eyebrow">📚 ENCYCLOPEDIA LENS</span><h2>Kenali ${t.ms||t.name} dari banyak sudut</h2><p>${fields[0]} · ${fields[1]} · ${chapters.length} bab penerokaan</p></div><span class="encyclopedia-stamp">${progress}/${chapters.length||0}<small>bab</small></span></div>
    <div class="encyclopedia-grid">
      <article class="encyclopedia-photo-card"><div id="topicPhotoWrap" class="topic-photo-wrap"><div class="photo-fallback"><span>${t.icon}</span><small>Memuatkan gambar sebenar…</small></div><img id="topicPhoto" alt="Gambar sebenar ${t.ms||t.name}" hidden><div class="photo-caption"><b id="topicPhotoLabel">${t.ms||t.name}</b><a id="topicPhotoSource" href="#" target="_blank" rel="noopener" hidden>Wikipedia / Wikimedia ↗</a></div></div></article>
      <article class="encyclopedia-atglance"><span class="mini-label">AT A GLANCE</span><div class="encyclopedia-path"><span>${worldMap[t.world]?.icon||'🧭'}</span><b>${worldMap[t.world]?.name||fields[0]}</b><i>›</i><strong>${t.ms||t.name}</strong></div><div class="encyclopedia-mini-facts">${(t.facts||[]).slice(0,4).map(f=>`<div><span>${f[0]}</span><b>${f[1]}</b><small>${f[2]}</small></div>`).join('')}</div></article>
    </div>
    ${chapters.length?`<div class="encyclopedia-index"><div class="index-head"><span class="mini-label">QUICK INDEX</span><small>Tekan untuk lompat terus ke bab</small></div><div class="index-chips">${chapters.map((c,i)=>`<button type="button" class="index-chip" data-chapter-jump="${i}"><span>${i+1}</span>${c.title}</button>`).join('')}</div></div>`:''}
    <div class="curiosity-grid"><article class="curiosity-card"><span class="mini-label">✨ DID YOU KNOW?</span><p>${didYouKnow}</p></article><article class="curiosity-card question"><span class="mini-label">❓ BIG QUESTION</span><b>${t.why?.[0]||'Apa yang membuat topik ini menarik?'}</b><p>${t.why?.[1]||'Cari jawapannya semasa kamu membaca bab di bawah.'}</p></article></div>
    ${glossary.length?`<div class="encyclopedia-glossary"><div class="index-head"><span class="mini-label">🔤 GLOSSARY</span><small>Istilah penting yang muncul dalam topik ini</small></div><div class="glossary-grid">${glossary.map(g=>`<button type="button" class="glossary-term" data-glossary-term="${g[0]}" data-glossary-def="${g[1]}"><b>${g[0]}</b><small>Tekan untuk maksud</small></button>`).join('')}</div><div id="glossaryExplain" class="glossary-explain">Pilih satu istilah untuk lihat maksud ringkas.</div></div>`:''}
  </section>`;
}
async function loadEncyclopediaPhoto(id,t){
  const img=$('#topicPhoto'),wrap=$('#topicPhotoWrap'),source=$('#topicPhotoSource');
  if(!img||!wrap||typeof ENCYCLOPEDIA==='undefined')return;
  const title=ENCYCLOPEDIA.wikiTitle[id]||t.name;
  try{
    const r=await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,{headers:{'Accept':'application/json'}});
    if(!r.ok)throw new Error('photo unavailable');
    const d=await r.json();
    const src=d.thumbnail?.source||d.originalimage?.source;
    if(!src)throw new Error('no image');
    img.onload=()=>{img.hidden=false;wrap.classList.add('has-photo');};
    img.src=src; img.alt=`${t.ms||t.name} — gambar rujukan`;
    if(source&&d.content_urls?.desktop?.page){source.href=d.content_urls.desktop.page;source.hidden=false;}
  }catch(e){wrap.classList.add('photo-unavailable');const f=wrap.querySelector('.photo-fallback small');if(f)f.textContent='Gambar online tak tersedia — ikon digunakan.';}
}
function bindEncyclopediaLens(){
  $$('[data-chapter-jump]').forEach(btn=>btn.onclick=()=>{const target=$(`.learning-chapter[data-chapter="${btn.dataset.chapterJump}"]`);if(target){target.open=true;target.scrollIntoView({behavior:'smooth',block:'start'});}});
  $$('[data-glossary-term]').forEach(btn=>btn.onclick=()=>{const out=$('#glossaryExplain');if(out){out.innerHTML=`<b>${btn.dataset.glossaryTerm}</b><span>${btn.dataset.glossaryDef}</span>`;}speak(`${btn.dataset.glossaryTerm}. ${btn.dataset.glossaryDef}`,'ms-MY');});
}

function getTopicProgress(id){return new Set(state.topicProgress[id]||[])}
function chapterBody(c){
  const detail=state.age==='explorer'?'':`<p class="chapter-detail">${c.detail||''}</p>`;
  const maxBullets=state.age==='explorer'?2:(c.bullets||[]).length;
  const bullets=(c.bullets||[]).slice(0,maxBullets);
  const investigator=state.age==='investigator'&&c.investigator?`<div class="investigator-note"><b>🔬 Investigator note</b><span>${c.investigator}</span></div>`:'';
  return `<p class="chapter-lead">${c.lead||''}</p>${detail}${bullets.length?`<ul class="chapter-bullets">${bullets.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}${investigator}`;
}
function renderDeepJourney(t,id){
  const chapters=typeof DEEP_CONTENT!=='undefined'?(DEEP_CONTENT[id]||[]):[];
  if(!chapters.length)return'';
  const done=getTopicProgress(id),pct=Math.round(done.size/chapters.length*100);
  const firstOpen=Math.min(chapters.length-1,[...Array(chapters.length).keys()].find(i=>!done.has(i))??0);
  const sources=(typeof DEEP_SOURCES!=='undefined'&&DEEP_SOURCES[id])||[];
  return `<section class="deep-journey" data-deep-topic="${id}"><div class="deep-head"><div><span class="eyebrow">📚 DEEP LEARNING JOURNEY</span><h2>Bukan sekadar kenal — jom faham</h2><p>${chapters.length} bab pendek. Buka satu demi satu dan tandakan selepas dah faham.</p></div><div class="depth-score"><strong id="depthDone">${done.size}/${chapters.length}</strong><small>bab selesai</small></div></div><div class="depth-bar"><span id="depthBar" style="width:${pct}%"></span></div><div class="chapter-stack">${chapters.map((c,i)=>`<details class="learning-chapter ${done.has(i)?'completed':''}" data-chapter="${i}" ${i===firstOpen?'open':''}><summary><span class="chapter-no">${done.has(i)?'✓':i+1}</span><span class="chapter-title"><b>${c.icon||'📘'} ${c.title}</b><small>${done.has(i)?'Selesai':'Tekan untuk belajar'}</small></span><span class="chapter-arrow">⌄</span></summary><div class="chapter-content">${chapterBody(c)}<div class="chapter-actions"><button class="pill-btn chapter-listen" data-listen-chapter="${i}">🔊 Dengar bab ini</button><button class="primary-btn complete-chapter" data-complete-chapter="${i}">${done.has(i)?'✓ Dah faham':'✓ Saya dah faham'}</button></div></div></details>`).join('')}</div>${sources.length?`<div class="source-note"><b>📖 Rujukan fakta utama:</b> ${sources.join(' · ')}</div>`:''}</section>`;
}


function renderEnglishBridge(t){
  if(t.world==='english')return'';
  const article=/^[aeiou]/i.test(t.name)?'an':'a';
  const sentence=`This is ${article} ${t.name}.`;
  return `<section class="info-panel" style="margin:18px 0;background:linear-gradient(145deg,#17364a88,#25264a88)"><span class="eyebrow">🗣️ ENGLISH BRIDGE</span><h2>Belajar topik ini dalam English</h2><div class="fact-row"><span style="font-size:42px">${t.icon}</span><div><b style="font-size:22px">${t.name}</b><small>${sentence}</small></div></div><div class="topic-actions"><button class="pill-btn" data-bridge="${t.name}">🔊 ${t.name}</button><button class="pill-btn" data-bridge="${sentence}">💬 ${sentence}</button></div></section>`;
}
const PLANET_COMPARE={mercury:['Rocky planet','4,879 km','88 days','0'],venus:['Rocky planet','12,104 km','225 days','0'],earth:['Rocky planet','12,742 km','365 days','1'],mars:['Rocky planet','6,779 km','687 days','2'],jupiter:['Gas giant','139,820 km','~12 years','Many'],saturn:['Gas giant','116,460 km','~29 years','Many'],uranus:['Ice giant','50,724 km','~84 years','Many'],neptune:['Ice giant','49,244 km','~165 years','Many']};
function renderCompare(t,id){
  if(!PLANET_COMPARE[id])return'';
  const base=PLANET_COMPARE[id];
  return `<section class="info-panel" style="margin:18px 0"><span class="eyebrow">⚖️ COMPARE</span><h2>Bandingkan ${t.name}</h2><div class="compare-grid"><div class="compare-tile"><small>Type</small><b>${base[0]}</b></div><div class="compare-tile"><small>Diameter</small><b>${base[1]}</b></div><div class="compare-tile"><small>1 year</small><b>${base[2]}</b></div><div class="compare-tile"><small>Moons</small><b>${base[3]}</b></div></div><p style="color:var(--muted);font-size:12px;margin-top:12px">Saiz dan tempoh dibulatkan untuk visual learning.</p></section>`;
}

function renderCrossLink(t){const w=worldMap[t.world];if(!w)return'';const other=w.topics.filter(x=>x!==state.currentTopic&&TEROKA_DATA.topics[x]).slice(0,4);return `<section class="section-block"><div class="section-head"><div><span class="eyebrow">KEEP EXPLORING</span><h2>Teroka yang berkaitan</h2></div></div><div class="topic-grid">${other.map(id=>{const x=TEROKA_DATA.topics[id];return `<button class="topic-card" data-topic="${id}"><span class="emoji">${x.icon}</span><h3>${displayName(x)}</h3><p>${x.short||''}</p></button>`}).join('')}</div></section>`}
function renderVocab(t){return `<div class="page-title"><span class="eyebrow">ENGLISH WORLD</span><h1>${t.icon} ${t.name}</h1><p>${t.short}</p></div><div class="vocab-grid">${t.vocab.map((v,i)=>`<button class="vocab-card" data-vocab="${i}"><span class="emoji">${v[0]}</span><strong>${v[1]}</strong><small>${v[2]}</small><p style="font-size:11px;color:#dfe7fa;margin:9px 0 0">${v[3]}</p></button>`).join('')}</div><section class="info-panel"><span class="eyebrow">HOW TO USE</span><h2>Tekan mana-mana kad</h2><p style="color:var(--muted)">App akan sebut perkataan dan ayat. Cuba ikut sebut perlahan-lahan. Tak perlu perfect — biasakan telinga dan mulut dulu.</p></section>`}
function renderSentence(t){state.sentenceIndex=(state.sentenceIndex||0)%t.sentences.length;const words=t.sentences[state.sentenceIndex],shuffled=[...words].sort(()=>Math.random()-.5);return `<div class="page-title"><span class="eyebrow">ENGLISH WORLD · PUZZLE</span><h1>🧩 Sentence Builder</h1><p>Tekan perkataan ikut susunan ayat yang betul.</p></div><section class="info-panel"><h2>Build the sentence</h2><div id="sentenceAnswer" class="sentence-builder"></div><div id="wordBank" class="sentence-builder" style="margin-top:12px">${shuffled.map((w,i)=>`<button class="word-token" data-word="${w}" data-i="${i}">${w}</button>`).join('')}</div><div id="sentenceFeedback" class="feedback"></div><div class="topic-actions"><button id="checkSentence" class="primary-btn">Check</button><button id="nextSentence" class="secondary-btn">Next sentence</button></div></section>`}
function renderConversation(t){return `<div class="page-title"><span class="eyebrow">ENGLISH WORLD · SPEAK</span><h1>💬 Everyday Conversation</h1><p>Tekan setiap ayat untuk dengar cara ia disebut.</p></div>${t.scenes.map(s=>`<section class="info-panel" style="margin-bottom:14px"><h2>${s.place}</h2><div class="fact-list">${s.lines.map(l=>`<button class="fact-row convo-line" data-say="${l[1]}" style="border:0;color:white;text-align:left"><span style="font-size:27px">${l[0]}</span><div><b>${l[1]}</b><small>Tap to listen</small></div></button>`).join('')}</div></section>`).join('')}`}
function renderStory(t){const words=t.story.split(' ');return `<div class="page-title"><span class="eyebrow">ENGLISH WORLD · READING</span><h1>📖 Mini Story</h1><p>Tekan satu-satu perkataan atau dengar seluruh cerita.</p></div><section class="info-panel"><div class="story-box">${words.map(w=>`<button class="story-word" data-say="${w.replace(/[.,!?]/g,'')}">${w} </button>`).join('')}</div><div class="topic-actions"><button id="readStory" class="primary-btn">🔊 Read the story</button></div></section>`}
function renderHunt(t){const target=t.hunt[Math.floor(Math.random()*t.hunt.length)][1];state.huntTarget=target;return `<div class="page-title"><span class="eyebrow">ENGLISH WORLD · GAME</span><h1>🔎 Word Hunt</h1><p>Dengar arahan dan cari objek yang betul.</p></div><section class="info-panel"><div style="text-align:center"><div style="font-size:20px;font-weight:900;margin-bottom:12px">Can you find the <span style="color:var(--yellow)">${target}</span>?</div><button id="huntSpeak" class="primary-btn">🔊 Listen</button></div><div class="vocab-grid" style="margin-top:18px">${[...t.hunt].sort(()=>Math.random()-.5).map(v=>`<button class="vocab-card hunt-item" data-answer="${v[1]}"><span class="emoji">${v[0]}</span><strong>${v[1]}</strong></button>`).join('')}</div><div id="huntFeedback" class="feedback" style="text-align:center"></div></section>`}
function bindTopicInteractions(t,id){bindDynamic();bindEncyclopediaLens();$('#speakTopic')?.addEventListener('click',()=>speak(t.summary?.[state.age]||t.short,state.language==='en'?'en-US':'ms-MY'));$('#speakWord')?.addEventListener('click',()=>speak(t.name,'en-US'));$('#speakWhy')?.addEventListener('click',()=>speak(`${t.why?.[0]||''} ${t.why?.[1]||''}`,state.language==='en'?'en-US':'ms-MY'));$$('[data-bridge]').forEach(el=>el.onclick=()=>speak(el.dataset.bridge,'en-US'));$$('[data-vocab]').forEach(el=>el.onclick=()=>{const v=t.vocab[+el.dataset.vocab];speak(`${v[1]}. ${v[3]}`,'en-US');showToast(`${v[1]} = ${v[2]}`)});$$('.convo-line,[data-say]').forEach(el=>el.onclick=()=>speak(el.dataset.say,'en-US'));$('#readStory')?.addEventListener('click',()=>speak(t.story,'en-US'));bindDeepJourney(t,id);if(t.mode==='sentence')bindSentence(t,id);if(t.mode==='hunt')bindHunt(t,id);}
function bindDeepJourney(t,id){
  const chapters=typeof DEEP_CONTENT!=='undefined'?(DEEP_CONTENT[id]||[]):[];
  if(!chapters.length)return;
  const refresh=()=>{
    const done=getTopicProgress(id),total=chapters.length,pct=Math.round(done.size/total*100);
    const score=$('#depthDone'),bar=$('#depthBar');if(score)score.textContent=`${done.size}/${total}`;if(bar)bar.style.width=pct+'%';
    $$('.learning-chapter').forEach(el=>{const i=+el.dataset.chapter,ok=done.has(i);el.classList.toggle('completed',ok);const no=el.querySelector('.chapter-no'),sm=el.querySelector('.chapter-title small'),btn=el.querySelector('.complete-chapter');if(no)no.textContent=ok?'✓':i+1;if(sm)sm.textContent=ok?'Selesai':'Tekan untuk belajar';if(btn)btn.textContent=ok?'✓ Dah faham':'✓ Saya dah faham';});
  };
  $$('.complete-chapter').forEach(btn=>btn.onclick=()=>{const i=+btn.dataset.completeChapter;const done=getTopicProgress(id);done.add(i);state.topicProgress[id]=[...done].sort((a,b)=>a-b);save();refresh();showToast(`📚 Bab ${i+1} selesai`);const current=btn.closest('details'),next=current?.nextElementSibling;if(next?.matches('details')){current.open=false;next.open=true;setTimeout(()=>next.scrollIntoView({behavior:'smooth',block:'center'}),80)}else if(done.size===chapters.length){showToast(`🏆 ${t.ms||t.name} — semua bab selesai!`)}});
  $$('.chapter-listen').forEach(btn=>btn.onclick=()=>{const c=chapters[+btn.dataset.listenChapter];const text=[c.title,c.lead,state.age==='explorer'?'':c.detail,...(c.bullets||[]).slice(0,state.age==='explorer'?2:99),state.age==='investigator'?c.investigator:''].filter(Boolean).join('. ');speak(text,'ms-MY')});
}

function bindSentence(t,id){const selected=[];$$('#wordBank .word-token').forEach(btn=>btn.onclick=()=>{if(btn.disabled)return;selected.push(btn.dataset.word);btn.disabled=true;btn.classList.add('selected');$('#sentenceAnswer').innerHTML=selected.map((w,i)=>`<button class="word-token" data-remove="${i}">${w}</button>`).join('');$$('[data-remove]').forEach(r=>r.onclick=()=>{const idx=+r.dataset.remove;const word=selected[idx];selected.splice(idx,1);const bank=[...$$('#wordBank .word-token')].find(b=>b.dataset.word===word&&b.disabled);if(bank){bank.disabled=false;bank.classList.remove('selected')}$('#sentenceAnswer').innerHTML=selected.map((w,j)=>`<button class="word-token" data-remove="${j}">${w}</button>`).join('')})});$('#checkSentence').onclick=()=>{const correct=t.sentences[state.sentenceIndex].join(' '),ans=selected.join(' ');if(ans===correct){$('#sentenceFeedback').textContent='✨ Great! '+correct;speak(correct,'en-US')}else $('#sentenceFeedback').textContent='Almost there — cuba susun semula.'};$('#nextSentence').onclick=()=>{state.sentenceIndex=(state.sentenceIndex+1)%t.sentences.length;openTopic(id)}}
function bindHunt(t,id){$('#huntSpeak').onclick=()=>speak(`Can you find the ${state.huntTarget}?`,'en-US');$$('.hunt-item').forEach(b=>b.onclick=()=>{if(b.dataset.answer===state.huntTarget){$('#huntFeedback').textContent='✨ Great! '+state.huntTarget;speak(`Great! ${state.huntTarget}.`,'en-US');setTimeout(()=>openTopic(id),900)}else{$('#huntFeedback').textContent='Try again!';speak('Try again!','en-US')}})}
function renderBadges(byWorld,total){
  const defs=[
    ['🌟','First Discovery',total>=1,'Buka topik pertama'],
    ['🌌','Space Explorer',(byWorld.space||0)>=5,'Teroka 5 topik angkasa'],
    ['🦁','Safari Explorer',(byWorld.animals||0)>=5,'Teroka 5 haiwan'],
    ['🗣️','Word Collector',(byWorld.english||0)>=4,'Teroka 4 modul English'],
    ['🧭','Curious Mind',Object.keys(byWorld).length>=5,'Teroka 5 dunia berbeza']
  ];
  return `<div style="grid-column:1/-1"><div class="section-head"><div><span class="eyebrow">BADGES</span><h2>Achievement kamu</h2></div></div><div class="stats-grid">${defs.map(b=>`<div class="stat-card" style="opacity:${b[2]?1:.45}"><strong>${b[0]}</strong><b>${b[1]}</b><small style="display:block;margin-top:5px">${b[2]?'Unlocked ✨':b[3]}</small></div>`).join('')}</div><div class="section-head" style="margin-top:22px"><div><span class="eyebrow">COLLECTION</span><h2>Penemuan</h2></div></div></div>`;
}
function renderDiscovery(){
  setView('discovery');$$('.nav-item[data-nav="book"]').forEach(n=>n.classList.add('active'));
  const entries=state.discoveries.map(id=>[id,TEROKA_DATA.topics[id]]).filter(x=>x[1]),items=entries.map(x=>x[1]),byWorld={};
  items.forEach(t=>byWorld[t.world]=(byWorld[t.world]||0)+1);
  $('#discoveryStats').innerHTML=`<div class="stat-card"><strong>${items.length}</strong><small>Total discoveries</small></div><div class="stat-card"><strong>${Object.keys(byWorld).length}</strong><small>Worlds explored</small></div><div class="stat-card"><strong>${byWorld.english||0}</strong><small>English discoveries</small></div><div class="stat-card"><strong>${Math.round(items.length/Object.keys(TEROKA_DATA.topics).length*100)}%</strong><small>Collection progress</small></div>`;
  $('#discoveryGrid').innerHTML=renderBadges(byWorld,items.length)+(entries.length?entries.map(([id,t])=>`<button class="discovery-item" data-topic="${id}"><span class="emoji">${t.icon}</span><h4>${t.ms||t.name}</h4><small>${t.name}</small></button>`).join(''):`<div class="info-panel" style="grid-column:1/-1"><h2>Discovery Book masih kosong</h2><p>Teroka mana-mana world dan setiap topik yang kamu buka akan masuk ke sini.</p></div>`);
  bindDynamic();
}
function openSettings(){updateSettingUI();$('#settingsDialog').showModal()}
function updateSettingUI(){$$('#ageOptions button').forEach(b=>b.classList.toggle('active',b.dataset.age===state.age));$$('#languageOptions button').forEach(b=>b.classList.toggle('active',b.dataset.language===state.language));$('#audioToggle').setAttribute('aria-pressed',String(state.audio))}
function doSearch(q){q=q.trim().toLowerCase();const r=Object.entries(TEROKA_DATA.topics).filter(([id,t])=>[id,t.name,t.ms,t.short].join(' ').toLowerCase().includes(q)).slice(0,16);$('#searchResults').innerHTML=q?(r.length?r.map(([id,t])=>`<button class="search-result" data-search-topic="${id}"><span class="emoji">${t.icon}</span><div><b>${displayName(t)}</b><small>${worldMap[t.world]?.name||''} · ${t.short||''}</small></div></button>`).join(''):`<p style="color:var(--muted)">Tak jumpa. Cuba perkataan lain.</p>`):'';$$('[data-search-topic]').forEach(b=>b.onclick=()=>{$('#searchDialog').close();openTopic(b.dataset.searchTopic)})}

$('#brandBtn').onclick=renderHome;$('#continueBtn').onclick=()=>openWorld('space');$('#surpriseBtn').onclick=()=>{const ids=Object.keys(TEROKA_DATA.topics);openTopic(ids[Math.floor(Math.random()*ids.length)])};$('#showAllBtn').onclick=()=>$('#worldGrid').scrollIntoView({behavior:'smooth'});$('#openDiscoveryBtn').onclick=renderDiscovery;$('#settingsBtn').onclick=openSettings;$('#searchBtn').onclick=()=>{$('#searchDialog').showModal();setTimeout(()=>$('#searchInput').focus(),100)};$('#closeSearchBtn').onclick=()=>$('#searchDialog').close();$('#searchInput').oninput=e=>doSearch(e.target.value);$$('[data-back="home"]').forEach(b=>b.onclick=renderHome);$$('[data-back="world"]').forEach(b=>b.onclick=()=>openWorld(state.currentWorld));$$('.nav-item').forEach(n=>n.onclick=()=>{const x=n.dataset.nav;if(x==='home')renderHome();else if(x==='explore')openWorld('space');else if(x==='english')openWorld('english');else renderDiscovery()});$$('#ageOptions button').forEach(b=>b.onclick=()=>{state.age=b.dataset.age;save();updateSettingUI();showToast('Tahap penerangan dikemaskini')});$$('#languageOptions button').forEach(b=>b.onclick=()=>{state.language=b.dataset.language;save();updateSettingUI();renderHome();showToast('Bahasa dikemaskini')});$('#audioToggle').onclick=()=>{state.audio=!state.audio;save();updateSettingUI()};$('#resetProgressBtn').onclick=()=>{state.discoveries=[];state.topicProgress={};save();renderHomeDiscovery();showToast('Progress telah direset')};
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredPrompt=e;$('#installBtn').classList.remove('hidden')});$('#installBtn').onclick=async()=>{if(!state.deferredPrompt)return;state.deferredPrompt.prompt();await state.deferredPrompt.userChoice;state.deferredPrompt=null;$('#installBtn').classList.add('hidden')};window.addEventListener('appinstalled',()=>showToast('TerokaKu installed ✨'));
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
renderHome();
