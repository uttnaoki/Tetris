document.getElementById("hello_text").textContent = "はじめてのJavaScript";

var board_row = 20;
var board_col = 10;
$("#board").append('<table id="board_table"></table>')
for ( row=0; row<board_row; row++ ) {
  $("#board_table").append('<tr id="board_table_row' + row + '">')
  for ( col=0; col<board_col; col++ ) {
    $("#board_table_row" + row).append('<td></td>')
  }
  $("#board_table").append('</tr>')
}

var count = 0;
var cells;
// ブロックのパターン
var blocks = {
  i: {
    class: "i",
    pattern: [
      [1, 1, 1, 1]
    ]
  },
  o: {
    class: "o",
    pattern: [
      [1, 1],
      [1, 1]
    ]
  },
  t: {
    class: "t",
    pattern: [
      [0, 1, 0],
      [1, 1, 1]
    ]
  },
  s: {
    class: "s",
    pattern: [
      [0, 1, 1],
      [1, 1, 0]
    ]
  },
  z: {
    class: "z",
    pattern: [
      [1, 1, 0],
      [0, 1, 1]
    ]
  },
  j: {
    class: "j",
    pattern: [
      [1, 0, 0],
      [1, 1, 1]
    ]
  },
  l: {
    class: "l",
    pattern: [
      [0, 0, 1],
      [1, 1, 1]
    ]
  }
};

// キーボードイベントを監視する
document.addEventListener("keydown", onKeyDown);

loadTable();
var refreshIntervalId = setInterval(function () {
  count++;
  document.getElementById("hello_text").textContent = "はじめてのJavaScript(" + count + ")";
  if (hasFallingBlock()) { // 落下中のブロックがあるか確認する
    fallBlocks();// あればブロックを落とす
  } else { // なければ
    deleteRow();// そろっている行を消す
    if (generateBlock()) { // ランダムにブロックを作成する
        alert("game over!");
        clearInterval(refreshIntervalId);
    }
  }
}, 1000);

/* ------ ここから下は関数の宣言部分 ------ */

function loadTable() {
  cells = [];
  var td_array = document.getElementsByTagName("td");
  var index = 0;
  for (var row = 0; row < 20; row++) {
    cells[row] = [];
    for (var col = 0; col < 10; col++) {
      cells[row][col] = td_array[index];
      index++;
    }
  }

}

function fallBlocks() {
  // 1. 底についていないか？
  for (var col = 0; col < board_col; col++) {
    if (cells[19][col].blockNum === fallingBlockNum) {
      isFalling = false;
      return; // 一番下の行にブロックがいるので落とさない
    }
  }
  // 2. 1マス下に別のブロックがないか？
  for (var row = board_row-2; row >= 0; row--) {
    for (var col = 0; col < board_col; col++) {
      if (cells[row][col].blockNum === fallingBlockNum) {
        if (cells[row + 1][col].className !== "" && cells[row + 1][col].blockNum !== fallingBlockNum){
          isFalling = false;
          return; // 一つ下のマスにブロックがいるので落とさない
        }
      }
    }
  }
  // 下から二番目の行から繰り返しクラスを下げていく
  for (var row = board_row-2; row >= 0; row--) {
    for (var col = 0; col < board_col; col++) {
      if (cells[row][col].blockNum === fallingBlockNum) {
        cells[row + 1][col].className = cells[row][col].className;
        cells[row + 1][col].blockNum = cells[row][col].blockNum;
        cells[row][col].className = "";
        cells[row][col].blockNum = null;
      }
    }
  }
}

var isFalling = false;
function hasFallingBlock() {
  // 落下中のブロックがあるか確認する
  return isFalling;
}

function deleteRow() {
  // そろっている行を消す
  for (var row = 19; row >= 0; row--) {
    var canDelete = true;
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].className === "") {
        canDelete = false;
      }
    }
    if (canDelete) {
      // 1行消す
      for (var col = 0; col < 10; col++) {
        cells[row][col].className = "";
      }
      // 上の行のブロックをすべて1マス落とす
      for (var downRow = row - 1; row >= 0; row--) {
        for (var col = 0; col < 10; col++) {
          cells[downRow + 1][col].className = cells[downRow][col].className;
          cells[downRow + 1][col].blockNum = cells[downRow][col].blockNum;
          cells[downRow][col].className = "";
          cells[downRow][col].blockNum = null;
        }
      }
    }
  }
}

var fallingBlockNum = 0;
function generateBlock() {
  // ランダムにブロックを生成する
  // 1. ブロックパターンからランダムに一つパターンを選ぶ
  var keys = Object.keys(blocks);
  var nextBlockKey = keys[Math.floor(Math.random() * keys.length)];
  var nextBlock = blocks[nextBlockKey];
  var nextFallingBlockNum = fallingBlockNum + 1;
  // 2. 選んだパターンをもとにブロックを配置する
  var pattern = nextBlock.pattern;

  var flag = 0;

  for (var row = 0; row < pattern.length; row++) {
    for (var col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col]) {
        if (cells[row][col + 3].className !== "") {
          flag = 1;
        }
        cells[row][col + 3].className = nextBlock.class;
        cells[row][col + 3].blockNum = nextFallingBlockNum;
      }
    }
  }
  // 3. 落下中のブロックがあるとする
  isFalling = true;
  fallingBlockNum = nextFallingBlockNum;

  return flag;
}

function findFalingBlock() {
  var FalingBlockCells = [];
  for (var row = 0; row < board_row; row++) {
    for (var col = 0; col < board_col; col++) {
      if (cells[row][col].blockNum === fallingBlockNum) {
        FalingBlockCells.push([row, col])
      }
    }
  }
  return FalingBlockCells;
}

// ブロックを右に移動させる
function moveRight() {
  var FalingBlockCells = findFalingBlock();
  var flag = 1

  // ブロックを右に移動できるか判定(NG: flag <- 0)
  for (var c of FalingBlockCells) {
    if (c[1] === (board_col - 1) ||
        cells[c[0]][c[1] + 1].blockNum !== fallingBlockNum &&
        cells[c[0]][c[1] + 1].className !== "")
    {
      flag = 0;
    }
  }

  if (flag) {
    for (var c of FalingBlockCells.reverse()) {
        cells[c[0]][c[1] + 1].className = cells[c[0]][c[1]].className;
        cells[c[0]][c[1] + 1].blockNum = cells[c[0]][c[1]].blockNum;
        cells[c[0]][c[1]].className = "";
        cells[c[0]][c[1]].blockNum = null;
    }
  }
}

// ブロックを左に移動させる
function moveLeft() {
  var FalingBlockCells = findFalingBlock();
  var flag = 1

  // ブロックを左に移動できるか判定(NG: flag <- 0)
  for (var c of FalingBlockCells) {
    if (c[1] === 0 ||
        cells[c[0]][c[1] - 1].blockNum !== fallingBlockNum &&
        cells[c[0]][c[1] - 1].className !== "")
    {
      flag = 0;
    }
  }

  if (flag) {
    for (var c of FalingBlockCells) {
        cells[c[0]][c[1] - 1].className = cells[c[0]][c[1]].className;
        cells[c[0]][c[1] - 1].blockNum = cells[c[0]][c[1]].blockNum;
        cells[c[0]][c[1]].className = "";
        cells[c[0]][c[1]].blockNum = null;
    }
  }
}

// キー入力によってそれぞれの関数を呼び出す
function onKeyDown(event) {
  if (event.keyCode === 37) {
    moveLeft();
  } else if (event.keyCode === 39) {
    moveRight();
  } else if(event.keyCode === 40) {
    fallBlocks();
  }
}
