# mineswept

The classic, widely-misunderstood game of logic, luck, and landmines.  

## play the game

```
git clone https://github.com/ellismarkf/mineswept.git
cd mineswept
npm install
node server.js
```
Then visit `http://localhost:3000` in your browser. :bomb:

## the rules

I'll be honest: I don't know them. 

Psych! But like many people, I do have fond memories of playing minesweeper on my first PC, happily and trepidatiously clicking tiles, unsuccessfully trying to decipher what the numbers behind the tiles meant, and praying I didn't reveal any mines.

It wasn't until I was an adult that I ever bothered to actually learn the rules of the game.  Once I did I found the game to be a wonderful, brain-teasing way to spend 15 minutes (depending on the difficulty level).

Turns out the rules aren't as mysterious as I thought they were as a kid.  So, without further ado:

- All tiles begin with their contents concealed.
- Clicking a tile either reveals a mine, a number, or an empty tile.
- If you reveal a mine, you're dead.
- Revealing a number means you're safe, but there are mines nearby.
- The number displayed in a tile refers to the numbers of mines in the 8 tiles surrounding it.
- If you reveal an empty tile, all nearby empty tiles will also be revealed, until tiles with mines nearby are discovered.

The objective of the game is to safely reveal all non-mine tiles.  The first mine you reveal is always a guess, but, assuming you uncover an area and not just a single tile with a number in it, revealing subsequent tiles is a process of logically deducing which tiles are safe.  You'll come to appreciate corners very much.

If you are sure that a tile contains a mine, you can flag it by right-clicking on it.

## program design

I went through several iterations of designing the data structure that represented the game board.  My initial attempt used a two-dimensional array, such that a tile's "coordinates" matched its position in the array, ie tile at (0, 0) was at `board[0][0]`.  I liked this approach because I could always use the coordinates to directly access a tile when trying to find and update it, rather than having to recursively iterate through the array of arrays.  Plus, it provided a straighforward mental model when trying to find any given tile's neighbors - just a process of adding or subtracting 1 to/from the x and/or y coordinates.

Randomly filling the board with a given number of mines proved to be difficult using that approach though, so I transitioned to a single array of tile objects. Finding neighboring tiles using this approach wasn't as clear, but with some good ole' TDD, I figured it out.  The single array approach also made it easier to write in a functional style - no mutation, just always returning a fresh copy of the game board.  In face, I wrote all the game logic before writing even one line of UI code.  How's that for separation of concerns?

## next steps

The game isn't completely finished yet.  Here are a few things I'm working on:

- Enabling tile flagging.
- Completing the UI.  (The game works right now, but the interface is incomplete, and there isn't any UI logic that prevents further clicking when the game is lost, etc.)
- Using an Ordered Map as the underlying data structure, rather than an array. I haven't tested it, but using an Ordered Map means no iterating through an entire array when tiles update, since you can find the exact tile that changed and return a new object with only that key updated, using `Object.assign`.
- Host the game online so people can play it!