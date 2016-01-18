module.exports = function DrawingCtrl(DrawingStorage, $scope) {
    this.drawingStorage = new DrawingStorage()
    this.drawingStorage.fetch()
}
