const httpStatus = require('http-status');
const { Topic, Chapter } = require('../models');
const ApiError = require('../utils/ApiError');
const _ = require('lodash')

const queryTopics = async (filter, options) => {
    const topics = await Topic.paginate(filter, options);
    return topics;
};

/**
 * Get topic by id
 * @param {ObjectId} id
 * @returns {Promise<Topic>}
 */
const getTopicById = async (id) => {
    const topic = await Topic.findById(id);
    let chapters = []
    let res = {}
    if (topic) {
        // get chapters
        chapters = await Chapter.find({"topic": id})
        const { name, description } = topic
        return { id, name, description, chapters }
    }
    return topic
};

/**
 * Create a topic
 * @param {Object} topicBody
 * @returns {Promise<Topic>}
 */
const createTopic = async (topicBody) => {
  if (await Topic.isNameTaken(topicBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tên chủ đề đã tồn tại');
  }
  const topic = await Topic.create(topicBody);
  return topic;
};
/**
 * Update a topic
 * @param {Object} topicBody
 * @returns {Promise<Topic>}
 */
const updateTopicById = async (topicId, topicBody) => {
    const topic = await getTopicById(topicId);
    if (!topic) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Chủ đề không tồn tại hoặc đã bị xoá');
    }
    if (topicBody.name && (await Topic.isNameTaken(topicBody.name, topicId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Tên chủ đề đã tồn tại');
    }
    Object.assign(topic, topicBody);
    await topic.save();
    return topic;
};
const deleteTopicById = async (topicId) => {
    const topic = await getTopicById(topicId);
    if (!topic) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Chủ để không tồn tại hoặc đã bị xoá');
    }
    await topic.remove();
    return topic;
};

module.exports = {
  createTopic,
  updateTopicById,
  getTopicById,
  deleteTopicById,
  queryTopics,
};
