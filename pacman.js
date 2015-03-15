/* New Schema
        Sprite definitions
        ABCD - binary definition of map
        A == 1 allow movement
        A == 0 denied movement
        B == 0 item (items will only change score and sprite if allow movement)
                CD = 00 empty
                CD = 10 wall
                CD = 01 small dot
                CD = 11 big dot
        B == 1 entity (entities will be able to toggle movement)
                CD == 00 pacman spawn
                CD == 10 enemy spawn
                CD == 01 enemy door
                CD == 11 reserve

        Examples:
                Wall: 0010
                Empty with movement: 1000
                Dot: 1001
                Pacman spawn: 0100 when movement begins toggle to 1100, else entity will be locked in place
                Enemy spawn: 0110 read line above
                Enemy door: 0101 deny movement to keep door closed 1101 to open door
*/
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
        '4d994499999993399999994499d4',
        '4449449449444444449449449444',
        '4449449449444444449449449444',
        '4999999449999449999449999994',
        '4944444444449449444444444494',
        '4944444444449449444444444494',
        '4999999999999999999999999994',
        '4444444444444444444444444444'
] // 320 bytes

function smallDot(game, cube, x, y) {
        radius = parseInt(cube/4);
        moveX = (cube/2+x*cube)-(radius/2);
        moveY = (cube/2+y*cube)-(radius/2);
        return game
                .circle(radius)
                .move(moveX,moveY)
                .fill('#fff');
}
function bigDot(game, cube, x, y) {
        radius = parseInt(cube/2);
        moveX = (cube/2+x*cube)-(radius/2);
        moveY = (cube/2+y*cube)-(radius/2);
        return game
                .circle(radius)
                .move(moveX,moveY)
                .fill('#fff');
}
function emptySpace(game, cube, x, y) {
        return game
                .rect(cube,cube)
                .move(x*cube,y*cube)
                .fill('#000');
}
function blockWall(game, cube, x, y) {
        return game
                .rect(cube,cube)
                .move(x*cube,y*cube)
                .fill('#00d');
}
function pacman(game, cube, x, y) {
        radius = parseInt(cube);
        moveX = (cube/2+x*cube)-(radius/2);
        moveY = (cube/2+y*cube)-(radius/2);
        return game
                .circle(radius)
                .move(moveX,moveY)
                .fill('#ff0');
}
function enemyDoor(game, cube, x, y) {
        return game
                .rect(cube,cube)
                .move(x*cube,y*cube)
                .fill('#a00');
}
function enemySpawn(game, cube, x, y) {
        return game
                .rect(cube,cube)
                .move(x*cube,y*cube)
                .fill('#666');
}
/* New Schema
        Sprite properties and definitions
        ABCD - binary definition of map
        A == 1 allow movement
        A == 0 denied movement
        B == 0 item (items will only change score and sprite if allow movement)
                CD = 00 empty
                CD = 10 wall
                CD = 01 small dot
                CD = 11 big dot
        B == 1 entity (entities will be able to toggle movement)
                CD == 00 pacman spawn
                CD == 10 enemy spawn
                CD == 01 enemy door
                CD == 11 reserve
*/
var Matrix = function(map, selector, cube) {
        var self = this;

        self.game = SVG(selector);
        self.cube = cube || 20;

        self.width = map[0].length;
        self.height = map.length;
        // Each block to render the map is 4 bits, the next 4 bits will be possible directions (up right down left)
        self.length = self.width*self.height;
        // in bytes 1 block will be 1 byte, first 4 bits rendering data, last 4 bits direction data
        self._buffer = new ArrayBuffer(self.length);
        self._bufInt = new Uint8Array(self._buffer);

        self.spriteRenders = [
                emptySpace,
                emptySpace,
                blockWall,
                enemySpawn,
                smallDot,
                enemyDoor,
                bigDot
        ];

        self.blocks = [];
        self.draw = function(i, x, y) {
                if(self.blocks[y]==undefined) {
                        self.blocks[y] = [];
                } else if(self.blocks[y][x]) {
                        self.blocks[y][x].remove();
                }
                self.blocks[y][x] = self.spriteRenders[i](self.game, self.cube, x, y);
        }

        var pushBuffer = function(i, x, y) {
                up = y > 0 &&
                        parseInt(map[y-1][x], 16) & 1;

                down = y < self.height-1 &&
                        parseInt(map[y+1][x], 16) & 1;

                left =  x > 0 &&
                        parseInt(map[y][x-1], 16) & 1;

                right = x < self.width-1 &&
                        parseInt(map[y][x+1], 16) & 1;

                properties = parseInt(map[y][x], 16);
                path = ((((((up << 1) ^ right) << 1) ^ down) << 1) ^ left) << 4;

                self._bufInt[i] = properties ^ path;
                self.draw(properties >> 1, x, y);
        }

        var i = 0;
        for(var y=0;y<map.length;y++) {
                for(var x=0;x<map[y].length;x++) {
                        pushBuffer(i, x, y);
                        i++;
                }
        }
}
Matrix.prototype.getBlock = function(x, y) {
        var self = this;
        var byteOffset = y*self.width+x;
        return self._bufInt[byteOffset] & 15; // return first 4 bits
}
Matrix.prototype.setBlock = function(x, y, value) {
        var self = this;
        var byteOffset = y*self.width+x;

        self._bufInt[byteOffset] = self._bufInt[byteOffset] >> 4 << 4 ^ parseInt(value);
        self.draw(value >> 1, x, y);
        return self._bufInt[byteOffset] & 15;
}
Matrix.prototype.getPath = function(x, y) {
        var self = this;
        var byteOffset = y*self.width+x;
        return self._bufInt[byteOffset] >> 4; // return last 4 bits using shift
}
Matrix.prototype.setPath = function(x, y, value) {
        var self = this;
        var byteOffset = y*self.width+x;

        self._bufInt[byteOffset] = value << 4 ^ (self._bufInt[byteOffset] & 15);
        return self._bufInt[byteOffset] >> 4;
}
Matrix.prototype.spawnPacman = function() {
        
}

window.onload=function() {
        var matrix = new Matrix(map, 'pacman', 20);
        var Pacman = function(x, y) {
                var self = this;
                self.x1 = x1;
                self.x2 = x2;
                self.y1 = y1;
                self.y2 = y2;
        }
        var pacman = [];

        console.log(pacman);
}