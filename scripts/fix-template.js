'use strict';

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'out', 'html', 'index.html');
if (!fs.existsSync(indexPath)) {
  throw new Error('Generated page not found: out/html/index.html');
}
let html = fs.readFileSync(indexPath, 'utf8');

/* Keep the three sidebar tabs used by this game. */
html = html.replace(
  /\s*<button\b(?=[^>]*\bid=["']paramilitary_tab["'])[^>]*>[\s\S]*?<\/button>/i,
  ''
);
for (const id of ['main_tab', 'politics_tab', 'poll_tab']) {
  if (!html.includes('id="' + id + '"')) {
    throw new Error('Expected sidebar tab "' + id + '" is missing from generated HTML.');
  }
}
if (/\bid=["']paramilitary_tab["']/.test(html)) {
  throw new Error('The unused Defense tab was not removed.');
}

/* Remove previous patch versions, then add one clean title-menu implementation. */
html = html.replace(/<style id=["']anni-title-screen-style["']>[\s\S]*?<\/style>/gi, '');
html = html.replace(/<script id=["']anni-title-screen-script["']>[\s\S]*?<\/script>/gi, '');

const styles = [
  "<style id='anni-title-screen-style'>",
  "html,body{min-height:100%}",
  "body{color:#30251d;background:#30251d url('https://upload.wikimedia.org/wikipedia/commons/7/7c/Quarto_Stato.jpg') center center/cover fixed no-repeat}",
  "body.anni-title-screen{margin:0;color:#35251b;background:#332a21 url('https://upload.wikimedia.org/wikipedia/commons/7/7c/Quarto_Stato.jpg') center center/cover fixed no-repeat!important}",
  "body.anni-title-screen header h1,body.anni-title-screen header h2{display:none!important}",
  "body.anni-title-screen #tools_wrapper{display:none!important}",
  "body.anni-title-screen #mid_panel{width:100%;max-width:780px;margin:0 auto!important;padding:12px 16px 28px;box-sizing:border-box}",
  "body.anni-title-screen #content{width:100%;max-width:740px;margin:0 auto;padding:10px 12px 22px;box-sizing:border-box;background:transparent;border:0;box-shadow:none;text-align:center}",
  "body.anni-title-screen .anni-menu-panel{width:100%;max-width:660px;margin:14px auto 26px;padding:20px 22px 24px;box-sizing:border-box;text-align:center;background:rgba(245,235,213,.94);border:2px solid #76543a;box-shadow:0 8px 24px rgba(0,0,0,.34)}",
  "body.anni-title-screen .anni-menu-title{display:block;margin:0 0 14px;color:#4a2019;font:bold clamp(2rem,5vw,3.25rem)/1.08 Georgia,'Times New Roman',serif;letter-spacing:.045em;text-transform:uppercase;text-shadow:0 1px 0 rgba(255,246,221,.75)}",
  "body.anni-title-screen .anni-banner{display:block;width:100%;max-width:590px;height:auto;max-height:330px;object-fit:cover;margin:0 auto 18px;padding:4px;box-sizing:border-box;background:#f2e6ca;border:2px solid #5b3d2c;box-shadow:0 3px 12px rgba(0,0,0,.32)}",
  "body.anni-title-screen #content ul.choices{display:block;width:100%;max-width:none;margin:0 auto;padding:0;list-style:none;background:rgba(255,250,235,.48);border:1px solid #9b7956;border-radius:0;box-shadow:none;box-sizing:border-box}",
  "body.anni-title-screen #content ul.choices li{margin:0;padding:12px 16px;border-top:1px solid rgba(115,83,60,.42);text-align:center}",
  "body.anni-title-screen #content ul.choices li:first-child{border-top:0}",
  "body.anni-title-screen #content ul.choices li a{color:#922923;font:bold 1.15rem Georgia,'Times New Roman',serif;text-decoration:none}",
  "body.anni-title-screen #content ul.choices li:hover{background:rgba(220,202,165,.58)}",
  "@media(max-width:700px){body{background-attachment:scroll}body.anni-title-screen #mid_panel{padding:8px}body.anni-title-screen #content{padding:8px 4px 18px}body.anni-title-screen .anni-menu-panel{padding:16px 12px 18px}body.anni-title-screen .anni-banner{max-height:250px}}",
  "</style>"
].join('\n');

const script = [
  "<script id='anni-title-screen-script'>",
  "(function(){",
  "  function syncTitleMenu(){",
  "    var content=document.getElementById('content');",
  "    if(!content)return;",
  "    var choices=content.querySelector('ul.choices');",
  "    if(!choices){document.body.classList.remove('anni-title-screen');return;}",
  "    var labels=Array.prototype.map.call(choices.querySelectorAll('a'),function(a){return (a.textContent||'').trim().toLowerCase();});",
  "    var isTitle=labels.indexOf('start campaign')!==-1 && labels.indexOf('credits')!==-1 && labels.indexOf('achievements')!==-1;",
  "    document.body.classList.toggle('anni-title-screen',isTitle);",
  "    if(!isTitle)return;",
  "    var panel=content.querySelector('.anni-menu-panel');",
  "    if(!panel){panel=document.createElement('section');panel.className='anni-menu-panel';choices.parentNode.insertBefore(panel,choices);}",
  "    var title=panel.querySelector('.anni-menu-title');",
  "    if(!title){title=document.createElement('h1');title.className='anni-menu-title';title.textContent='ANNI DI PIOMBO';}",
  "    var banner=panel.querySelector('.anni-banner');",
  "    if(!banner){banner=document.createElement('img');banner.className='anni-banner';banner.src='https://commons.wikimedia.org/wiki/Special:FilePath/Anni_di_piombo2.jpg';banner.alt='Giuseppe Memeo during the Via De Amicis clashes in Milan, 1977. Photograph by Paolo Pedrizzetti.';banner.loading='eager';}",
  "    if(title.parentNode!==panel)panel.appendChild(title);",
  "    if(banner.parentNode!==panel)panel.appendChild(banner);",
  "    if(choices.parentNode!==panel)panel.appendChild(choices);",
  "    if(panel.parentNode!==content)content.insertBefore(panel,choices);",
  "  }",
  "  function install(){",
  "    syncTitleMenu();",
  "    var content=document.getElementById('content');",
  "    if(content && typeof MutationObserver!=='undefined'){",
  "      var observer=new MutationObserver(syncTitleMenu);",
  "      observer.observe(content,{childList:true,subtree:true});",
  "    }",
  "  }",
  "  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',install,{once:true});}",
  "  else{install();}",
  "  window.addEventListener('load',syncTitleMenu);",
  "})();",
  "</script>"
].join('\n');

if (!html.includes('</head>')) throw new Error('Generated HTML has no closing </head> tag.');
if (!html.includes('</body>')) throw new Error('Generated HTML has no closing </body> tag.');
html = html.replace('</head>', styles + '\n</head>');
html = html.replace('</body>', script + '\n</body>');


/* Germany-to-Save-inspired campaign layout. Native scenes and card mechanics remain unchanged. */
html = html.replace(/<style id=["']anni-game-layout-style["']>[\s\S]*?<\/style>/gi, '');
html = html.replace(/<script id=["']anni-game-layout-script["']>[\s\S]*?<\/script>/gi, '');

const gameplayStyles = `
<style id="anni-game-layout-style">
body.anni-campaign-active {
  color:#382d20!important;
  background:#d8ceb9 url('https://commons.wikimedia.org/wiki/Special:FilePath/Map_of_Italy_-_1905.jpg') center center/cover fixed no-repeat!important;
}
body.anni-campaign-active .background { background:transparent!important; background-image:none!important; }
body.anni-campaign-active header {
  position:fixed; z-index:20; top:0; left:0; right:0; width:100%; max-width:none;
  box-sizing:border-box; padding:.3rem .8rem .4rem; margin:0; text-align:center;
  background:#eee8d9; border-bottom:1px solid #8f846f;
}
body.anni-campaign-active header h1,body.anni-campaign-active header h2 { display:none!important; }
body.anni-campaign-active #header-links {
  float:none; display:flex; align-items:center; justify-content:center; flex-wrap:wrap;
  gap:.25rem 1.1rem; margin:0; text-align:center; line-height:1.45;
}
body.anni-campaign-active #header-links a {
  padding:0 .15rem; color:#8e211b; font-weight:bold; white-space:nowrap; text-decoration:none;
}
body.anni-campaign-active #header-links a:hover { color:#315f79; text-decoration:underline; }
body.anni-campaign-active #mid_panel {
  width:36rem; max-width:calc(100vw - 34rem); min-width:28rem;
  box-sizing:border-box; margin:0 auto; padding:2.85rem 0 2rem;
}
body.anni-campaign-active #tools_wrapper {
  position:absolute; z-index:5; top:2.85rem; left:50%; right:auto;
  width:min(76rem,calc(100vw - 2rem)); max-width:none; height:1px;
  margin:0; padding:0; transform:translateX(-50%); pointer-events:none;
}
body.anni-campaign-active #stats_sidebar {
  position:absolute; top:0; left:0; float:none; width:17rem;
  max-height:calc(100vh - 5rem); overflow:auto; box-sizing:border-box; padding:.65rem;
  color:#3d3021; background:#eeeadd;
  border:1px solid #9e927c; box-shadow:none;
  pointer-events:auto;
}
body.anni-campaign-active #stats_sidebar .tab_container {
  display:flex; flex-wrap:wrap; margin:-.65rem -.65rem .7rem; background:#dedbd4;
}
body.anni-campaign-active #stats_sidebar .tab_button {
  flex:1 0 25%; min-width:0; padding:.48rem .2rem; color:#403322;
  font-size:.91rem; line-height:1.2; background:#e3e0da;
  border:0; border-bottom:1px solid rgba(95,79,57,.22); cursor:pointer;
}
body.anni-campaign-active #stats_sidebar .tab_button.active {
  background:#f7f4ec; box-shadow:inset 0 -2px 0 #a18a62;
}
body.anni-campaign-active #stats_sidebar .tab_button:hover { background:#f2eee5; }
body.anni-campaign-active #qualities { font-size:.94rem; line-height:1.35; overflow-wrap:anywhere; }
body.anni-campaign-active #qualities h1,body.anni-campaign-active #qualities h2 {
  color:#4b3824; font-family:Georgia,"Times New Roman",serif;
}
body.anni-campaign-active #qualities p { margin:0 0 .8rem; text-indent:0; }
body.anni-campaign-active #qualities img {
  display:block; width:100%; height:auto; margin:.5rem auto;
  border:1px solid #b9ad98; box-shadow:0 2px 7px rgba(0,0,0,.15);
}
body.anni-campaign-active #anni-news-panel {
  position:absolute; top:0; right:0; float:none; width:17rem;
  max-height:calc(100vh - 5rem); overflow:auto; box-sizing:border-box;
  padding:.85rem .9rem 1rem; color:#292521; background:#f1ecdf;
  border:1px solid #9e927c; box-shadow:none;
  font-family:Georgia,"Times New Roman",serif; line-height:1.38; pointer-events:auto;
}
body.anni-campaign-active .anni-paper-masthead {
  margin:0 0 .25rem; color:#33291f; font:italic 1.7rem/1.05 Georgia,"Times New Roman",serif;
  text-align:center; letter-spacing:0;
}
body.anni-campaign-active .anni-paper-kicker {
  margin:0 0 .55rem; color:#62594b; font-size:.62rem; font-style:normal; font-variant:small-caps;
  letter-spacing:.07em; text-align:center;
}
body.anni-campaign-active .anni-paper-rule { height:1px; margin:.5rem 0 .8rem; background:#8e806b; border:0; }
body.anni-campaign-active .anni-paper-date {
  margin:0 0 .7rem; color:#806b4b; font-size:.77rem; font-weight:bold;
  text-align:center; text-transform:uppercase; letter-spacing:.08em;
}
body.anni-campaign-active .anni-paper-headline {
  margin:.35rem 0 .55rem; color:#28231d; font-size:1.16rem;
  font-weight:bold; line-height:1.16; text-align:left;
}
body.anni-campaign-active .anni-paper-copy { margin:0 0 .75rem; font-size:.91rem; line-height:1.38; text-indent:.8rem; }
body.anni-campaign-active .anni-paper-mark {
  margin:.8rem 0 0; color:#8d241c; font-size:1.65rem; font-weight:bold; text-align:center; letter-spacing:.08em;
}
body.anni-campaign-active #anni-party-profile {
  width:100%; max-width:40rem; box-sizing:border-box; margin:0 auto .65rem; padding:.55rem 1rem .7rem;
  color:#3b2d1c; background:#efede5; border:1px solid #a69b88;
  box-shadow:none; text-align:center;
}
body.anni-campaign-active .anni-profile-title {
  margin:0 0 .4rem; color:#42311f; font-size:1.26rem; font-weight:normal; line-height:1.25;
}
body.anni-campaign-active .anni-profile-title span { color:#3d84a8; font-weight:bold; }
body.anni-campaign-active .anni-profile-photo {
  display:block; width:auto; height:10.5rem; max-width:10rem; margin:.35rem auto .4rem;
  padding:3px; object-fit:contain; background:#f3efe5; border:1px solid #716957;
  filter:none; box-shadow:none;
}
body.anni-campaign-active .anni-profile-name { margin:.2rem 0 0; font-size:1.03rem; font-weight:bold; }
body.anni-campaign-active .anni-profile-role { margin:.05rem 0 0; color:#77716a; font-size:.9rem; font-style:italic; }
body.anni-campaign-active #content {
  width:100%; max-width:none; box-sizing:border-box; margin:0 auto; padding:.9rem 1.35rem 1.3rem;
  color:#403322; background:#efede6; border:1px solid #a69b88;
  box-shadow:none;
}
body.anni-campaign-active #content h1 {
  margin-top:.25rem; color:#44321e; font-family:Georgia,"Times New Roman",serif; letter-spacing:.05em;
}
body.anni-campaign-active #content h2 {
  margin:.1rem 0 .7rem; padding:0 0 .6rem; color:#6b5b43;
  border-bottom:1px solid #b6ab99; font-size:1rem; font-weight:normal; text-align:center;
}
body.anni-campaign-active #content h2.anni-date-heading {
  margin:0 0 .65rem; padding:.15rem 0 .55rem; color:#49351f;
  font:bold 1.45rem/1.2 Georgia,"Times New Roman",serif;
  border-bottom:1px solid #b6ab99; text-align:center; letter-spacing:.025em;
}
body.anni-campaign-active #content p { text-indent:0; }
body.anni-campaign-active #content ul.decks,
body.anni-campaign-active #content ul.hand,
body.anni-campaign-active #content ul.pinned-cards {
  margin:.55rem 0 .9rem; padding:0; border:0;
}
body.anni-campaign-active #content a.card {
  border:7px solid #c8c2b6; box-shadow:1px 1px 2px rgba(45,36,24,.12);
}
body.anni-campaign-active #content a.card:hover {
  left:0; top:0; box-shadow:1px 1px 2px rgba(45,36,24,.12);
}
body.anni-campaign-active #content div.blank-card {
  background:#e0ddd5; border:7px solid #c8c2b6;
}
body.anni-campaign-active #content .card-caption {
  color:#403322; font-family:Georgia,"Times New Roman",serif; font-size:.92rem;
}

body.anni-campaign-active #anni-advisors {
  margin:1.1rem -1.35rem -1.3rem; padding:.7rem 1rem .9rem;
  color:#403322; background:#e6e3d9; border-top:1px solid #b8ae9a; text-align:center;
}
body.anni-campaign-active .anni-advisors-title { margin:0 0 .35rem; font-size:1.08rem; font-weight:bold; font-variant:small-caps; letter-spacing:.04em; }
body.anni-campaign-active .anni-advisor-meter {
  display:grid; grid-template-columns:repeat(4,1fr); gap:2px; height:8px;
  margin:0 auto .35rem; padding:1px; background:#eee9dd; border:1px solid #8a806c;
}
body.anni-campaign-active .anni-advisor-meter span { background:#8f897a; }
body.anni-campaign-active .anni-advisor-meter span:nth-child(4) { background:#164f3a; }
body.anni-campaign-active .anni-advisor-availability {
  display:grid; grid-template-columns:repeat(4,1fr); gap:.2rem; margin:0 0 .65rem;
  color:#625a4c; font-size:.67rem; font-variant:small-caps; letter-spacing:.03em;
}
body.anni-campaign-active .anni-advisor-grid {
  display:flex; flex-wrap:wrap; align-items:flex-start; justify-content:center; gap:.8rem 1rem;
}
body.anni-campaign-active .anni-advisor { width:7rem; margin:0; text-align:center; }
body.anni-campaign-active .anni-advisor img {
  display:block; width:auto; height:8rem; max-width:6.4rem; box-sizing:border-box; margin:0 auto .28rem;
  padding:3px; object-fit:contain; background:#f2eee4; border:1px solid #746b5d;
  box-shadow:none; filter:none;
}
body.anni-campaign-active .anni-advisor figcaption { font-variant:small-caps; }
body.anni-campaign-active .anni-advisor figcaption { color:#403322; font-size:.84rem; line-height:1.15; }
body.anni-campaign-active .anni-advisor-role { margin-top:.12rem; color:#746a59; font-size:.68rem; font-style:italic; }
body.anni-campaign-active .anni-image-credits { margin:.7rem 0 0; color:#756b5a; font-size:.65rem; line-height:1.35; }
body.anni-campaign-active .anni-image-credits a { color:#5c7683; }
body.anni-title-screen #header-links { display:none!important; }
@media screen and (max-width:960px) {
  body.anni-campaign-active #mid_panel {
    width:min(46rem,calc(100vw - 2rem)); min-width:0; max-width:none; padding-top:2.85rem;
  }
  body.anni-campaign-active #tools_wrapper {
    position:static; display:flex; align-items:flex-start; justify-content:center; flex-wrap:wrap;
    gap:.8rem; width:min(46rem,calc(100vw - 2rem)); height:auto; margin:.2rem auto .8rem; transform:none;
  }
  body.anni-campaign-active #stats_sidebar,
  body.anni-campaign-active #anni-news-panel {
    position:static; width:min(21.8rem,calc(50% - .4rem)); max-height:none; margin:0;
  }
  body.anni-campaign-active #anni-party-profile { max-width:none; }
}
@media screen and (max-width:640px) {
  body.anni-campaign-active #mid_panel { width:calc(100% - .75rem); padding-top:3.6rem; }
  body.anni-campaign-active #tools_wrapper { display:block; width:100%; }
  body.anni-campaign-active #stats_sidebar,
  body.anni-campaign-active #anni-news-panel { width:100%; max-height:none; margin:0 0 .7rem; }
  body.anni-campaign-active #content { padding:.8rem .8rem 1.1rem; }
  body.anni-campaign-active #anni-advisors { margin:1rem -.8rem -1.1rem; padding:.75rem .45rem .9rem; }
  body.anni-campaign-active .anni-advisor { width:6.3rem; }
  body.anni-campaign-active .anni-advisor img { width:5.8rem; height:7.5rem; }
  body.anni-campaign-active .anni-paper-headline { font-size:1.05rem; }
}
</style>
`;

const gameplayScript = `
<script id="anni-game-layout-script">
(function () {
  'use strict';
  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var italianMonthNames = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
  var advisors = [
    {name:'Enrico Berlinguer',role:'Direzione',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Enrico_Berlinguer.jpg',source:'https://commons.wikimedia.org/wiki/File:Enrico_Berlinguer.jpg'},
    {name:'Giorgio Amendola',role:'Direzione',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Giorgio_Amendola_1969.jpg',source:'https://commons.wikimedia.org/wiki/File:Giorgio_Amendola_1969.jpg'},
    {name:'Pietro Ingrao',role:'Parlamento',image:'https://commons.wikimedia.org/wiki/Special:FilePath/PietroIngrao.jpg',source:'https://commons.wikimedia.org/wiki/File:PietroIngrao.jpg'},
    {name:'Nilde Iotti',role:'Parlamento',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Leonilde_Iotti.jpg',source:'https://commons.wikimedia.org/wiki/File:Leonilde_Iotti.jpg'}
  ];
  function sceneId() {
    try {
      var id = window.dendryUI.dendryEngine.state.sceneId;
      return typeof id === 'string' ? id : String(id || '');
    } catch (e) { return ''; }
  }
  function isCampaign(scene) {
    var excluded=['root','main','main.title_screen','main.party_select','main.pci_easy_start','main.pci_start','main.pci_hard_start','main.main_menu','main.credits'];
    return !!scene && excluded.indexOf(scene)===-1 && scene.indexOf('status.')!==0;
  }
  function dateInfo() {
    try {
      var q=window.dendryUI.dendryEngine.state.qualities || {};
      var month=Number(q.month)||1;
      var year=Number(q.year)||1968;
      month=Math.max(1,Math.min(12,month));
      return {month:month,monthName:monthNames[month-1],year:year};
    } catch(e) {
      return {month:1,monthName:'January',year:1968};
    }
  }
  function storyFor(d) {
    var y=d.year,m=d.month;
    if(y===1968&&m<=5)return ['Il PCI rilancia la sua battaglia','L’Italia si avvicina alle elezioni politiche di maggio, mentre crescono le proteste studentesche e le rivendicazioni del movimento operaio. Il Partito Comunista punta a trasformare il proprio radicamento sociale in una maggiore rappresentanza parlamentare.'];
    if(y===1968)return ['Il voto conferma il PCI come principale forza di opposizione','La Democrazia Cristiana resta il primo partito dopo le elezioni di maggio. Il PCI consolida il proprio ruolo di principale forza di opposizione e si prepara a rafforzare il dialogo con i lavoratori e le forze democratiche.'];
    if(y===1969)return ['L’autunno caldo scuote le fabbriche italiane','Una vasta stagione di scioperi e assemblee operaie rivendica salari più equi, migliori condizioni di lavoro e nuovi diritti. Il movimento sindacale imprime una svolta alla vita politica del Paese.'];
    if(y===1970)return ['Lo Statuto dei lavoratori diventa legge','Il Parlamento approva lo Statuto dei lavoratori, riconoscendo importanti tutele conquistate dopo anni di mobilitazione. Si apre ora la sfida della sua piena applicazione in tutti i luoghi di lavoro.'];
    if(y===1973)return ['La crisi petrolifera mette sotto pressione l’economia','L’aumento dei costi energetici minaccia la produzione industriale e il potere d’acquisto delle famiglie. Governo, sindacati e imprese sono chiamati a confrontarsi su salari, prezzi e politiche economiche.'];
    if(y===1974)return ['Il referendum sul divorzio segna una svolta','Gli italiani respingono l’abrogazione della legge sul divorzio. Il risultato conferma la forza delle posizioni laiche e progressiste e apre una nuova fase nel dibattito civile del Paese.'];
    if(y===1976)return ['Il PCI raggiunge un risultato elettorale storico','Le elezioni di giugno portano il Partito Comunista a un risultato senza precedenti. Si riaccende il confronto sulla collaborazione parlamentare e sulle prospettive di una nuova stagione politica.'];
    if(y===1978&&m<=4)return ['Il sequestro Moro sconvolge la Repubblica','Le Brigate Rosse hanno rapito l’ex presidente del Consiglio Aldo Moro e ucciso cinque uomini della sua scorta. Il Paese affronta una crisi drammatica e le istituzioni democratiche sono sottoposte a una prova durissima.'];
    if(y===1978)return ['L’Italia piange Aldo Moro','Dopo cinquantacinque giorni di prigionia, Aldo Moro è stato assassinato. Il delitto lascia una ferita profonda nella vita nazionale e rinnova il confronto sulla difesa della democrazia contro il terrorismo.'];
    if(y===1980&&m>=8)return ['La strage di Bologna colpisce il Paese','L’esplosione alla stazione di Bologna ha provocato ottantacinque vittime. Crescono le richieste di verità e giustizia mentre l’Italia affronta una delle più gravi stragi della sua storia repubblicana.'];
    if(y===1981)return ['Lo scandalo P2 scuote le istituzioni','La scoperta degli elenchi della loggia P2 rivela una rete clandestina con legami in ambienti influenti dello Stato e della politica. Si rafforzano le richieste di trasparenza e di riforma istituzionale.'];
    if(y===1983)return ['Si apre una nuova stagione politica','Le elezioni di giugno indeboliscono la Democrazia Cristiana e portano alla formazione di un nuovo governo. Il PCI valuta il proprio ruolo dopo quindici anni di profondi cambiamenti politici e sociali.'];
    return ['La Repubblica affronta un nuovo mese di tensioni','Le difficoltà economiche, le richieste sociali e la violenza politica continuano a segnare la vita del Paese. La direzione del PCI deve conciliare la strategia parlamentare con le aspettative dei propri iscritti, degli alleati e degli elettori.'];
  }
  function addTabs() {
    var c=document.querySelector('#stats_sidebar .tab_container');
    if(!c)return;
    var poll=document.getElementById('poll_tab');
    if(!document.getElementById('mission_tab')){
      var m=document.createElement('button');m.type='button';m.className='tab_button';m.id='mission_tab';m.textContent='Mission';
      m.onclick=function(){window.changeTab('status.mission','mission_tab');};
      if(poll)c.insertBefore(m,poll);else c.appendChild(m);
    }
    [{id:'government_tab',label:'Government',target:'status.government'},{id:'map_tab',label:'Map',target:'status.map'}].forEach(function(x){
      if(document.getElementById(x.id))return;
      var b=document.createElement('button');b.type='button';b.className='tab_button';b.id=x.id;b.textContent=x.label;
      b.onclick=function(){window.changeTab(x.target,x.id);};c.appendChild(b);
    });
  }
  function addHeaderLinks() {
    var c=document.getElementById('header-links');if(!c)return;
    if(!document.getElementById('anni-library-link')){
      var a=document.createElement('a');a.id='anni-library-link';a.href='#';a.textContent='Library';
      a.onclick=function(e){if(e)e.preventDefault();window.changeTab('status.mission','mission_tab');return false;};c.insertBefore(a,c.firstChild);
    }
    if(!document.getElementById('anni-achievements-link')){
      var a2=document.createElement('a');a2.id='anni-achievements-link';a2.href='#';a2.textContent='Achievements';
      a2.onclick=function(e){if(e)e.preventDefault();window.dendryUI.dendryEngine.goToScene('main.achievements');return false;};c.appendChild(a2);
    }
    if(!document.getElementById('anni-new-game-link')){
      var a3=document.createElement('a');a3.id='anni-new-game-link';a3.href='#';a3.textContent='New Game';
      a3.onclick=function(e){if(e)e.preventDefault();window.dendryUI.dendryEngine.goToScene('main.title_screen');return false;};c.appendChild(a3);
    }
  }
  function addDateHeading(d) {
    var c=document.getElementById('content');if(!c)return;
    var heading=document.getElementById('anni-date-heading');
    if(!heading){heading=document.createElement('h2');heading.id='anni-date-heading';heading.className='anni-date-heading';}
    heading.textContent=d.monthName+' '+d.year;
    if(heading.parentNode!==c || heading!==c.firstElementChild)c.insertBefore(heading,c.firstChild);
  }
  function addPaper(d) {
    var w=document.getElementById('tools_wrapper');if(!w)return;
    var p=document.getElementById('anni-news-panel');
    if(!p){p=document.createElement('aside');p.id='anni-news-panel';p.className='tools right';w.appendChild(p);}
    var key=d.month+'-'+d.year;
    if(p.getAttribute('data-date')===key)return;
    p.setAttribute('data-date',key);
    var story=storyFor(d);
    p.innerHTML='<div class="anni-paper-masthead">l’Unità</div><div class="anni-paper-kicker">Quotidiano del Partito Comunista Italiano</div><hr class="anni-paper-rule"><div class="anni-paper-date">Roma · '+italianMonthNames[d.month-1]+' '+d.year+'</div><div class="anni-paper-headline">'+story[0]+'</div><p class="anni-paper-copy">'+story[1]+'</p><p class="anni-paper-copy">La direzione comunista valuta le prossime iniziative a difesa delle istituzioni democratiche, dei diritti dei lavoratori e della libertà politica.</p><hr class="anni-paper-rule"><div class="anni-paper-kicker">Il quotidiano fondato da Antonio Gramsci</div><div class="anni-paper-mark">☭</div>';
  }
  function addProfile(d) {
    var c=document.getElementById('content');if(!c)return;
    var p=document.getElementById('anni-party-profile');
    if(!p){p=document.createElement('section');p.id='anni-party-profile';c.parentNode.insertBefore(p,c);}
    var leader=d.year<1972?{name:'Luigi Longo',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Luigi_Longo_1968.jpg'}:{name:'Enrico Berlinguer',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Enrico_Berlinguer.jpg'};
    if(p.getAttribute('data-leader')===leader.name)return;
    p.setAttribute('data-leader',leader.name);
    p.innerHTML='<div class="anni-profile-title">Partito Comunista Italiano <span>(PCI)</span></div><img class="anni-profile-photo" src="'+leader.image+'" alt="'+leader.name+'" loading="lazy"><div class="anni-profile-name">'+leader.name+'</div><div class="anni-profile-role">Segretario generale del PCI</div>';
  }
  function addAdvisors(scene) {
    var c=document.getElementById('content');if(!c)return;
    var p=document.getElementById('anni-advisors');
    if(p){
      if(p.parentNode!==c || p!==c.lastElementChild)c.appendChild(p);
      return;
    }
    p=document.createElement('section');p.id='anni-advisors';p.setAttribute('data-scene',scene);
    var portraits=advisors.map(function(x){return '<figure class="anni-advisor"><img src="'+x.image+'" alt="'+x.name+'" loading="lazy"><figcaption>'+x.name+'</figcaption><div class="anni-advisor-role">'+x.role+'</div></figure>';}).join('');
    var refs=advisors.map(function(x){return '<a href="'+x.source+'" target="_blank" rel="noopener">'+x.name+'</a>';}).join(' · ');
    p.innerHTML='<div class="anni-advisors-title">Dirigenti del partito</div><div class="anni-advisor-meter"><span></span><span></span><span></span><span></span></div><div class="anni-advisor-availability"><span>Direzione</span><span>Direzione</span><span>Parlamento</span><span>Parlamento</span></div><div class="anni-advisor-grid">'+portraits+'</div><div class="anni-image-credits">Ritratti d’archivio: '+refs+'. Fonti e licenze sulle schede fotografiche.</div>';
    c.appendChild(p);
  }
  function sync() {
    var s=sceneId(),active=isCampaign(s);
    document.body.classList.toggle('anni-campaign-active',active);
    if(!active){
      ['anni-party-profile','anni-news-panel','anni-advisors'].forEach(function(id){var e=document.getElementById(id);if(e&&e.parentNode)e.parentNode.removeChild(e);});
      return;
    }
    addTabs();addHeaderLinks();
    var d=dateInfo();addDateHeading(d);addPaper(d);addProfile(d);addAdvisors(s);
  }
  function hookEngineNavigation(engine) {
    try {
      engine = engine || (window.dendryUI && window.dendryUI.dendryEngine);
      if (engine && typeof engine.goToScene === 'function' && !engine.__anniLayoutHooked) {
        var originalGoToScene = engine.goToScene;
        engine.goToScene = function () {
          var result = originalGoToScene.apply(this, arguments);
          sync();
          return result;
        };
        engine.__anniLayoutHooked = true;
      }
    } catch (e) {
      // The game engine may not exist until DendryNexus initialises it.
    }
  }
  function hookDendryModifyUI() {
    if (typeof window.dendryModifyUI !== 'function' || window.__anniModifyUIHooked) return;
    var originalModifyUI = window.dendryModifyUI;
    window.dendryModifyUI = function (ui) {
      var result = originalModifyUI.apply(this, arguments);
      hookEngineNavigation(ui && ui.dendryEngine);
      sync();
      return result;
    };
    window.__anniModifyUIHooked = true;
  }
  function install() {
    hookDendryModifyUI();
    hookEngineNavigation();
    sync();
    var c=document.getElementById('content');
    if(c&&typeof MutationObserver!=='undefined'){
      var observer=new MutationObserver(function(){
        if(window.anniLayoutPending)return;
        window.anniLayoutPending=true;
        window.requestAnimationFrame(function(){sync();window.anniLayoutPending=false;});
      });
      observer.observe(c,{childList:true,subtree:true});
    }
    if(typeof window.onNewPage==='function'&&!window.__anniNewPageHooked){
      var oldNew=window.onNewPage;
      window.onNewPage=function(){oldNew.apply(this,arguments);sync();};
      window.__anniNewPageHooked=true;
    }
    if(typeof window.onDisplayContent==='function'&&!window.__anniDisplayHooked){
      var oldDisplay=window.onDisplayContent;
      window.onDisplayContent=function(){oldDisplay.apply(this,arguments);sync();};
      window.__anniDisplayHooked=true;
    }
    window.addEventListener('load',function(){hookDendryModifyUI();hookEngineNavigation();sync();});
  }
  // The generated game.js has already defined dendryModifyUI, but its ready
  // callback has not run yet. Wrapping it here lets us attach to the engine
  // before beginGame() renders the first scene.
  hookDendryModifyUI();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
</script>
`;

if (!html.includes('</head>') || !html.includes('</body>')) throw new Error('Generated page has no head/body closing tags.');
html = html.replace('</head>', gameplayStyles + '\n</head>');
html = html.replace('</body>', gameplayScript + '\n</body>');

/* The historical banner is loaded directly from Wikimedia Commons. */

/* Persist the modified HTML. Without this write, all injected changes are lost. */
fs.writeFileSync(indexPath, html, 'utf8');

const written = fs.readFileSync(indexPath, 'utf8');
if (!written.includes('anni-title-screen-style') || !written.includes('anni-title-screen-script')) {
  throw new Error('Title-menu modifications were not written into index.html.');
}
console.log('Title menu saved: title, historical Giuseppe Memeo banner and menu choices are in one panel.');
console.log('Sidebar configured: Main, Politics, Polls.');
