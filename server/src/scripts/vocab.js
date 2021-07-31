/** Extract text from vocab */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Joi = require('joi');
const path = require('path');
const _ = require('lodash');
const { Vocab } = require('../models');
const { htmlEntityDecode } = require('../helpers/htmlentities');
const { extractTextFromHTMLString, extractFuriganaFromHTMLString } = require('../helpers/dom');
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

  console.log('... Connecting to ', envVars.MONGODB_URL);
  await mongoose.connect(envVars.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log('Connected');

  /** Update vocab collections */
  const vocabs = await Vocab.find();
  await Promise.all(
    vocabs.map(async (item, index) => {
      try {
        console.log(`Extracting ${index + 1} ...`);
        const decoded = htmlEntityDecode(item.vocab);
        let extractedVocab = item.extractedVocab;
        if (true) {
          extractedVocab = extractTextFromHTMLString(decoded);
          Object.assign(item, { extractedVocab });
          await item.save();
        }
        let extractedFurigana = item.extractedFurigana;
        if (true) {
          extractedFurigana = extractFuriganaFromHTMLString(decoded);
          if (true) {
            Object.assign(item, { extractedFurigana });
            await item.save();
          }
        }
        console.log(`${index + 1} succeeded!`);
        return { extractedVocab, extractedFurigana };
      } catch (e) {
        console.log(e);
        console.log(`${index + 1} failed!`);
        return '';
      }
    })
  );
  process.exit(0);
};

main();
