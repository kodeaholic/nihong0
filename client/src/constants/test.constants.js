export const testTypes = {
  TUVUNG: 1,
  CHUHAN: 2,
  NGUPHAP: 3,
  TIMNGHIA: 4,
  GHEPCAU: 5,
  ALL: 0,
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
      return 'Tìm nghĩa'
    case 5:
      return 'Ghép câu'
    default:
      return 'Không xác định'
  }
}
