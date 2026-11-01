'use strict';

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'out', 'html', 'index.html');
if (!fs.existsSync(indexPath)) {
  throw new Error('Generated page not found: out/html/index.html');
}
let html = fs.readFileSync(indexPath, 'utf8');

const campaignAssetVersion = 'remove-svp-surname-leaders-20261101';

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
  "body.anni-title-screen{color:#30251d;background:#30251d url('https://upload.wikimedia.org/wikipedia/commons/7/7c/Quarto_Stato.jpg') center center/cover fixed no-repeat}",
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
  "@media(max-width:700px){body.anni-title-screen{background-attachment:scroll}body.anni-title-screen #mid_panel{padding:8px}body.anni-title-screen #content{padding:8px 4px 18px}body.anni-title-screen .anni-menu-panel{padding:16px 12px 18px}body.anni-title-screen .anni-banner{max-height:250px}}",
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
/* Keep the approved three-column structure; native DendryNexus CSS supplies the skin. */
body.anni-campaign-active {
  background: #f3f3e3 url('https://commons.wikimedia.org/wiki/Special:FilePath/Map_of_Italy_-_1905.jpg') center center / cover fixed no-repeat;
}
body.anni-campaign-active .background {
  background-color: transparent;
  background-image: none;
}

/* Top navigation: positioning only. */
body.anni-campaign-active header {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: none;
  box-sizing: border-box;
  margin: 0;
  padding: .25rem .8rem;
}
body.anni-campaign-active header h1,
body.anni-campaign-active header h2 { display: none; }
body.anni-campaign-active #header-links {
  display: flex;
  float: none;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: .25rem 1.1rem;
  margin: 0;
  text-align: center;
}

/* Three-column layout. Existing .tools and #content rules keep their native appearance. */
body.anni-campaign-active #mid_panel {
  width: 36rem;
  min-width: 28rem;
  max-width: calc(100vw - 34rem);
  box-sizing: border-box;
  margin: 0 auto;
  padding: 2.85rem 0 2rem;
}
body.anni-campaign-active #tools_wrapper {
  position: absolute;
  z-index: 5;
  top: 2.85rem;
  left: 50%;
  right: auto;
  width: min(76rem, calc(100vw - 2rem));
  max-width: none;
  height: 1px;
  margin: 0;
  padding: 0;
  transform: translateX(-50%);
  pointer-events: none;
}
body.anni-campaign-active #stats_sidebar {
  position: absolute;
  top: 0;
  left: 0;
  float: none;
  max-height: calc(100vh - 5rem);
  overflow: auto;
  pointer-events: auto;
}


/* Party profile keeps the framework's native .tools panel appearance. */
body.anni-campaign-active #anni-party-profile {
  width: 100%;
  max-width: 40rem;
  box-sizing: border-box;
  margin: 0 auto .65rem;
  text-align: center;
}
body.anni-campaign-active .anni-profile-photo {
  display: block;
  width: auto;
  height: 10.5rem;
  max-width: 10rem;
  margin: .35rem auto .4rem;
  object-fit: contain;
}
body.anni-campaign-active #content {
  width: 100%;
  max-width: none;
  box-sizing: border-box;
  margin: 0 auto;
}
body.anni-campaign-active #content h2.anni-date-heading { text-align: center; }
body.anni-campaign-active #content ul.decks,
body.anni-campaign-active #content ul.hand,
body.anni-campaign-active #content ul.pinned-cards {
  margin: .55rem 0 .9rem;
  padding: 0;
}
@media screen and (max-width: 960px) {
  body.anni-campaign-active #mid_panel {
    width: min(46rem, calc(100vw - 2rem));
    min-width: 0;
    max-width: none;
    padding-top: 2.85rem;
  }
  body.anni-campaign-active #tools_wrapper {
    position: static;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-wrap: wrap;
    gap: .8rem;
    width: min(46rem, calc(100vw - 2rem));
    height: auto;
    margin: .2rem auto .8rem;
    transform: none;
  }
  body.anni-campaign-active #stats_sidebar {
    position: static;
    max-height: none;
  }
  body.anni-campaign-active #anni-party-profile { max-width: none; }
}
@media screen and (max-width: 640px) {
  body.anni-campaign-active #mid_panel {
    width: calc(100% - .75rem);
    padding-top: 3.6rem;
  }
  body.anni-campaign-active #tools_wrapper { display: block; width: 100%; }
  body.anni-campaign-active #stats_sidebar {
    max-height: none;
  }
  body.anni-campaign-active #content { padding: .8rem; }
}
</style>
`;

const gameplayScript = `
<script id="anni-game-layout-script">
(function () {
  'use strict';
  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
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
  function addProfile(d) {
    var c=document.getElementById('content');if(!c)return;
    var p=document.getElementById('anni-party-profile');
    if(!p){p=document.createElement('section');p.id='anni-party-profile';p.className='tools';c.parentNode.insertBefore(p,c);}
    var leader=d.year<1972?{name:'Luigi Longo',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Luigi_Longo_1968.jpg'}:{name:'Enrico Berlinguer',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Enrico_Berlinguer.jpg'};
    if(p.getAttribute('data-leader')===leader.name)return;
    p.setAttribute('data-leader',leader.name);
    p.innerHTML='<div class="anni-profile-title">Partito Comunista Italiano <span>(PCI)</span></div><img class="anni-profile-photo" src="'+leader.image+'" alt="'+leader.name+'" loading="lazy"><div class="anni-profile-name">'+leader.name+'</div><div class="anni-profile-role">Segretario generale del PCI</div>';
  }
  function sync() {
    var s=sceneId(),active=isCampaign(s);
    document.body.classList.toggle('anni-campaign-active',active);
    var oldPaper=document.getElementById('anni-news-panel');
    if(oldPaper&&oldPaper.parentNode)oldPaper.parentNode.removeChild(oldPaper);
    if(!active){
      var oldProfile=document.getElementById('anni-party-profile');
      if(oldProfile&&oldProfile.parentNode)oldProfile.parentNode.removeChild(oldProfile);
      return;
    }
    addTabs();addHeaderLinks();
    var d=dateInfo();
    addProfile(d);
    addDateHeading(d);
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

/* Bust cached framework assets whenever the campaign bundle changes. */

html = html.replace(
  /(src|href)=("|')((?:\.\/)?(?:jquery-1\.11\.1\.min\.js|core\.js|game\.js|game\.css))\2/gi,
  function (match, attribute, quote, asset) {
    return attribute + '=' + quote + asset + '?v=' + campaignAssetVersion + quote;
  }
);

/* Persist the modified HTML. Without this write, all injected changes are lost. */
fs.writeFileSync(indexPath, html, 'utf8');

const written = fs.readFileSync(indexPath, 'utf8');
if (!written.includes('anni-title-screen-style') || !written.includes('anni-title-screen-script')) {
  throw new Error('Title-menu modifications were not written into index.html.');
}
console.log('Title menu saved: title, historical Giuseppe Memeo banner and menu choices are in one panel.');
console.log('Sidebar configured: Main, Politics, Polls.');
