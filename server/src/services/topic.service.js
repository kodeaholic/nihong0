const httpStatus = require('http-status');
const { Topic, Chapter, Lesson, Vocab } = require('../models');
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

const getChapter = async (topicId, chapterId) => {
    const topic = await Topic.findById(topicId);
    if (!topic) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Chủ đề không tồn tại hoặc đã bị xoá');
    }
    const chapters = _.get(topic, 'chapters')
    const index = _.findIndex(chapters, function(item) { return item._id == chapterId })
    if (index < 0) throw new ApiError(httpStatus.NOT_FOUND, 'Chapter không tồn tại hoặc đã bị xoá');
    let chapter = topic.chapters[index]
    return { chapter: chapter , topicName: topic.name, topicId: topicId }
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
    return {deleted: true}
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

const deleteLessonByChapterIdLessonId = async (chapterId, lessonId) => {
    const { topic , chapters, chapterIndex, lessonIndex } = await getIndexes(chapterId, lessonId);
    validateResult(topic, chapters, chapterIndex, lessonIndex);
    const lesson = topic["chapters"][chapterIndex]["lessons"][lessonIndex]
    await topic.updateOne(
        { $pull: { "chapters.$[chapter].lessons" : {_id: lessonId} }},
        { arrayFilters: [{"chapter._id": chapterId}]},
        (err) => {
            if (err) {
                console.log(err)
                throw new ApiError(httpStatus.NOT_FOUND, 'Bài học không tồn tại hoặc đã bị xoá');
            }
            return topic
        }
    )
    
    return { deleted: lesson }
};

const createLessonByChapterId = async (chapterId, lessonData) => {
    const { topic , chapters, chapterIndex } = await getIndexes(chapterId);
    validateResult(topic, chapters, chapterIndex);
    await topic.updateOne(
        { $push: { "chapters.$[chapter].lessons" : lessonData }},
        { arrayFilters: [{"chapter._id": chapterId}]},
        (err) => {
            if (err) {
                console.log(err)
                throw new ApiError(httpStatus.NOT_FOUND, 'Không tạo mới được bài học');
            }
        }
    )
    // let res = await Topic.findById(topic._id);
    return {updatedChapter: true}
};

const updateLessonByChapterIdLessonId = async (chapterId, lessonId, lessonData) => {
    const { topic , chapters, chapterIndex, lessonIndex } = await getIndexes(chapterId, lessonId);
    validateResult(topic, chapters, chapterIndex, lessonIndex);
    const res = await Topic.findOne({
        'chapters._id' : chapterId,
        'chapters.lessons._id' : lessonId
    });
    if (_.isEmpty(res)) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Bài học không tồn tại hoặc đã bị xoá');
    }
    Object.assign(topic["chapters"][chapterIndex]["lessons"][lessonIndex], lessonData)
    await topic.save()
    return topic["chapters"][chapterIndex]["lessons"][lessonIndex]    
};

const getIndexes = async (chapterId, lessonId , vocabId ) => {
    let lessons, vocabs, lessonIndex, vocabIndex
    const topic = await Topic.findOne({"chapters._id": chapterId});
    if (!topic) {
        return {topic: undefined, chapters: [], index: -1 }
    }
    const chapters = _.get(topic, "chapters")
    const chapterIndex = _.findIndex(chapters, function(item){ return item._id == chapterId})
    if (chapterIndex < 0) throw new ApiError(httpStatus.NOT_FOUND, 'Chapter không tồn tại hoặc đã bị xoá');

    if (lessonId) {
        lessons = chapters[chapterIndex]["lessons"]
        lessonIndex = _.findIndex(lessons, function(item){ return item._id == lessonId})
        if (chapterIndex < 0) throw new ApiError(httpStatus.NOT_FOUND, 'Bài học không tồn tại hoặc đã bị xoá');
    }

    if (lessonIndex >= 0 && !_.isEmpty(vocabId)) {
        vocabs = lessons[lessonIndex]["vocabs"]
        vocabIndex = _.findIndex(vocabs, function(item){ return item._id == vocabId})
        if (vocabIndex < 0) throw new ApiError(httpStatus.NOT_FOUND, 'Từ vựng không tồn tại hoặc đã bị xoá');
    }

    return { topic, chapters, chapterIndex, lessonIndex, vocabIndex }
}

const validateResult = (topic, chapters, chapterIndex, lessonIndex, vocabIndex) => {
    if (_.isEmpty(topic)) throw new ApiError(httpStatus.NOT_FOUND, 'Chủ đề không tồn tại hoặc đã bị xoá');
    if (_.isEmpty(chapters)) throw new ApiError(httpStatus.NOT_FOUND, 'Chapter không tồn tại hoặc đã bị xoá');
    if (chapterIndex < 0) throw new ApiError(httpStatus.NOT_FOUND, 'Chapter không tồn tại hoặc đã bị xoá');
    if (lessonIndex !== undefined && lessonIndex < 0) throw new ApiError(httpStatus.NOT_FOUND, 'Bài học không tồn tại hoặc đã bị xoá');
    if (vocabIndex !== undefined || vocabIndex < 0) throw new ApiError(httpStatus.NOT_FOUND, 'Từ vựng không tồn tại hoặc đã bị xoá');
}

const getLessonsByChapterId = async (chapterId) => {
    const { topic , chapters, chapterIndex } = await getIndexes(chapterId);
    validateResult(topic, chapters, chapterIndex);
    return {lessons: _.get(chapters[chapterIndex], "lessons"), chapterId: chapterId}
};

module.exports = {
  createTopic,
  updateTopicById,
  getTopicById,
  deleteTopicById,
  getChaptersByTopicId,
  deleteChapterByTopicIdChapterId,
  createChapterByTopicId,
  updateChapterByTopicIdChapterId,
  deleteLessonByChapterIdLessonId,
  createLessonByChapterId,
  updateLessonByChapterIdLessonId,
  getLessonsByChapterId,
  queryTopics,
  getChapter,
};
