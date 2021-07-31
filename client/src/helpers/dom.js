const _ = require('lodash')
const parse = require('html-dom-parser')
function extractTextFromHTMLString(str) {
  if (_.isEmpty(str)) return str
  const string = str.replace(/\n/g, '')
  let dom = parse(string)
  if (!_.isArray(dom)) dom = [dom]
  let text = ''
  for (let i = 0; i < dom.length; i += 1) {
    text += traverse(dom[i])
  }
  text = text.replace(/\s/g, '')
  text = text.replace(/\n/g, '')
  text = text.replace(/\。/g, '')
  text = text.replace(/\./g, '')
  return text
}

function traverse(node) {
  let text = ''
  if (!_.isEmpty(node)) {
    text += ''
  }
  if (node.type && node.type === 'tag' && !node.name.includes('rt') && !node.name.includes('rp')) {
    const children = node.children
    let n = _.isArray(node.children) ? node.children.length : 0
    if (n)
      for (let i = 0; i < n; i += 1) {
        text += traverse(node.children[i])
      }
  } else {
    text += node.data ? node.data : ''
  }

  return text
}

function traverseFurigana(node) {
  let text = ''
  if (!_.isEmpty(node)) {
    text += ''
  }
  if (
    node.type &&
    node.type === 'text' &&
    _.get(node, 'parent.name') &&
    _.get(node, 'parent.name').includes('rt')
  ) {
    text += node.data ? node.data : ''
  } else {
    const children = node.children
    let n = _.isArray(children) ? children.length : 0
    if (n)
      for (let i = 0; i < n; i += 1) {
        text += traverseFurigana(children[i])
      }
  }
  return text
}

function extractFuriganaFromHTMLString(str) {
  if (_.isEmpty(str)) return str
  const string = str.replace(/\n/g, '')
  let dom = parse(string)
  if (!_.isArray(dom)) dom = [dom]
  let text = ''
  for (let i = 0; i < dom.length; i += 1) {
    text += traverseFurigana(dom[i])
  }
  text = text.replace(/\s/g, '')
  text = text.replace(/\n/g, '')
  text = text.replace(/\。/g, '')
  text = text.replace(/\./g, '')
  return text
}

function traverseToGetBothTextAndFurigana(node) {
  let text = ''
  if (!_.isEmpty(node)) {
    text += ''
  }
  if (
    node.type &&
    node.type === 'tag' &&
    !node.name.includes('rt') &&
    !node.name.includes('rp') &&
    !node.name.includes('ruby')
  ) {
    const children = node.children
    let n = _.isArray(children) ? children.length : 0
    if (n)
      for (let i = 0; i < n; i += 1) {
        text += traverseToGetBothTextAndFurigana(children[i])
      }
  } else if (node.type && node.type === 'tag' && node.name.includes('ruby')) {
    text += traverseRubyNode(node)
  } else if (
    node.type &&
    node.type === 'tag' &&
    (node.name.includes('rp') || node.name.includes('rt'))
  )
    return ''
  else {
    text += node.data ? node.data : ''
  }

  return text
}

function traverseRubyNode(rubyNode) {
  let text = ''
  const children = rubyNode.children
  let n = _.isArray(children) ? children.length : 0
  if (n > 0)
    for (let i = 0; i < n; i += 1) {
      text += traverseRubyChild(children[i])
    }
  else text += rubyNode.data ? rubyNode.data : ''
  text = `<ruby style="ruby-align: distribute-space">${text}</ruby>`
  return text
}

function traverseRubyChild(node) {
  let text = ''
  if (!_.isEmpty(node)) {
    text += ''
  }
  if (node.type && node.type === 'tag' && node.name.includes('rt')) {
    text += `<rt style="layout-grid-mode: line">${node.children[0].data}</rt>`
  } else if (node.type && node.type === 'tag' && node.name.includes('rp')) {
    text += `<rp>${node.children[0].data}</rp>`
  } else if (node.type && node.type === 'text') {
    text += node.data ? node.data : ''
  } else {
    // node has has, let's traverse again
    const children = node.children
    let n = _.isArray(children) ? children.length : 0
    if (n > 0)
      for (let i = 0; i < n; i += 1) {
        text += traverseRubyChild(children[i])
      }
  }

  return text
}

function extractTextWithFurigana(str) {
  if (_.isEmpty(str)) return str
  let dom = parse(str)
  if (!_.isArray(dom)) dom = [dom]
  let text = ''
  for (let i = 0; i < dom.length; i += 1) {
    text += traverseToGetBothTextAndFurigana(dom[i])
  }
  text = text.replace(/\n/g, '')

  // trim left & right
  // let result = text
  // let n = result.length
  // while (
  //   result.charAt(n - 1) === '&nbsp;' ||
  //   result.charAt(n - 1) === ' ' ||
  //   result.charAt(n - 1) === '　'
  // ) {
  //   console.log('Trimmed left')
  //   result = result.substring(1)
  // }
  // n = result.length
  // while (
  //   result.charAt(n - 1) === '&nbsp;' ||
  //   result.charAt(n - 1) === ' ' ||
  //   result.charAt(n - 1) === '　'
  // ) {
  //   console.log('Trimmed left')
  //   result = result.substring(0, n - 2)
  //   n = n - 1
  // }
  return text
}
module.exports = {
  extractTextFromHTMLString,
  extractFuriganaFromHTMLString,
  extractTextWithFurigana,
}
