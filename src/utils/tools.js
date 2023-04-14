// 判断字符串能否转换为json
export function isJSON(str) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      }
    } catch (e) {
      return false
    }
  }
}
