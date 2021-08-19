/* eslint-disable default-case */
export const testTypes = {
  TUVUNG: 1,
  CHUHAN: 2,
  NGUPHAP: 3,
  TIMNGHIA: 4,
  GHEPCAU: 5,
  ALL: 1000,
}

export const getTestTypeName = (type) => {
  switch (type) {
    case 1:
      return 'Từ vựng'
    case 2:
      return 'Chữ Hán'
    case 3:
      return 'Ngữ pháp'
    case 4:
      return 'Tìm đúng nghĩa'
    case 5:
      return 'Ghép thành câu'
    default:
      return 'Không xác định'
  }
}

export const TEST_PART = {
  vocabulary: 1,
  grammar: 2,
  reading: 3,
  listening: 4,
}

export const getTestPartName = (part) => {
  switch (part) {
    case 1:
      return '文字・語彙'
    case 2:
      return '文法'
    case 3:
      return '読解'
    case 4:
      return '聴解'
  }
}
