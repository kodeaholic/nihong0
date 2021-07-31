const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['getCards', 'getBoards', 'getTopics', 'getChapters', 'getLessons', 'getVocabs', 'search']);
roleRights.set(roles[1], [
  'getUsers', 'manageUsers',
  'getCards', 'manageCards',
  'getBoards', 'manageBoards',
  'getTopics', 'manageTopics',
  'getChapters', 'manageChapters',
  'getLessons', 'manageLessons',
  'getVocabs', 'manageVocabs',
  'admin',
  'search'
]);
module.exports = {
  roles,
  roleRights,
};
