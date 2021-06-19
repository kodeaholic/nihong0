const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { vocabService } = require('../services');

const createVocab = catchAsync(async (req, res) => {
  const vocab = await vocabService.createVocab(req.body);
  res.status(httpStatus.CREATED).send(vocab);
});

const getVocabs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['vocab', 'lesson']);
  if (filter.name) filter.name = new RegExp(filter.name) // this will add {name: /name/i} to filter to search by regex, not search by identical string comparison
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await vocabService.queryVocabs(filter, options);
  res.send(result);
});

const getVocab = catchAsync(async (req, res) => {
  const vocab = await vocabService.getVocabById(req.params.vocabId);
  if (!vocab) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Từ vựng không tồn tại hoặc đã bị xoá');
  }
  res.send(Vocab);
});

const updateVocab = catchAsync(async (req, res) => {
  const vocab = await vocabService.updateVocabById(req.params.vocabId, req.body);
  res.send(vocab);
});

const deleteVocab = catchAsync(async (req, res) => {
  const vocab = await vocabService.deleteVocabById(req.params.vocabId);
  res.send(vocab);
});

module.exports = {
  createVocab,
  getVocabs,
  getVocab,
  updateVocab,
  deleteVocab,
};
