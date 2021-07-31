const httpStatus = require('http-status');
const { removeAccents, hasAccents } = require('../helpers/accents');
const { containsJapaneseCharacter } = require('../helpers/japanese');
const { Vocab, Card } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a vocab
 * @param {Object} body
 * @returns {Promise<Vocab>}
 */
const search = async (body) => {
    const searchKey = body.search;
    let results = {
        vocabs: [],
        cards: [],
    };
    if (!searchKey) return [];
    let search = searchKey;

    const isJapanese = containsJapaneseCharacter(search);
    const regex = new RegExp(".*" + search + ".*", "g");

    const vocabPromise = async () => {
        const vocabTextSearchCondition = isJapanese ? { $or: [ { "extractedVocab": { $regex: regex }}, { "extractedFurigana": { $regex: regex } } ] } : { "vocabMeaning": { $regex: regex } }
        const vocabSelectedFields = ['-vocab', '-example', '-orderInParent', '-chinese', '-audioSrc'];
        return promise = Vocab.find(vocabTextSearchCondition).select(vocabSelectedFields).limit(10).sort({ "extractedVocab": -1 })
    }
    const cardPromise = async () => {
        const cardTextSearchCondition = isJapanese ? { $or: [ { "letter": { $regex: regex }} ] } : { "meaning": { $regex: regex } }
        const cardSelectedFields = ['-onTextExample', '-kunTextExample'];
        return Card.find(cardTextSearchCondition).select(cardSelectedFields).limit(10).sort({ "letter": -1 })
    }

    results = await Promise.all([
        vocabPromise(),
        cardPromise()
      ]).then(([vocabs, cards]) => {
        return { vocabs, cards };
      }).catch((err) => {
        console.log('Error: ', err);
        return { vocabs: [], cards: []}
      });
    return { results };
};


module.exports = {
    search,
};
