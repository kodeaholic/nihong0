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
  const result = await Vocab.find()
    .explain()
    .then((res) => res[0]);
  console.log(result.executionStats);
  process.exit(0);
};

main();
