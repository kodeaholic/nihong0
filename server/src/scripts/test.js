const _ = require('lodash');
const { htmlEntityDecode } = require('../helpers/htmlentities');
const { extractTextFromHTMLString, extractFuriganaFromHTMLString } = require('../helpers/dom');

const main = async () => {
  const decoded = `<p style="margin-bottom:14px"><span style="font-size:11pt"><span style="line-height:normal"><span style="font-family:Arial,sans-serif"><span style="font-size:14.0pt"><span style="font-family:&quot;MS Gothic&quot;"><span style="color:red"><ruby style="ruby-align:distribute-space">髪型<rp>(</rp><rt style="font-size:7.0pt; layout-grid-mode:line">かみがた</rt><rp>)</rp></ruby></span></span></span></span></span></span></p>`;
  console.log(decoded);
  const extractedFurigana = extractFuriganaFromHTMLString(decoded);
  console.log(extractedFurigana);

  process.exit(0);
};

main();
