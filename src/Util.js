/**
 * 生成一个精炼的随机字符串
 * @param {number} length - 生成字符串的长度
 * @returns {string} - 随机字符串
 */
export function randomString (length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
