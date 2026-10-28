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
const titleScreenStyles = `
<style id="anni-title-screen-style">
html,body{min-height:100%}
body{background:#30251d url('https://upload.wikimedia.org/wikipedia/commons/7/7c/Quarto_Stato.jpg') center/cover fixed no-repeat;color:#30251d}
#page{max-width:1200px}
/* Match the reference title screen: top link strip, one centered title, framed collage, translucent menu. */
body.anni-title-screen{margin:0;background:#332a21 url('https://upload.wikimedia.org/wikipedia/commons/7/7c/Quarto_Stato.jpg') center center/cover fixed no-repeat!important;color:#35251b}
body.anni-title-screen #page{width:100%;max-width:none;margin:0 auto;padding:0}
body.anni-title-screen header{width:100%;max-width:none;min-height:0;margin:0;padding:0;background:rgba(245,235,211,.78);border-bottom:1px solid rgba(90,53,34,.45);box-shadow:0 2px 10px rgba(0,0,0,.15);text-shadow:none}
body.anni-title-screen header h1{display:none!important}
body.anni-title-screen #content h1.anni-main-title{display:block!important;margin:10px 0 6px!important;color:#4a2019!important;font:bold clamp(2.25rem,5.5vw,4.2rem)/1.05 Georgia,'Times New Roman',serif!important;letter-spacing:.045em!important;text-transform:uppercase;text-shadow:0 1px 0 rgba(255,246,221,.7)}
body.anni-title-screen #header-links{float:none!important;display:flex!important;flex-wrap:wrap;align-items:center;justify-content:center;gap:0;margin:0 auto;padding:7px 12px;line-height:1.4}
body.anni-title-screen #header-links a{display:inline-block;color:#8b2722!important;background:transparent!important;border:0!important;padding:3px 10px!important;font:600 15px Georgia,'Times New Roman',serif;text-decoration:none}
body.anni-title-screen #header-links a:hover{background:rgba(125,45,35,.1)!important;text-decoration:underline}
body.anni-title-screen #mid_panel{width:100%;max-width:700px;margin:0 auto!important;padding:14px 16px 28px!important;box-sizing:border-box}
body.anni-title-screen #content{width:100%;max-width:620px;margin:0 auto!important;padding:12px 12px 18px!important;box-sizing:border-box;background:transparent!important;border:0!important;box-shadow:none!important;text-align:center}
body.anni-title-screen #content h1{margin:10px 0 6px!important;color:#4a2019!important;font:bold clamp(2.25rem,5.5vw,4.2rem)/1.05 Georgia,'Times New Roman',serif!important;letter-spacing:.045em!important;text-transform:uppercase;text-shadow:0 1px 0 rgba(255,246,221,.7)}
body.anni-title-screen .anni-banner{display:block;width:100%!important;max-width:600px!important;max-height:340px!important;height:auto;object-fit:cover;margin:16px auto 18px!important;padding:4px;background:#f2e6ca;border:1px solid #5b3d2c!important;box-shadow:0 3px 12px rgba(0,0,0,.42)!important}
body.anni-title-screen #content ul.choices{width:100%;max-width:600px!important;margin:14px auto 0!important;padding:0!important;list-style:none;background:rgba(245,235,213,.83)!important;border:1px solid rgba(90,61,43,.8)!important;border-radius:0!important;box-shadow:0 5px 18px rgba(0,0,0,.22)}
body.anni-title-screen #content ul.choices li{margin:0!important;padding:10px 16px!important;border-bottom:1px solid rgba(115,83,60,.38)!important;text-align:center}
body.anni-title-screen #content ul.choices li:last-child{border-bottom:0!important}
body.anni-title-screen #content ul.choices li a{color:#922923!important;font:bold 1.15rem Georgia,'Times New Roman',serif!important;text-decoration:none}
body.anni-title-screen #content ul.choices li a:hover{text-decoration:underline}
body.anni-title-screen #content ul.choices li:hover{background:rgba(220,202,165,.6)!important}
@media(max-width:700px){body.anni-title-screen #mid_panel{padding:8px 10px 18px!important}body.anni-title-screen #content{padding:8px 4px 14px!important}body.anni-title-screen .anni-banner{max-height:260px!important}body.anni-title-screen #header-links a{padding:4px 7px!important;font-size:13px}}
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
</style>`;
if (!html.includes('id="anni-title-screen-style"')) html = html.replace('</head>', titleScreenStyles + '\n</head>');

const titleScreenScript = `
<script id="anni-title-screen-script">
(function(){
  function syncLayout(){
    var content=document.getElementById('content');
    if(!content)return;
    var text=(content.innerText||content.textContent||'').replace(/\\s+/g,' ').trim();
    var links=Array.prototype.map.call(content.querySelectorAll('a'),function(a){return (a.innerText||a.textContent||'').trim();});
    var header=document.querySelector('header');
    var headerHeading=header?header.querySelector('h1'):null;
    var headerTitle=headerHeading?(headerHeading.innerText||headerHeading.textContent||'').trim():'';
    var heading=content.querySelector('h1');
    var headingText=heading?(heading.innerText||heading.textContent||'').trim():'';
    /* The engine renders the scene title in the global header, not inside #content.
       Move a copy into the title-screen stack so it appears between nav and artwork. */
    var isTitle=(links.indexOf('Start Campaign')!==-1 && links.indexOf('Credits')!==-1 && links.indexOf('Achievements')!==-1)
      || headerTitle.toLowerCase()==='anni di piombo'
      || headingText.toLowerCase()==='anni di piombo';
    document.body.classList.toggle('anni-title-screen',isTitle);
    var wrapper=document.getElementById('tools_wrapper');
    if(wrapper)wrapper.style.display=isTitle?'none':'';
    var mid=document.getElementById('mid_panel');
    if(mid)mid.style.margin=isTitle?'0 auto':'';
    if(isTitle && !content.querySelector('.anni-main-title')){
      var mainTitle=document.createElement('h1');
      mainTitle.className='anni-main-title';
      mainTitle.textContent=headerTitle || headingText || 'Anni di piombo';
      content.insertBefore(mainTitle,content.firstChild);
      heading=mainTitle;
      headingText=mainTitle.textContent;
    }
    if(isTitle && heading && !content.querySelector('.anni-banner') && headingText.toLowerCase()==='anni di piombo'){
      var banner=document.createElement('img');
      banner.className='anni-banner';
      banner.src='assets/pci-banner.jpg';
      banner.onerror=function(){this.onerror=null;this.src='https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_Partito_Comunista_Italiano.svg';this.style.objectFit='contain';this.style.maxHeight='220px';};
      banner.alt='Partito Comunista Italiano historical campaign banner';
      heading.insertAdjacentElement('afterend',banner);
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
  new MutationObserver(syncLayout).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(installHook,0);
})();
</script>`
if (!html.includes('id="anni-title-screen-script"')) html = html.replace('</body>', titleScreenScript + '\n</body>');

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
