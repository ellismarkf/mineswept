var expect = require('chai').expect;
var generateTiles = require('./matrix.js').generateTiles;
var buildTile = require('./matrix.js').buildTile;
var getPerimeter = require('./matrix').getPerimeter;
var perimeterCoords = require('./matrix').perimeterCoords;
var getThreatCount = require('./matrix').getThreatCount;
var sweep = require('./matrix').sweep;
var directions = require('./matrix').directions;

describe('game board with set number of mines', function() {
  it('should return an shuffled array of 81 tiles for a 9x9 board', function() {
    var tiles = generateTiles(buildTile);
    expect(tiles.length).to.equal(81);
  });
});

describe('getPerimeter', function() {
  it('should return 3 neighboring tiles for nw corner tile', function() {
    var tiles = generateTiles(buildTile);
    var nwPerimeter = getPerimeter(0, tiles, 9);
    expect(nwPerimeter.length).to.equal(3);
  });

  it('should return 3 neighboring tiles for ne corner tile', function() {
    var tiles = generateTiles(buildTile);
    var nePerimeter = getPerimeter(8, tiles, 9);
    expect(nePerimeter.length).to.equal(3);

  });

  it('should return 3 neighboring tiles for sw corner tile', function() {
    var tiles = generateTiles(buildTile);
    var swPerimeter = getPerimeter(72, tiles, 9);
    expect(swPerimeter.length).to.equal(3);
  });

  it('should return 3 neighboring tiles for se corner tile', function() {
    var tiles = generateTiles(buildTile);
    var sePerimeter = getPerimeter(80, tiles, 9);
    expect(sePerimeter.length).to.equal(3);
  });

  it('should return 5 neighboring tiles for any non-corner western edge tile', function() {
    var tiles = generateTiles(buildTile);
    var sePerimeter = getPerimeter(18, tiles, 9);
    expect(sePerimeter.length).to.equal(5);
  });

  it('should return 5 neighboring tiles for any non-corner eastern edge tile', function() {
    var tiles = generateTiles(buildTile);
    var sePerimeter = getPerimeter(71, tiles, 9);
    expect(sePerimeter.length).to.equal(5);
  });

  it('should return 5 neighboring tiles for any non-corner northern edge tile', function() {
    var tiles = generateTiles(buildTile);
    var sePerimeter = getPerimeter(4, tiles, 9);
    expect(sePerimeter.length).to.equal(5);
  });

  it('should return 5 neighboring tiles for any non-corner southern edge tile', function() {
    var tiles = generateTiles(buildTile);
    var sePerimeter = getPerimeter(75, tiles, 9);
    expect(sePerimeter.length).to.equal(5);
  });

  it('should return 8 neighboring tiles for any non-edge tile', function() {
    var tiles = generateTiles(buildTile);
    var sePerimeter = getPerimeter(23, tiles, 9);
    expect(sePerimeter.length).to.equal(8);
  });
});