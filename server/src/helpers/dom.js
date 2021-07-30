const _ = require('lodash');
const parse = require('html-dom-parser');
function extractTextFromHTMLString(str) {
  if (_.isEmpty(str)) return str;
  string = str.replace(/\n/g, '');
  let dom = parse(string);
  if (!_.isArray(dom)) dom = [dom]
  let text = ''
  for (let i = 0; i < dom.length; i += 1) {
    text += traverse(dom[i]);
  }
  text = text.replace(/\s/g, '');
  text = text.replace(/\n/g, '');
  text = text.replace(/\。/g, '');
  text = text.replace(/\./g, '');
  return text;
}

function traverse(node) {
  let text = '';
  if (!_.isEmpty(node)) {
    text += '';
  }
  if (node.type && node.type === 'tag' && !node.name.includes('rt') && !node.name.includes('rp')) {
    const children = node.children;
    let n = _.isArray(node.children) ? node.children.length : 0;
    if (n)
      for (let i = 0; i < n; i += 1) {
        text += traverse(node.children[i]);
      }
  } else {
    text += node.data ? node.data : '';
  }

  return text;
}
module.exports = { extractTextFromHTMLString };
