var closeSelectedTag = {
  closedPath: function(_this, closedPath, goPath) {
    // debugger
    var view = _this.$store.state.tagsView.visitedViews
    var index = 0
    for (var i = 0; i < view.length; i++) {
      if (view[i].fullPath.indexOf(closedPath) !== -1) {
        index = i
        break
      }
    }
    _this.$store.dispatch('delView', view[index]).then(({ visitedViews }) => {
      _this.$router.push(goPath)
    })
  }
}
export {
  closeSelectedTag
}
