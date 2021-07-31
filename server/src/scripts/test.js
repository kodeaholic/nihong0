/** Extract text from vocab */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Joi = require('joi');
const path = require('path');
const _ = require('lodash');
const { Vocab, ReadingBoard } = require('../models');
const { htmlEntityDecode } = require('../helpers/htmlentities');
const { extractTextFromHTMLString, extractFuriganaFromHTMLString, extractTextWithFurigana } = require('../helpers/dom');
dotenv.config({ path: path.join(__dirname, '../../.env') }); // export vars to process.env
const main = async () => {
  const envVarsSchema = Joi.object()
    .keys({
      MONGODB_URL: Joi.string().required(),
    })
    .unknown();

  const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  /**Test with DB */
  // console.log('... Connecting to ', envVars.MONGODB_URL);
  // await mongoose.connect(envVars.MONGODB_URL, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   useFindAndModify: false,
  //   useCreateIndex: true,
  // });
  // console.log('Connected');
  // const result = await Vocab.find()
  //   .explain()
  //   .then((res) => res[0]);
  // console.log(result.executionStats);
  /**End test DB */
  const HTML_STRING = `<p style="text-align:justify; margin-bottom:13px"><span style="font-size:14.0pt"><span style="line-height:115%"><span style="font-family:&quot;Arial&quot;,sans-serif"><ruby style="ruby-align:distribute-space"><span lang="JA" style="font-family:&quot;MS Mincho&quot;">私</span><rp>(</rp><rt style="font-size:7.0pt; font-family:&quot;MS Mincho&quot;; layout-grid-mode:line">わたし</rt><rp>)</rp></ruby><span lang="JA" style="font-size:14.0pt"><span style="line-height:115%"><span style="font-family:&quot;MS Mincho&quot;">は　「</span></span></span><span style="font-size:14.0pt"><span style="line-height:115%"><span style="font-family:&quot;Arial&quot;,sans-serif"><ruby style="ruby-align:distribute-space"><span lang="JA" style="font-family:&quot;MS Mincho&quot;">分</span><rp>(</rp><rt style="font-size:7.0pt; font-family:&quot;MS Mincho&quot;; layout-grid-mode:line">わ</rt><rp>)</rp></ruby><span lang="JA" style="font-size:14.0pt"><span style="line-height:115%"><span style="font-family:&quot;MS Mincho&quot;">かりました</span></span></span></span></span></span></span></span></span><span lang="VI" style="font-size:14.0pt"><span style="line-height:115%"><span style="font-family:&quot;Arial&quot;,sans-serif">.</span></span></span><span lang="JA" style="font-size:14.0pt"><span style="line-height:115%"><span style="font-family:&quot;MS Mincho&quot;">ありがとうございます」と　</span></span></span><span style="font-size:14.0pt"><span style="line-height:115%"><span style="font-family:&quot;Arial&quot;,sans-serif"><ruby style="ruby-align:distribute-space"><span lang="JA" style="font-family:&quot;MS Mincho&quot;">言</span><rp>(</rp><rt style="font-size:7.0pt; font-family:&quot;MS Mincho&quot;; layout-grid-mode:line">い</rt><rp>)</rp></ruby><span lang="JA" style="font-size:14.0pt"><span style="line-height:115%"><span style="font-family:&quot;MS Mincho&quot;">って、かさを　かりて　</span></span></span><span style="font-size:14.0pt"><span style="line-height:115%"><span style="font-family:&quot;Arial&quot;,sans-serif"><ruby style="ruby-align:distribute-space"><span lang="JA" style="font-family:&quot;MS Mincho&quot;">帰</span><rp>(</rp><rt style="font-size:7.0pt; font-family:&quot;MS Mincho&quot;; layout-grid-mode:line">かえ</rt><rp>)</rp></ruby><span lang="JA" style="font-size:14.0pt"><span style="line-height:115%"><span style="font-family:&quot;MS Mincho&quot;">りました。</span></span></span></span></span></span></span></span></span></p>`;
  console.log(`${extractTextWithFurigana(HTML_STRING)}`);
  process.exit(0);
};

main();
