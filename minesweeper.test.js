var expect = require('chai').expect;
var board = require('./src/minesweeper').board;
var partition = require('./src/minesweeper').partition;
var tiles = require('./src/minesweeper').tiles;
var addMines = require('./src/minesweeper').addMines;
var markThreatCounts = require('./src/minesweeper').markThreatCounts;
var perimeter = require('./src/minesweeper').perimeter;
var getPerimeter = require('./src/minesweeper').getPerimeter;
var getThreatCount = require('./src/minesweeper').getThreatCount;
var checkWest = require('./src/minesweeper').checkWest;
var checkEast = require('./src/minesweeper').checkEast;
var sweep = require('./src/minesweeper').sweep;
var safe = require('./src/minesweeper').safe;
var revealMines = require('./src/minesweeper').revealMines;
var hasMine = require('./src/minesweeper').hasMine;
var swept = require('./src/minesweeper').swept;
var flagged = require('./src/minesweeper').flagged;
var playing = require('./src/minesweeper').playing;
var editing = require('./src/minesweeper').editing;
var active = require('./src/minesweeper').active;
var won = require('./src/minesweeper').won;
var lost = require('./src/minesweeper').lost;


describe('tiles()', function() {
  it('should return a clamped array of unsigned 8 bit integers {rows * cols} elements', function() {
    var t = tiles(16, 16);
    expect(t.length).to.equal(16 * 16);
    expect(t.buffer.byteLength).to.equal(16 * 16);
  });
});

describe('getPerimeter()', function() {

  it('should return 3 neighboring tiles for nw corner tile', function() {
    var t = tiles();
    var nwPerimeter = getPerimeter(0, t.length, 9);
    expect(nwPerimeter.length).to.equal(3);
  });

  it('should return 3 neighboring tiles for ne corner tile', function() {
    var t = tiles();
    var nePerimeter = getPerimeter(8, t.length, 9);
    expect(nePerimeter.length).to.equal(3);

  });

  it('should return 3 neighboring tiles for sw corner tile', function() {
    var t = tiles();
    var swPerimeter = getPerimeter(72, t.length, 9);
    expect(swPerimeter.length).to.equal(3);
  });

  it('should return 3 neighboring tiles for se corner tile', function() {
    var t = tiles();
    var sePerimeter = getPerimeter(80, t.length, 9);
    expect(sePerimeter.length).to.equal(3);
  });

  it('should return 5 neighboring tiles for any non-corner western edge tile', function() {
    var t = tiles();
    var sePerimeter = getPerimeter(18, t.length, 9);
    expect(sePerimeter.length).to.equal(5);
  });

  it('should return 5 neighboring tiles for any non-corner eastern edge tile', function() {
    var t = tiles();
    var sePerimeter = getPerimeter(71, t.length, 9);
    expect(sePerimeter.length).to.equal(5);
  });

  it('should return 5 neighboring tiles for any non-corner northern edge tile', function() {
    var t = tiles();
    var sePerimeter = getPerimeter(4, t.length, 9);
    expect(sePerimeter.length).to.equal(5);
  });

  it('should return 5 neighboring tiles for any non-corner southern edge tile', function() {
    var t = tiles();
    var sePerimeter = getPerimeter(75, t.length, 9);
    expect(sePerimeter.length).to.equal(5);
  });

  it('should return 8 neighboring tiles for any non-edge tile', function() {
    var t = tiles();
    var sePerimeter = getPerimeter(23, t.length, 9);
    expect(sePerimeter.length).to.equal(8);
  });
});

describe('safe()', function() {
  it('should return true before players reveals first mine', function() {
    var t = tiles();
    expect(safe(t)).to.be.true;
  });

  it('should return false when a tile with a mine is swept', function() {
    var t = [ 2, 2, 0, 3 ]
    expect(safe(t)).to.be.false;
  });

  it('should return true when all tiles without mines have been swept', function() {
    var t = [ 2, 2, 1, 2 ]
    expect(safe(t)).to.be.true;
  });

  it('should return false when a tile with a mine has been swept (9x9)', function() {
    var t = [
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      3, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0
    ]

    var threats = [
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 1, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0
    ]
    expect(safe(sweep(27, t, threats, 9))).to.be.false;
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
    var expectedRevealed = sweptTiles.filter( function(tile) { return tile.swept }).length;

    var updatedBoard = sweep(12, tiles, 5);
    var actualRevealed = updatedBoard.filter( function(tile) { return tile.swept }).length;

    expect(actualRevealed).to.equal(expectedRevealed);
  });

  it('should recursively sweep perimeters of default size board correctly', function() {
    var tiles = [
      {hasMine: true,  swept: false, threatCount: 1}, {hasMine: true,  swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 2}, {hasMine: true,  swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0},
      {hasMine: false, swept: false, threatCount: 2}, {hasMine: false, swept: false, threatCount: 2}, {hasMine: false, swept: false, threatCount: 2}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0},
      {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 1},
      {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: true,  swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: true,  swept: false, threatCount: 0},
      {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 2}, {hasMine: false, swept: false, threatCount: 2},
      {hasMine: true,  swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 2}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: true,  swept: false, threatCount: 0},
      {hasMine: true,  swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 2}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 1},
      {hasMine: false, swept: false, threatCount: 3}, {hasMine: false, swept: false, threatCount: 3}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0},
      {hasMine: true,  swept: false, threatCount: 1}, {hasMine: true,  swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}
    ];

    var sweptTiles = [
      {hasMine: true,  swept: false, threatCount: 1}, {hasMine: true,  swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 2}, {hasMine: true,  swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0},
      {hasMine: false, swept: true,  threatCount: 2}, {hasMine: false, swept: true,  threatCount: 2}, {hasMine: false, swept: true,  threatCount: 2}, {hasMine: false, swept: true,  threatCount: 1}, {hasMine: false, swept: true,  threatCount: 1}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 0},
      {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 1}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 1},
      {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 1}, {hasMine: true,  swept: false, threatCount: 0}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: false, swept: false, threatCount: 1}, {hasMine: true,  swept: false, threatCount: 0},
      {hasMine: false, swept: true,  threatCount: 1}, {hasMine: false, swept: true,  threatCount: 1}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 1}, {hasMine: false, swept: true,  threatCount: 1}, {hasMine: false, swept: true,  threatCount: 1}, {hasMine: false, swept: true,  threatCount: 2}, {hasMine: false, swept: false, threatCount: 2},
      {hasMine: true,  swept: false, threatCount: 1}, {hasMine: false, swept: true,  threatCount: 2}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 1}, {hasMine: true,  swept: false, threatCount: 0},
      {hasMine: true,  swept: false, threatCount: 1}, {hasMine: false, swept: true,  threatCount: 2}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 1}, {hasMine: false, swept: true,  threatCount: 1},
      {hasMine: false, swept: false, threatCount: 3}, {hasMine: false, swept: true,  threatCount: 3}, {hasMine: false, swept: true,  threatCount: 1}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0},
      {hasMine: true,  swept: false, threatCount: 1}, {hasMine: true,  swept: false, threatCount: 1}, {hasMine: false, swept: true,  threatCount: 1}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}, {hasMine: false, swept: true,  threatCount: 0}
    ];
    var expectedRevealed = sweptTiles.filter( function(tile) { return tile.swept }).length;


    var updatedBoard = sweep(29, tiles, 9);
    var actualRevealed = updatedBoard.filter( function(tile) { return tile.swept }).length;

    expect(actualRevealed).to.equal(expectedRevealed);
  });

});