var map = [
        '4444444444444444444444444444',
        '4999999999999449999999999994',
        '4944449444449449444449444494',
        '4d400494000494494000494004d4',
        '4944449444449449444449444494',
        '4999999999999999999999999994',
        '4944449449444444449449444494',
        '4944449449444444449449444494',
        '4999999449999449999449999994',
        '4444449444441441444449444444',
        '0000049444441441444449400000',
        '0000049441111111111449400000',
        '0000049441444aa4441449400000',
        '4444449441477777741449444444',
        '1111119111477777741119111111',
        '4444449441477777741449444444',
        '0000049441444444441449400000',
        '0000049441111111111449400000',
        '0000049441444444441449400000',
        '4444449441444444441449444444',
        '4999999999999449999999999994',
        '4944449444449449444449444494',
        '4944449444449449444449444494',
        '4999449999999339999999449994',
        '4449449449444444449449449444',
        '4449449449444444449449449444',
        '4999999449999449999449999994',
        '4944444444449449444444444494',
        '4944444444449449444444444494',
        '4999999999999999999999999994',
        '4444444444444444444444444444'
] // 320 bytes
var Matrix = function(map) {
        var self = this;

        self.width = map[0].length;
        self.height = map.length; // Each block to render the map is 4 bits, the next 4 bits will be possible directions (up right down left)
        self.length = self.width*self.height; // in bytes 1 block will be 1 byte, first 4 bits rendering data, last 4 bits direction data
        self._buffer = new ArrayBuffer(self.length);
        self._bufInt = new Uint8Array(self._buffer);

        var i = 0;
        for(var y=0;y<map.length;y++) {
                for(var x=0;x<map[y].length;x++, i++) {
                        self._bufInt[i] = parseInt(map[y][x], 16);
                }
        }
        //console.log(self._bufInt);
}
Matrix.prototype.getBlock = function(x, y) {
        var self = this;
        var byteOffset = y*self.width+x;
        console.log(self._bufInt[byteOffset]);
}
Matrix.prototype.setBlock =  function(x, y, value) {

}
var test = new Matrix(map);
test.getBlock(4, 6);