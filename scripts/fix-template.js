const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'out', 'html', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// The DendryNexus template already provides the Main, Politics and Polls
// tabs and their switching logic. Remove only the unused Defense tab button.
const defenseTab = /\s*<button class="tab_button" id="paramilitary_tab" onclick="window\.changeTab\('status\.paramilitaries', 'paramilitary_tab'\);">Defense<\/button>/;
if (!defenseTab.test(html)) {
  throw new Error('Could not find the expected Defense tab in the DendryNexus tabbed-sidebar template. The generated template may have changed.');
}
html = html.replace(defenseTab, '');

for (const id of ['main_tab', 'politics_tab', 'poll_tab']) {
  if (!new RegExp('id="' + id + '"').test(html)) {
    throw new Error('Expected sidebar tab "' + id + '" is missing from generated HTML.');
  }
}
if (/id="paramilitary_tab"/.test(html)) {
  throw new Error('The unused Defense tab button was not removed.');
}

console.log('Sidebar configured with switchable Main, Politics, and Polls tabs.');

/* Style the actual DendryNexus template: #tools_wrapper/#stats_sidebar and #content. */
const titleScreenStyles = \`
<style id="anni-title-screen-style">
html,body{min-height:100%}
body{background:#30251d url('https://upload.wikimedia.org/wikipedia/commons/7/7c/Quarto_Stato.jpg') center/cover fixed no-repeat;color:#30251d}
#page{max-width:1200px}
body.anni-title-screen #tools_wrapper{display:none!important}
body.anni-title-screen #mid_panel{margin:0 auto!important;max-width:1000px;padding:20px;box-sizing:border-box}
body.anni-title-screen header{max-width:900px;text-align:center;color:#fff0d0;text-shadow:0 2px 4px #000}
body.anni-title-screen header h1{display:block;font:bold clamp(2rem,5vw,3.6rem) Georgia,'Times New Roman',serif;text-transform:uppercase;letter-spacing:.09em}
body.anni-title-screen header h2{display:none}
body.anni-title-screen #header-links{float:none;display:flex;justify-content:center;gap:18px;margin:8px auto}
body.anni-title-screen #header-links a{color:#fff0d0;padding:6px 12px;background:rgba(35,20,14,.72);border:1px solid rgba(255,240,208,.55)}
body.anni-title-screen #content{max-width:900px;margin:20px auto;padding:clamp(18px,4vw,38px);box-sizing:border-box;background:rgba(248,239,213,.96);border:2px solid #67472e;box-shadow:0 12px 36px rgba(0,0,0,.42);text-align:center}
body.anni-title-screen #content h1{margin:.2em 0 .5em;font:bold clamp(2rem,5vw,3.4rem) Georgia,'Times New Roman',serif;letter-spacing:.08em;color:#392819}
body.anni-title-screen #content ul.choices{max-width:680px;margin:20px auto 0;border:1px solid #8a6b4a;border-radius:0;background:rgba(255,250,235,.7)}
body.anni-title-screen #content ul.choices li{padding:14px 18px;border-bottom:1px solid #c6b294;text-align:center}
body.anni-title-screen #content ul.choices li a{color:#8e2027;font:bold 1.15em Georgia,'Times New Roman',serif}
body.anni-title-screen #content ul.choices li:hover{background:#ead9b8}
body.anni-title-screen .anni-banner{display:block;width:min(100%,720px);max-height:340px;object-fit:cover;margin:16px auto 22px;border:4px solid #3b2c22;box-shadow:0 5px 18px rgba(0,0,0,.35)}
@media(max-width:700px){body{background-attachment:scroll}body:not(.anni-title-screen) #mid_panel{margin:0 auto}body.anni-title-screen #mid_panel{padding:10px}body.anni-title-screen #content{margin:12px auto;padding:18px}}
</style>\`;
if (!html.includes('id="anni-title-screen-style"')) html = html.replace('</head>', titleScreenStyles + '\\n</head>');

const titleScreenScript = \`
<script id="anni-title-screen-script">
(function(){
  var titleScenes=['main','party_select','main_menu','credits','achievements'];
  function syncLayout(){
    var engine=window.dendryUI&&window.dendryUI.dendryEngine;
    var sceneId=engine&&engine.state&&engine.state.sceneId;
    if(!sceneId)return;
    var isTitle=titleScenes.indexOf(sceneId)!==-1;
    document.body.classList.toggle('anni-title-screen',isTitle);
    var wrapper=document.getElementById('tools_wrapper');
    if(wrapper)wrapper.style.display=isTitle?'none':'';
    var mid=document.getElementById('mid_panel');
    if(mid)mid.style.margin=isTitle?'0 auto':'';
    var content=document.getElementById('content');
    if(content&&isTitle){
      var heading=content.querySelector('h1');
      if(heading&&!content.querySelector('.anni-banner')){
        var banner=document.createElement('img');
        banner.className='anni-banner';
        banner.src='assets/pci-banner.jpg';
        banner.onerror=function(){this.onerror=null;this.src='https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_Partito_Comunista_Italiano.svg';this.style.objectFit='contain';this.style.maxHeight='220px';};
        banner.alt='Partito Comunista Italiano historical campaign banner';
        heading.insertAdjacentElement('afterend',banner);
      }
    }
  }
  function installHook(){
    if(typeof window.onDisplayContent==='function'&&!window.onDisplayContent.__anniWrapped){
      var original=window.onDisplayContent;
      var wrapped=function(){var result=original.apply(this,arguments);syncLayout();return result;};
      wrapped.__anniWrapped=true;
      window.onDisplayContent=wrapped;
    }
    syncLayout();
  }
  document.addEventListener('DOMContentLoaded',installHook);
  window.addEventListener('load',installHook);
  new MutationObserver(installHook).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(installHook,0);
})();
</script>\`;
if (!html.includes('id="anni-title-screen-script"')) html = html.replace('</body>', titleScreenScript + '\\n</body>');

/* Copy the user's banner into the published site when it exists in the repository's assets folder. */
const bannerSource = path.join(__dirname, '..', 'assets', 'pci-banner.jpg');
if (fs.existsSync(bannerSource)) {
  const publicAssets = path.join(__dirname, '..', 'out', 'html', 'assets');
  fs.mkdirSync(publicAssets, { recursive: true });
  fs.copyFileSync(bannerSource, path.join(publicAssets, 'pci-banner.jpg'));
  console.log('Copied assets/pci-banner.jpg into the published site.');
} else {
  console.warn('Custom PCI banner not found. Add it to assets/pci-banner.jpg to show it on the title screen.');
}

console.log('Applied the period-inspired title-screen layout.');
