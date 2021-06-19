const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { topicService } = require('../services');

const createTopic = catchAsync(async (req, res) => {
    const topic = await topicService.createTopic(req.body);
    res.status(httpStatus.CREATED).send(topic);
});

const updateTopic = catchAsync(async (req, res) => {
    const topic = await topicService.updateTopicById(req.params.topicId, req.body);
    res.send(topic);
});

const getTopic = catchAsync(async (req, res) => {
    const topic = await topicService.getTopicById(req.params.topicId);
    if (!topic) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Chủ đề không tồn tại hoặc đã bị xoá');
    }
    res.send(topic);
});

const getTopics = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name']);
    if (filter.name) filter.name = new RegExp(filter.name) // this will add {name: /name/i} to filter to search by regex, not search by identical string comparison
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await topicService.queryTopics(filter, options);
    res.send(result);
});
const deleteTopic = catchAsync(async (req, res) => {
    const topic = await topicService.deleteTopicById(req.params.topicId);
    res.send(topic);
});


module.exports = {
  createTopic,
  updateTopic,
  getTopic,
  deleteTopic,
  getTopics,
};
