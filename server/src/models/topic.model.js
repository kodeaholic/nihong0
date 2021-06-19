const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const TopicSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: false,
            unique: true
        },
        description: {
            type: String,
            required: false,
            trim: false,
        },
    },
    {
        timestamps: true,
    }        
);
// add plugin that converts mongoose to json
TopicSchema.plugin(toJSON);
TopicSchema.plugin(paginate);
/**
 * Check if a name is taken
 * @param {string} name - The topic's name
 * @param {ObjectId} [excludeBoardId] - The id of the board to be excluded
 * @returns {Promise<boolean>}
 */
TopicSchema.statics.isNameTaken = async function (name, excludeBoardId) {
    const topic = await this.findOne({ name, _id: { $ne: excludeBoardId } });
    return !!topic;
};

/**
 * @typedef Topic
 */
const Topic = mongoose.model('Topic', TopicSchema);

module.exports = Topic;
