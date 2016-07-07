var expect = require('chai').expect;
var buildBoard = require('./matrix.js').buildBoard;
var tile = require('./matrix.js').tile;
var perimeterCoords = require('./matrix').perimeterCoords;
var getPerimeter = require('./matrix').getPerimeter;
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
});