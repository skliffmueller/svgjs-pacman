// Block Wall == 0 /* Static */
// Empty space == 1 /* Static */
// Small dot == 2 /* On pacman event 2 becomes 1 */
// Large dot == 3 /* On pacman event 3 becomes 1 */
// pacman spawn == 4 /* On pacman event 4 becomes 1 */
// enemy door == 5
// enemy spawn == 6
var map = [
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,0,1],
        [1,0,3,0,0,2,0,0,0,2,0,2,0,0,0,2,0,0,3,0,1],
        [1,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,1],
        [1,0,2,0,0,2,0,2,0,0,0,0,0,2,0,2,0,0,2,0,1],
        [1,0,2,2,2,2,0,2,2,2,0,2,2,2,0,2,2,2,2,0,1],
        [1,0,0,0,0,2,0,0,0,1,0,1,0,0,0,2,0,0,0,0,1],
        [1,1,1,1,0,2,0,1,1,1,1,1,1,1,0,2,0,1,1,1,1],
        [0,0,0,0,0,2,0,1,0,0,5,0,0,1,0,2,0,0,0,0,0],
        [1,1,1,1,1,2,1,1,0,6,6,6,0,1,1,2,1,1,1,1,1],
        [0,0,0,0,0,2,0,1,0,0,0,0,0,1,0,2,0,0,0,0,0],
        [1,1,1,1,0,2,0,1,1,1,1,1,1,1,0,2,0,1,1,1,1],
        [1,0,0,0,0,2,0,1,0,0,0,0,0,1,0,2,0,0,0,0,1],
        [1,0,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,0,1],
        [1,0,2,0,0,2,0,0,0,2,0,2,0,0,0,2,0,0,2,0,1],
        [1,0,3,2,0,2,2,2,2,2,4,2,2,2,2,2,0,2,3,0,1],
        [1,0,0,2,0,2,0,2,0,0,0,0,0,2,0,2,0,2,0,0,1],
        [1,0,2,2,2,2,0,2,2,2,0,2,2,2,0,2,2,2,2,0,1],
        [1,0,2,0,0,0,0,0,0,2,0,2,0,0,0,0,0,0,2,0,1],
        [1,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
]

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
        radius = parseInt(cube-3);
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
var sprites = [
        blockWall, // Block Wall == 0 /* Static */
        emptySpace, // Empty space == 1 /* Static */
        smallDot, // Small dot == 2 /* On pacman event 2 becomes 1 */
        bigDot, // Large dot == 3 /* On pacman event 3 becomes 1 */
        pacman, // pacman spawn == 4 /* On pacman event 4 becomes 1 */
        enemyDoor, // enemy door == 5
        enemySpawn // enemy spawn == 6
]
window.onload=function() {
        var game = SVG('pacman');
        var cube = 35;
        for(var y=0;y<map.length;y++) {
                for(var x=0;x<map[y].length;x++) {
                        sprites[map[y][x]](game, cube, x, y);
                }
        }

}