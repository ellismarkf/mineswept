var expect = require('chai').expect;
var buildBoard = require('./matrix.js').buildBoard;
var generateTiles = require('./matrix.js').generateTiles;
var newTile = require('./matrix.js').newTile;
var tile = require('./matrix.js').tile;
var perimeterCoords = require('./matrix').perimeterCoords;
var getPerimeter = require('./matrix').getPerimeter;
var newGetPerimeter = require('./matrix').newGetPerimeter;
var newPerimeterCoords = require('./matrix').newPerimeterCoords;
var getThreatCount = require('./matrix').getThreatCount;
var sweep = require('./matrix').sweep;
var directions = require('./matrix').directions;

describe('game board', function() {
  it('should build a two-dimensional array of tile objects with 9 rows and columns by default', function() {
    var board = buildBoard(tile);
    expect(board.length).to.equal(9);
    expect(board[0].length).to.equal(9);
  });

  it('should return alength 8 array of non-null neighbors of a tile within one neighbor of the edge', function() {
    var board = buildBoard(tile);
    var landLockedTile = tile(4, 4);
    var fullPerimeter = getPerimeter(landLockedTile, board);
    expect(fullPerimeter.length).to.equal(8);
  });

  it('should return a length 3 array of non-null neighbors of any given corner tile', function() {
    var board = buildBoard(tile);
    var cornerTile = tile(0, 0);
    var cornerPerimeter = getPerimeter(cornerTile, board);
    expect(cornerPerimeter.length).to.equal(3);
  });

  it('should return a length 5 array of non-null neighbors of any given non-corner edge tile', function() {
    var board = buildBoard(tile);
    var edgeTile = tile((board[0].length - 1), 4);
    var edgePerimeter = getPerimeter(edgeTile, board);
    expect(edgePerimeter.length).to.equal(5);
  });

  it('for any given tile, should return the number of neighboring tiles containing mines', function() {
    var board = [
      [{x: 0, y: 0, hasMine: true},  {x: 1, y: 0, hasMine: true},  {x: 2, y: 0, hasMine: false}],
      [{x: 0, y: 1, hasMine: false}, {x: 1, y: 1, hasMine: false}, {x: 2, y: 1, hasMine: true} ],
      [{x: 0, y: 2, hasMine: false}, {x: 1, y: 2, hasMine: true},  {x: 2, y: 2, hasMine: true} ]
    ];
    var oneMineBoard = [
      [{x: 0, y: 0, hasMine: true},  {x: 1, y: 0, hasMine: false},  {x: 2, y: 0, hasMine: false} ],
      [{x: 0, y: 1, hasMine: false}, {x: 1, y: 1, hasMine: false}, {x: 2, y: 1, hasMine: false}  ],
      [{x: 0, y: 2, hasMine: false}, {x: 1, y: 2, hasMine: false},  {x: 2, y: 2, hasMine: false} ]
    ];
    var perimeter = getPerimeter(board[1][1], board);
    var sMP = getPerimeter(oneMineBoard[1][1], oneMineBoard);

    var threats = getThreatCount(perimeter);
    var sMT = getThreatCount(sMP);

    expect(threats).to.equal(5);
    expect(sMT).to.equal(1);
  });
});

describe('game board with set number of mines', function() {
  it('should return an shuffled array of 81 tiles for a 9x9 board', function() {
    var tiles = generateTiles(newTile);
    expect(tiles.length).to.equal(81);
  });
});

describe('getPerimeter', function() {
  it('should return 3 neighboring tiles for nw corner tile', function() {
    var tiles = generateTiles(newTile);
    var nwPerimeter = newGetPerimeter(0, tiles, 9);
    expect(nwPerimeter.length).to.equal(3);
  });

  it('should return 3 neighboring tiles for ne corner tile', function() {
    var tiles = generateTiles(newTile);
    var nePerimeter = newGetPerimeter(8, tiles, 9);
    expect(nePerimeter.length).to.equal(3);

  });

  it('should return 3 neighboring tiles for sw corner tile', function() {
    var tiles = generateTiles(newTile);
    var swPerimeter = newGetPerimeter(72, tiles, 9);
    expect(swPerimeter.length).to.equal(3);
  });

  it('should return 3 neighboring tiles for se corner tile', function() {
    var tiles = generateTiles(newTile);
    var sePerimeter = newGetPerimeter(80, tiles, 9);
    expect(sePerimeter.length).to.equal(3);
  });

  it('should return 5 neighboring tiles for any non-corner western edge tile', function() {
    var tiles = generateTiles(newTile);
    var sePerimeter = newGetPerimeter(18, tiles, 9);
    expect(sePerimeter.length).to.equal(5);
  });

  it('should return 5 neighboring tiles for any non-corner eastern edge tile', function() {
    var tiles = generateTiles(newTile);
    var sePerimeter = newGetPerimeter(71, tiles, 9);
    expect(sePerimeter.length).to.equal(5);
  });

  it('should return 5 neighboring tiles for any non-corner northern edge tile', function() {
    var tiles = generateTiles(newTile);
    var sePerimeter = newGetPerimeter(4, tiles, 9);
    expect(sePerimeter.length).to.equal(5);
  });

  it('should return 5 neighboring tiles for any non-corner southern edge tile', function() {
    var tiles = generateTiles(newTile);
    var sePerimeter = newGetPerimeter(75, tiles, 9);
    expect(sePerimeter.length).to.equal(5);
  });

  it('should return 8 neighboring tiles for any non-edge tile', function() {
    var tiles = generateTiles(newTile);
    var sePerimeter = newGetPerimeter(23, tiles, 9);
    expect(sePerimeter.length).to.equal(8);
  });
});