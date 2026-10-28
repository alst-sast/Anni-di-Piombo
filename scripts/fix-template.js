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

/* Give the title and campaign-selection screens a period-inspired, Germany-to-Save-like layout. */
const titleScreenStyles = `
<style id="anni-title-screen-style">
html, body { min-height:100%; }
body { background:#4d171d; }
body.anni-title-screen { background:#30251d url('https://upload.wikimedia.org/wikipedia/commons/7/7c/Quarto_Stato.jpg') center center / cover fixed no-repeat !important; }
body.anni-title-screen:before { content:""; position:fixed; inset:0; background:linear-gradient(90deg,rgba(25,16,12,.48),rgba(255,244,218,.30),rgba(25,16,12,.48)); pointer-events:none; z-index:0; }
body.anni-title-screen #game, body.anni-title-screen #content, body.anni-title-screen .game { position:relative; z-index:1; }
body.anni-title-screen .scene, body.anni-title-screen .page, body.anni-title-screen #main { background:rgba(248,239,213,.86); border:1px solid rgba(90,54,30,.65); box-shadow:0 10px 35px rgba(0,0,0,.32); }
body.anni-title-screen h1, body.anni-title-screen h2 { color:#392819; font-family:Georgia,'Times New Roman',serif; text-transform:uppercase; letter-spacing:.09em; text-shadow:0 1px 0 #fff4dc; }
body.anni-title-screen a, body.anni-title-screen button, body.anni-title-screen input[type=button] { color:#8e2027; font-family:Georgia,'Times New Roman',serif; font-weight:bold; }
body.anni-title-screen a:hover, body.anni-title-screen button:hover { color:#bd1e35; }
body.anni-title-screen .anni-banner { display:block; width:min(100%,650px); max-height:340px; object-fit:cover; background:rgba(255,255,255,.72); margin:12px auto 18px; border:3px solid #3b2c22; box-shadow:0 5px 18px rgba(0,0,0,.35); }
body.anni-title-screen .anni-menu { max-width:650px; margin:0 auto; padding:14px 22px; background:rgba(247,237,213,.76); border:1px solid rgba(93,63,39,.65); text-align:center; }
body.anni-title-screen .anni-menu a { display:block; padding:8px 4px; font-size:1.12em; }
@media(max-width:700px) { body.anni-title-screen { background-attachment:scroll !important; } body.anni-title-screen .anni-banner { max-height:240px; } }
</style>`;
if (!html.includes('id="anni-title-screen-style"')) {
  html = html.replace('</head>', titleScreenStyles + '\n</head>');
}
const titleScreenScript = `
<script id="anni-title-screen-script">
(function(){
  function decorate(){
    const text = (document.body.innerText || '').toLowerCase();
    const isTitle = text.includes('start campaign') || text.includes('start game') || text.includes('select difficulty');
    if (!isTitle) return;
    document.body.classList.add('anni-title-screen');
    const main = document.querySelector('#main, #content, .scene, .page, main');
    if (!main || main.dataset.anniDecorated) return;
    main.dataset.anniDecorated = 'true';
    const heading = main.querySelector('h1, h2');
    if (heading && !main.querySelector('.anni-banner')) {
      const banner = document.createElement('img');
      banner.className = 'anni-banner';
      banner.src = 'assets/pci-banner.jpg';
      banner.onerror = function(){ this.onerror = null; this.src = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_Partito_Comunista_Italiano.svg'; this.style.objectFit = 'contain'; this.style.maxHeight = '220px'; };
      banner.alt = 'Anni di piombo — PCI historical campaign banner';
      heading.insertAdjacentElement('afterend', banner);
    }
    main.classList.add('anni-menu');
  }
  document.addEventListener('DOMContentLoaded', decorate);
  new MutationObserver(decorate).observe(document.documentElement,{childList:true,subtree:true});
})();
</script>`;
if (!html.includes('id="anni-title-screen-script"')) {
  html = html.replace('</body>', titleScreenScript + '\n</body>');
}


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
