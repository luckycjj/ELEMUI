var fixedList = {
  fiexedTwoNum(item) {
    if (item !== '' || item !== undefined || item !== null) {
      return item.toFixed(2)
    } else {
      return '0.00'
    }
  },
  fiexedThreeNum(item) {
    if (item !== '' || item !== undefined || item !== null) {
      return item.toFixed(3)
    } else {
      return '0.000'
    }
  }
}
export { fixedList }
