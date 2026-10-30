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

/* Remove any old versions of this patch before adding the current version. */
html = html.replace(/<style id="anni-title-screen-style">[\s\S]*?<\/style>/gi, '');
html = html.replace(/<script id="anni-title-screen-script">[\s\S]*?<\/script>/gi, '');

const styles = \`
<style id="anni-title-screen-style">
html,body{min-height:100%}
body{color:#30251d;background:#30251d url('https://upload.wikimedia.org/wikipedia/commons/7/7c/Quarto_Stato.jpg') center center/cover fixed no-repeat}
body.anni-title-screen{margin:0;color:#35251b;background:#332a21 url('https://upload.wikimedia.org/wikipedia/commons/7/7c/Quarto_Stato.jpg') center center/cover fixed no-repeat!important}
body.anni-title-screen header h1,body.anni-title-screen header h2{display:none!important}
body.anni-title-screen #tools_wrapper{display:none!important}
body.anni-title-screen #mid_panel{width:100%;max-width:780px;margin:0 auto!important;padding:12px 16px 28px;box-sizing:border-box}
body.anni-title-screen #content{width:100%;max-width:740px;margin:0 auto;padding:10px 12px 22px;box-sizing:border-box;background:transparent;border:0;box-shadow:none;text-align:center}
body.anni-title-screen .anni-menu-panel{width:100%;max-width:660px;margin:14px auto 26px;padding:20px 22px 24px;box-sizing:border-box;text-align:center;background:rgba(245,235,213,.94);border:2px solid #76543a;box-shadow:0 8px 24px rgba(0,0,0,.34)}
body.anni-title-screen .anni-menu-title{display:block;margin:0 0 14px;color:#4a2019;font:bold clamp(2rem,5vw,3.25rem)/1.08 Georgia,'Times New Roman',serif;letter-spacing:.045em;text-transform:uppercase;text-shadow:0 1px 0 rgba(255,246,221,.75)}
body.anni-title-screen .anni-banner{display:block;width:100%;max-width:590px;height:auto;max-height:330px;object-fit:cover;margin:0 auto 18px;padding:4px;box-sizing:border-box;background:#f2e6ca;border:2px solid #5b3d2c;box-shadow:0 3px 12px rgba(0,0,0,.32)}
body.anni-title-screen #content ul.choices{display:block;width:100%;max-width:none;margin:0 auto;padding:0;list-style:none;background:rgba(255,250,235,.48);border:1px solid #9b7956;border-radius:0;box-shadow:none;box-sizing:border-box}
body.anni-title-screen #content ul.choices li{margin:0;padding:12px 16px;border-top:1px solid rgba(115,83,60,.42);text-align:center}
body.anni-title-screen #content ul.choices li:first-child{border-top:0}
body.anni-title-screen #content ul.choices li a{color:#922923;font:bold 1.15rem Georgia,'Times New Roman',serif;text-decoration:none}
body.anni-title-screen #content ul.choices li:hover{background:rgba(220,202,165,.58)}
@media(max-width:700px){
  body{background-attachment:scroll}
  body.anni-title-screen #mid_panel{padding:8px}
  body.anni-title-screen #content{padding:8px 4px 18px}
  body.anni-title-screen .anni-menu-panel{padding:16px 12px 18px}
  body.anni-title-screen .anni-banner{max-height:250px}
}
</style>\`;

const script = \`
<script id="anni-title-screen-script">
(function(){
  function syncTitleMenu(){
    var content=document.getElementById('content');
    if(!content)return;

    var choices=content.querySelector('ul.choices');
    if(!choices){
      document.body.classList.remove('anni-title-screen');
      return;
    }

    var labels=Array.prototype.map.call(choices.querySelectorAll('a'),function(a){
      return (a.textContent||'').trim().toLowerCase();
    });
    var isTitle=labels.indexOf('start campaign')!==-1 &&
      labels.indexOf('credits')!==-1 &&
      labels.indexOf('achievements')!==-1;

    document.body.classList.toggle('anni-title-screen',isTitle);
    if(!isTitle)return;

    var panel=content.querySelector('.anni-menu-panel');
    if(!panel){
      panel=document.createElement('section');
      panel.className='anni-menu-panel';
      choices.parentNode.insertBefore(panel,choices);
    }

    var title=panel.querySelector('.anni-menu-title');
    if(!title){
      title=document.createElement('h1');
      title.className='anni-menu-title';
      title.textContent='ANNI DI PIOMBO';
    }

    var banner=panel.querySelector('.anni-banner');
    if(!banner){
      banner=document.createElement('img');
      banner.className='anni-banner';
      banner.src='assets/pci-banner.jpg';
      banner.alt='Vintage PCI campaign banner showing a red flag, workers and a crowd';
      banner.loading='eager';
    }

    /* Put the title, local banner, and menu options in one framed panel. */
    if(title.parentNode!==panel)panel.appendChild(title);
    if(banner.parentNode!==panel)panel.appendChild(banner);
    if(choices.parentNode!==panel)panel.appendChild(choices);
    if(panel.parentNode!==content)content.insertBefore(panel,choices);
  }

  function install(){
    syncTitleMenu();
    var content=document.getElementById('content');
    if(content && typeof MutationObserver!=='undefined'){
      var observer=new MutationObserver(syncTitleMenu);
      observer.observe(content,{childList:true,subtree:true});
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',install,{once:true});
  }else{
    install();
  }
  window.addEventListener('load',syncTitleMenu);
})();
</script>\`;

if (!html.includes('</head>')) {
  throw new Error('Generated HTML has no closing </head> tag.');
}
if (!html.includes('</body>')) {
  throw new Error('Generated HTML has no closing </body> tag.');
}
html = html.replace('</head>', styles + '\\n</head>');
html = html.replace('</body>', script + '\\n</body>');

/* The banner is a real repository asset, copied into the published folder. */
const bannerSource = path.join(__dirname, '..', 'assets', 'pci-banner.jpg');
if (!fs.existsSync(bannerSource)) {
  throw new Error('Missing assets/pci-banner.jpg. The title-menu banner cannot be published.');
}
const publicAssets = path.join(__dirname, '..', 'out', 'html', 'assets');
fs.mkdirSync(publicAssets, { recursive: true });
fs.copyFileSync(bannerSource, path.join(publicAssets, 'pci-banner.jpg'));

/* CRITICAL: persist every HTML modification before the workflow uploads the site. */
fs.writeFileSync(indexPath, html, 'utf8');

const written = fs.readFileSync(indexPath, 'utf8');
for (const marker of ['anni-title-screen-style','anni-title-screen-script']) {
  if (!written.includes(marker)) throw new Error('Failed to write title-menu patch marker: ' + marker);
}
if (!fs.existsSync(path.join(publicAssets, 'pci-banner.jpg'))) {
  throw new Error('Banner was not copied into the published assets directory.');
}

console.log('Title menu saved: title, PCI banner, and menu choices are in one panel.');
console.log('Sidebar configured: Main, Politics, Polls.');
