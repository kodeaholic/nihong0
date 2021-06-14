const httpStatus = require('http-status');
const { Topic, Chapter, Lesson, Vocab } = require('../models');
const ApiError = require('../utils/ApiError');
const _ = require('lodash')

/**
 * Get topic by id
 * @param {ObjectId} id
 * @returns {Promise<Topic>}
 */
const getTopicById = async (id) => {
    return Topic.findById(id);
};

/**
 * Create a topic
 * @param {Object} topicBody
 * @returns {Promise<Topic>}
 */
const createTopic = async (topicBody) => {
  if (await Topic.isNameTaken(topicBody.title)) {
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

/**
 * ------------------------ Chapter manipulation ----------------------
 */

const getChaptersByTopicId = async (topicId) => {
    const topic = await Topic.findById(topicId).select("_id, chapters");
    if (!topic) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Chủ đề không tồn tại hoặc đã bị xoá');
    }
    return {chapters: _.get(topic, "chapters"), topicId: topicId}
};

const deleteChapterByTopicIdChapterId = async (topicId, chapterId) => {
    const topic = await Topic.findById(topicId);
    if (!topic) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Chủ đề không tồn tại hoặc đã bị xoá');
    }
    await topic.updateOne({ $pull: { "chapters" : { _id: chapterId } } }, (err) => {
        if (err) {
            console.log(err)
            throw new ApiError(httpStatus.NOT_FOUND, 'Chủ để không tồn tại hoặc đã bị xoá');
        }
        return topic
    })
};

const createChapterByTopicId = async (topicId, chapterData) => {
    const topic = await Topic.findById(topicId);
    if (!topic) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Chủ đề không tồn tại hoặc đã bị xoá');
    }
    const chapter = new Chapter(chapterData);
    topic.chapters.push(chapter)
    await topic.save()
    return chapter
};

const updateChapterByTopicIdChapterId = async (topicId, chapterId, chapterData) => {
    const topic = await Topic.findById(topicId);
    if (!topic) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Chủ đề không tồn tại hoặc đã bị xoá');
    }
    const chapters = _.get(topic, 'chapters')
    const index = _.findIndex(chapters, function(item) { return item._id == chapterId })
    if (index < 0) throw new ApiError(httpStatus.NOT_FOUND, 'Chapter không tồn tại hoặc đã bị xoá');
    Object.assign(topic.chapters[index], chapterData);
    await topic.save();
    return topic.chapters[index]
};

module.exports = {
  createTopic,
  updateTopicById,
  getTopicById,
  deleteTopicById,
  getChaptersByTopicId,
  deleteChapterByTopicIdChapterId,
  createChapterByTopicId,
  updateChapterByTopicIdChapterId
};
