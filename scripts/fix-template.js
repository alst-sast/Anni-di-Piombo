const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'out', 'html', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Keep the original DendryNexus tab system. Only change its labels and hide
// the unused Defense tab; do not remove any tab content or tab-switch logic.
const mainTab = /(<button class="tab_button" id="status_tab"[^>]*>)Status(<\/button>)/;
if (!mainTab.test(html)) {
  throw new Error('Could not find the expected Status tab in the generated DendryNexus sidebar.');
}
html = html.replace(mainTab, '$1Main$2');

const defenseTab = /\s*<button class="tab_button" id="paramilitary_tab" onclick="window\.changeTab\('status\.paramilitaries', 'paramilitary_tab'\);">Defense<\/button>/;
if (!defenseTab.test(html)) {
  throw new Error('Could not find the expected Defense tab in the DendryNexus tabbed-sidebar template. The generated template may have changed.');
}
html = html.replace(defenseTab, '');

for (const label of ['Main', 'Politics', 'Polls']) {
  if (!html.includes('>' + label + '</button>')) {
    throw new Error('Expected sidebar tab "' + label + '" is missing from generated HTML.');
  }
}

console.log('Sidebar configured with switchable Main, Politics, and Polls tabs.');
