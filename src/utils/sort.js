// 中文排序
import { ConvertPinyin } from '@/utils/PINYING'
var sortList = {
  pingyin(list, rule, item) {
    for (var i = 0; i < list.length; i++) {
      list[i].pingyin = ConvertPinyin(list[i][item]).substring(0, 1).toUpperCase()
    }
    this.listSecond(list, rule)
  },
  listSecond(arr, pri) {
    var len = arr.length
    for (var z = 0; z < pri.length; z++) {
      for (var i = 0; i < len; i++) {
        for (var x = i + 1; x < len; x++) {
          if (z > 0) {
            if (arr[i][pri[z - 1]] === arr[x][pri[z - 1]]) {
              if (arr[i][pri[z]] > arr[x][pri[z]]) {
                var tem = arr[x]
                arr[x] = arr[i]
                arr[i] = tem
              }
            } else {
              break
            }
          } else {
            if (arr[i][pri[z]] > arr[x][pri[z]]) {
              var tem1 = arr[x]
              arr[x] = arr[i]
              arr[i] = tem1
            }
          }
        }
      }
    }
    return arr
  }
}
export { sortList }
