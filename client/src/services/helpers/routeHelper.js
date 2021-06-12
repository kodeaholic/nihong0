export function getViewAction(pathName) {
  // return ADD/EDIT/GET from pathName
  if (pathName.includes('add')) return 'add'
  if (pathName.includes('get')) return 'get'
  if (pathName.includes('edit')) return 'edit'
}
export function getLastPartFromPathName(pathName) {
  const splitted = pathName.split('/')
  return splitted[splitted.length - 1]
}
