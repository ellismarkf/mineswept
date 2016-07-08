var expect = require('chai').expect;
var generateTiles = require('./matrix.js').generateTiles;
var newTile = require('./matrix.js').newTile;
var newGetPerimeter = require('./matrix').newGetPerimeter;
var newPerimeterCoords = require('./matrix').newPerimeterCoords;
var getThreatCount = require('./matrix').getThreatCount;
var sweep = require('./matrix').sweep;
var directions = require('./matrix').directions;

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