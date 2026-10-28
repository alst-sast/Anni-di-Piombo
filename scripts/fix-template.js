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

/* Give the title screen its own full-window layout and keep campaign status out of it. */
const titleScreenStyles = `
<style id="anni-title-screen-style">
html, body { min-height:100%; }
body { background:#4d171d; }
body.anni-title-screen { margin:0; padding:0; min-height:100vh; background:#30251d url('https://upload.wikimedia.org/wikipedia/commons/7/7c/Quarto_Stato.jpg') center center / cover fixed no-repeat !important; color:#30251d; }
body.anni-title-screen:before { content:""; position:fixed; inset:0; background:linear-gradient(90deg,rgba(25,16,12,.48),rgba(255,244,218,.20),rgba(25,16,12,.48)); pointer-events:none; z-index:0; }
body.anni-title-screen #sidebar, body.anni-title-screen .sidebar, body.anni-title-screen #status, body.anni-title-screen .tabbed_sidebar, body.anni-title-screen .tabbed-sidebar, body.anni-title-screen .sidebar-tabs, body.anni-title-screen .tab_buttons, body.anni-title-screen #main_tab, body.anni-title-screen #politics_tab, body.anni-title-screen #poll_tab, body.anni-title-screen #paramilitary_tab { display:none !important; }
body.anni-title-screen #game, body.anni-title-screen #content, body.anni-title-screen .game, body.anni-title-screen #app, body.anni-title-screen #wrapper, body.anni-title-screen .container { position:relative; z-index:1; background:transparent !important; width:100% !important; max-width:none !important; margin:0 !important; padding:0 !important; }
body.anni-title-screen .scene, body.anni-title-screen .page, body.anni-title-screen #main, body.anni-title-screen main { background:rgba(248,239,213,.94) !important; color:#30251d !important; border:1px solid rgba(90,54,30,.65); box-shadow:0 10px 35px rgba(0,0,0,.32); width:min(900px, calc(100% - 32px)); max-width:900px; margin:28px auto !important; padding:30px !important; box-sizing:border-box; text-align:center; }
body.anni-title-screen h1, body.anni-title-screen h2 { color:#392819; font-family:Georgia,'Times New Roman',serif; text-transform:uppercase; letter-spacing:.09em; text-shadow:0 1px 0 #fff4dc; }
body.anni-title-screen h1 { font-size:clamp(2rem,5vw,3.6rem); margin:.2em 0 .4em; }
body.anni-title-screen a, body.anni-title-screen button, body.anni-title-screen input[type=button] { color:#8e2027; font-family:Georgia,'Times New Roman',serif; font-weight:bold; }
body.anni-title-screen a:hover, body.anni-title-screen button:hover { color:#bd1e35; }
body.anni-title-screen .anni-banner { display:block; width:min(100%,720px); max-height:380px; object-fit:cover; background:rgba(255,255,255,.72); margin:18px auto 22px; border:4px solid #3b2c22; box-shadow:0 5px 18px rgba(0,0,0,.35); }
body.anni-title-screen .anni-menu { max-width:720px; margin:0 auto !important; padding:18px 24px !important; background:rgba(247,237,213,.80) !important; border:1px solid rgba(93,63,39,.65); text-align:center; }
body.anni-title-screen .anni-menu a { display:block; padding:10px 4px; font-size:1.18em; text-decoration:none; border-bottom:1px solid rgba(93,63,39,.18); }
body.anni-title-screen .anni-menu a:last-child { border-bottom:0; }
@media(max-width:700px) { body.anni-title-screen { background-attachment:scroll !important; } body.anni-title-screen .scene, body.anni-title-screen .page, body.anni-title-screen #main, body.anni-title-screen main { padding:18px !important; } body.anni-title-screen .anni-banner { max-height:240px; } }
</style>`;
if (!html.includes('id="anni-title-screen-style"')) html = html.replace('</head>', titleScreenStyles + '\n</head>');

const titleScreenScript = `
<script id="anni-title-screen-script">
(function(){
  function decorate(){
    const clickable = Array.from(document.querySelectorAll('a, button, input[type=button]'));
    const labels = clickable.map(function(el){ return (el.innerText || el.value || el.textContent || '').trim().toLowerCase(); }).join(' ');
    const isTitle = labels.includes('start campaign') || labels.includes('start game') || labels.includes('select difficulty');
    if (!isTitle) {
      document.body.classList.remove('anni-title-screen');
      document.querySelectorAll('[data-anni-hidden-sidebar="true"]').forEach(function(el){ el.style.display = ''; delete el.dataset.anniHiddenSidebar; });
      return;
    }
    document.body.classList.add('anni-title-screen');

    /* Find the real sidebar from its visible tab buttons, then hide its enclosing layout column. */
    const tab = document.querySelector('#main_tab, #politics_tab, #poll_tab, #paramilitary_tab');
    if (tab) {
      let node = tab;
      for (let depth = 0; node && depth < 7; depth++, node = node.parentElement) {
        const t = (node.innerText || '').toLowerCase();
        const hasStatus = t.includes('party resources') || t.includes('internal dissent') || t.includes('next general election');
        const hasTabs = t.includes('main') && t.includes('politics') && t.includes('polls');
        if (hasStatus && hasTabs && node !== document.body && node !== document.documentElement) {
          node.style.setProperty('display', 'none', 'important');
          node.dataset.anniHiddenSidebar = 'true';
          break;
        }
      }
    }

    /* Hide a status-only column even if the template's tab IDs have changed. */
    Array.from(document.querySelectorAll('aside, [role="complementary"], .sidebar, #sidebar, .tabbed_sidebar, .tabbed-sidebar')).forEach(function(node){
      const t = (node.innerText || '').toLowerCase();
      if (t.includes('party resources') && t.includes('internal dissent')) {
        node.style.setProperty('display', 'none', 'important');
        node.dataset.anniHiddenSidebar = 'true';
      }
    });

    const heading = document.querySelector('#content h1, #main h1, main h1, .scene h1, .page h1, h1');
    if (heading && !document.querySelector('.anni-banner')) {
      const banner = document.createElement('img');
      banner.className = 'anni-banner';
      banner.src = 'assets/pci-banner.jpg';
      banner.onerror = function(){ this.onerror = null; this.src = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_Partito_Comunista_Italiano.svg'; this.style.objectFit = 'contain'; this.style.maxHeight = '220px'; };
      banner.alt = 'Anni di piombo — PCI historical campaign banner';
      heading.insertAdjacentElement('afterend', banner);
    }
    const menuRoot = heading && (heading.closest('.scene, .page') || heading.parentElement);
    if (menuRoot) menuRoot.classList.add('anni-menu');
  }
  document.addEventListener('DOMContentLoaded', decorate);
  new MutationObserver(decorate).observe(document.documentElement,{childList:true,subtree:true});
})();
</script>`;
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
