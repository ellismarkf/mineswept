var expect = require('chai').expect;
var generateTiles = require('./matrix.js').generateTiles;
var buildTile = require('./matrix.js').buildTile;
var getPerimeter = require('./matrix').getPerimeter;
var perimeterCoords = require('./matrix').perimeterCoords;
var getThreatCount = require('./matrix').getThreatCount;
var sweep = require('./matrix').sweep;
var reveal = require('./matrix').reveal;
var isSafe = require('./matrix').isSafe;
var directions = require('./matrix').directions;

describe('game board with set number of mines', function() {
  it('should return a shuffled array of 81 tiles for a 9x9 board', function() {
    var tiles = generateTiles(buildTile, 16, 16, 40);
    expect(tiles.length).to.equal(16 * 16);
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

describe('isSafe', function() {
  it('should return true before players reveals first mine', function() {
    var tiles = generateTiles(buildTile);
    var safe = isSafe(tiles);
    expect(safe).to.be.true;
  });

  it('should return false when a tile with a mine is swept', function() {
    var tiles = [
      { swept: true, hasMine: false},
      { swept: true, hasMine: false},
      { swept: false, hasMine: false},
      { swept: true, hasMine: true}
    ]
    expect(isSafe(tiles)).to.be.false;
  });

  it('should return true when all tiles without mines have been swept', function() {
    var tiles = [
      { swept: true, hasMine: false},
      { swept: true, hasMine: false},
      { swept: false, hasMine: true},
      { swept: true, hasMine: false}
    ]
    expect(isSafe(tiles)).to.be.false;
  });
});

describe('sweep', function() {
  it('should return a new arry of tiles after recursively sweeping perimeters', function() {
    var tiles = generateTiles(buildTile);
    tiles[40] = Object.assign({}, tiles[40], { swept: true });
    var updatedBoard = sweep(40, tiles, 9);
    expect(updatedBoard.length).to.equal(81);
  });

  it('should recursively sweep perimeters correctly', function() {
    var tiles = [
      {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0},
      {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 1},
      {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: true,  swept: false, threatCount: 0},
      {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 1},
      {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}
    ];

    var sweptTiles = [
      {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0},
      {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 1}, {hasMine: false, swept: true,  threatCount: 1},
      {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 1}, {hasMine: true,  swept: false, threatCount: 0},
      {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 1}, {hasMine: false, swept: true,  threatCount: 1},
      {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}
    ];

    var testResult = [

    ];

    var expectedRevealed = sweptTiles.filter( function(tile) { return tile.swept }).length;

    var updatedBoard = sweep(12, tiles, 5);
    console.log(updatedBoard)

    var actualRevealed = updatedBoard.filter( function(tile) { return tile.swept }).length;

    expect(actualRevealed).to.equal(expectedRevealed);
  });
});

describe('reveal', function(){
  xit('should return a new array of tiles with the given tile\'s swept property set to true', function() {
    var tiles = generateTiles(buildTile);
    var updatedBoard = reveal(40, tiles, 9);
    var sweptTile = updatedBoard[40];
    expect(sweptTile.swept).to.be.true;
  });
});