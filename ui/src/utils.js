/*
* @Author: CJ Ting
* @Date:   2016-05-23 11:20:47
* @Last Modified by:   CJ Ting
* @Last Modified time: 2016-05-23 11:38:54
*/

export function checkJSON(content) {
  try {
    JSON.parse(content)
  } catch(e) {
    return false
  }

  return true
}
