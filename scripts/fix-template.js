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
