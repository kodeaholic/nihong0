const httpStatus = require('http-status');
const { extractTextFromHTMLString, extractFuriganaFromHTMLString } = require('../helpers/dom');
const { htmlEntityDecode } = require('../helpers/htmlentities');
const { Vocab } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a vocab
 * @param {Object} vocabBody
 * @returns {Promise<Vocab>}
 */
const createVocab = async (vocabBody) => {
  const decoded = htmlEntityDecode(vocabBody.vocab ? vocabBody.vocab : '');
  const extractedVocab = extractTextFromHTMLString(decoded);
  const extractedFurigana = extractFuriganaFromHTMLString(decoded);
  const vocab = await Vocab.create({ ...vocabBody, extractedVocab, extractedFurigana });
  return vocab;
};

/**
 * Query for vocabs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {string} [options.populate] - Populate associated cards
 * @returns {Promise<QueryResult>}
 */
const queryVocabs = async (filter, options) => {
  const vocabs = await Vocab.paginate(filter, options);
  return vocabs;
};

/**
 * Get vocab by id
 * @param {ObjectId} id
 * @returns {Promise<Vocab>}
 */
const getVocabById = async (id) => {
  const vocab = await Vocab.findById(id).populate({
    path: 'lesson',
    populate: { path: 'chapter', populate: { path: 'topic' } },
  });
  if (!vocab) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Từ vựng không tồn tại hoặc đã bị xoá');
  }
  return vocab;
};

/**
 * Update vocab by id
 * @param {ObjectId} vocabId
 * @param {Object} updateBody
 * @returns {Promise<Vocab>}
 */
const updateVocabById = async (vocabId, updateBody) => {
  const vocab = await Vocab.findById(vocabId);
  if (!vocab) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Từ vựng không tồn tại hoặc đã bị xoá');
  }
  const decoded = htmlEntityDecode(updateBody.vocab ? updateBody.vocab : '');
  const extractedVocab = extractTextFromHTMLString(decoded);
  const extractedFurigana = extractFuriganaFromHTMLString(decoded);
  Object.assign(updateBody, { extractedVocab, extractedFurigana });
  Object.assign(vocab, updateBody);
  await vocab.save();
  return vocab;
};

/**
 * Delete vocab by id
 * @param {ObjectId} vocabId
 * @returns {Promise<Vocab>}
 */
const deleteVocabById = async (vocabId) => {
  const vocab = await Vocab.findById(vocabId);
  if (!vocab) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Từ vựng không tồn tại hoặc đã bị xoá');
  }
  await vocab.remove();
  return vocab;
};

module.exports = {
  createVocab,
  queryVocabs,
  getVocabById,
  updateVocabById,
  deleteVocabById,
};
