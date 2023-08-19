<template>
  <h1>Home</h1>
  <div style="width: fit-content; height:480px; margin:100px auto;  ">
    <div v-for="(row, i) in board" :key="i" style=" display: flex; flex-direction: row;">
      <div v-for="(cell, j) in board[i] " :key="j" @click="cellHandleClick(i, j, cell)" :class="{
        'TE3': cell.positionAttribute.value == 'TE3',
        'DE2': cell.positionAttribute.value == 'DE2',
        'TP3': cell.positionAttribute.value == 'TP3',
        'DP2': cell.positionAttribute.value == 'DP2',
        'STR': cell.positionAttribute.value == 'STR',
        'cell': cell.positionAttribute.value == 'NN0'
      }">
        <img :src="cell.imgURL" alt="Img_notFound">
      </div>
    </div>

  </div>
  <div class="rack">
    <div class="tile" v-for="tile in rack" :key="tile" @click="getInfo(tile)">
      <img :src="tile.imgURL" alt="Img_notFound">
    </div>
  </div>

  <div> {{ selectedState }} {{ currentSelected.selectedTile != null ? currentSelected.selectedTile.amount :
    currentSelected.selectedTile }}</div>



  <button @click="function () { console.log(board) }">check</button>
  <button @click="computedScore">get</button>
  <button @click="function () { boardShow = !boardShow }">{{ boardShow }}</button>
  <button @click="validate">validate</button>
  <h1>{{ turn }}</h1>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue';
import { evaluate } from 'mathjs';
import _ from 'lodash';
const TILE_ATTRIBUTE = {
  0: {
    tileId: 0,
    value: '0',
    amount: 5,
    point: 1,
    imgURL: 'http://localhost:5173/src/assets/0.png'


  },
  1: {
    tileId: 1,
    value: '1',
    amount: 6,
    point: 1,
    imgURL: 'http://localhost:5173/src/assets/1.png'
  },
  2: {
    tileId: 2,
    value: '2',
    amount: 6,
    point: 1,
    imgURL: 'http://localhost:5173/src/assets/2.png'
  },
  3: {
    tileId: 3,
    value: '3',
    amount: 5,
    point: 1,
    imgURL: 'http://localhost:5173/src/assets/3.png'
  },
  4: {
    tileId: 4,
    value: '4',
    amount: 5,
    point: 2,
    imgURL: 'http://localhost:5173/src/assets/4.png'
  },
  5: {
    tileId: 5,
    value: '5',
    amount: 4,
    point: 2
  },
  6: {
    tileId: 6,
    value: '6',
    amount: 4,
    point: 2
  },
  7: {
    tileId: 7,
    value: '7',
    amount: 4,
    point: 2

  },
  8: {
    tileId: 8,
    value: '8',
    amount: 4,
    point: 2,
  },
  9: {
    tileId: 9,
    value: '9',
    amount: 4,
    point: 2,
  },
  '+': {
    tileId: 21,
    value: '+',
    amount: 10,
    point: 1,
    imgURL: 'http://localhost:5173/src/assets/+.png'
  }, '-': {
    tileId: 22,
    value: '-',
    amount: 10,
    point: 1,
    imgURL: 'http://localhost:5173/src/assets/-.png'
  },
  '/': {
    tileId: 25,
    value: '/',
    amount: 10,
    point: 1,

  },
  '==': {
    tileId: 27,
    value: '==',
    amount: 10,
    point: 1,
    imgURL: 'http://localhost:5173/src/assets/=.png'
  }

}

const BOARD_ATTRIBUTE = {
  TE3: {
    value: 'TE3',
    imgURL: 'http://localhost:5173/src/assets/TE3.png'
  },
  TP3: {
    value: 'TP3',
    imgURL: 'http://localhost:5173/src/assets/TP3.png'

  },
  DE2: {
    value: 'DE2',
    imgURL: 'http://localhost:5173/src/assets/DE2.png'

  },
  DP2: {
    value: 'DP2',
    imgURL: 'http://localhost:5173/src/assets/DP2.png'

  },
  NN0: {
    value: 'NN0',
    imgURL: 'http://localhost:5173/src/assets/NN0.png'

  },
  STR: {
    value: 'STR',
    imgURL: 'http://localhost:5173/src/assets/STR.png'
  }
}
const rack = [TILE_ATTRIBUTE[1], TILE_ATTRIBUTE[2], TILE_ATTRIBUTE[3], TILE_ATTRIBUTE[4]
  , TILE_ATTRIBUTE['+'], TILE_ATTRIBUTE['=='], TILE_ATTRIBUTE['-'], TILE_ATTRIBUTE['0']]



var board = []
const boardShow = ref(false)
const turn = ref(0);




const BOARD_ATTRIBUTE_POSITION =
  [[BOARD_ATTRIBUTE.TE3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TE3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TE3],
  [BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DE2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TP3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TP3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DE2, BOARD_ATTRIBUTE.NN0],
  [BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DE2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DE2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0],
  [BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DE2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DE2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2],
  [BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TP3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TP3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0],
  [BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TP3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TP3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TP3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TP3, BOARD_ATTRIBUTE.NN0],
  [BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0],
  [BOARD_ATTRIBUTE.TE3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.STR, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TE3],
  [BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0],
  [BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TP3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TP3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TP3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TP3, BOARD_ATTRIBUTE.NN0],
  [BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TP3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TP3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0],
  [BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DE2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DE2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2],
  [BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DE2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DE2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0],
  [BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DE2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TP3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TP3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DE2, BOARD_ATTRIBUTE.NN0],
  [BOARD_ATTRIBUTE.TE3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TE3, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.DP2, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.NN0, BOARD_ATTRIBUTE.TE3]]
const initBoard = function () {

  board = reactive(Array(15)
    .fill([])
    .map((row, i) => Array(15)
      .fill({})
      .map((col, j) => ({
        i: i,
        j: j,
        tile: null,
        isReserved: false,
        positionAttribute: BOARD_ATTRIBUTE_POSITION[i][j],
        imgURL: BOARD_ATTRIBUTE_POSITION[i][j].imgURL
      }))
    ))
}


const selectedState = ref(false)
const currentSelected = reactive({
  imgURL: '',
  selectedTile: null

})

const getInfo = function (tile) {
  if (true) {
    currentSelected.imgURL = tile.imgURL
    console.log(currentSelected.imgURL)
    currentSelected.selectedTile = TILE_ATTRIBUTE[tile.value]
  }
}
const cellHandleClick = function (i, j, cell) {
  if (cell.isReserved == false && cell.tile != null) {
    //cancel tile on board if didnt submit
    cell.tile = null
    cell.imgURL = BOARD_ATTRIBUTE_POSITION[i][j].imgURL
    console.log(cell.tile)
    console.log(cell.imgURL)
  } else {
    placeInfo(i, j, cell)
  }

}
const placeInfo = function (i, j, cell) {
  if ( isAdjacent(i, j) && cell.isReserved != true) {
    board[i][j].imgURL = currentSelected.imgURL
    board[i][j].tile = currentSelected.selectedTile

    

  }
}


var isBreak = false
var equation = [[]]
const computedScore = function () {
  outer_loop: board.some((row, i) => {
    board[i].some((cell, j) => {
      if (board[i][j].tile != null && board[i][j].isReserved == false) {
        getEquation(i, j, board[i][j])
        isBreak = true;
        return true;
      }
    })
    return isBreak ? true : false
  })
  isBreak = false
  
}

const getEquation = function (i, j, cell) {
  try{
    validate()
    if(validate() == false){
      alert('please insert with the same direction')
      return
    }
  }catch(error){
    alert(error)
    return;
  }

  //vertical
  try{
    if (board[i + 1][j].tile != null || board[i - 1][j].tile != null) {
      getEquationVertical(i, j)
    }


    //horizontal

    else if (board[i][j + 1].tile != null || board[i][j - 1].tile != null) {
      getEquationHorizontal(i, j)
    }
  }
  catch(error){
    equation = [[]]
    alert(error)
    return;

  }

  try {
    equation.forEach(equationStatement => console.log(evaluate(equationStatement.map(tileOnCell => tileOnCell.tile.value).join(''))))
    equation.forEach(equationStatement => console.log(equationStatement.map(tileOnCell => tileOnCell.tile.value).join('')))
  }
  catch (error) {
    alert('error')
    return;
  }
  equation.forEach(equationStatement => equationStatement.forEach((tileOnCell) => board[tileOnCell.i][tileOnCell.j].isReserved = true))
  equation = [[]]
  turn.value++

}
const getEquationVertical = function (i, j) {
  let row = 0;
  var equationCount = 0;

  while (row < 15) {
    if (board[row][j].tile != null) {
      equation[equationCount].push(board[row][j]);
      console.log(board[row][j]);
    } else if (board[row][j].tile == null) {
      while (row < 15 && board[row][j].tile == null) {
        row++;
      }

      if (row < 15 && equation[0].length !== 0) {
        equation.push([]);
        equationCount++;
      }

      continue;
    }
    row++;
  }
  if(turn.value > 0){
  equation = equation.filter((equality) => _.uniq(equality.map(cell => cell.isReserved)).length > 1)
  }
  console.log(equation)
  if (equation.length > 1 || equation.length < 1) {
    throw new Error('Equation is more than one or didnt have')
  }
  // use uniq to loop isReserved in equation if uniq return true dont delete that equation and move to next equation , if equation uniq return false delete that equation 
  // if recieve more than 1 equation exit all function 

  row = 0;
  

  while (row < 15) {
    if (board[row][j].tile != null && (board[row][j + 1].tile != null || board[row][j - 1].tile != null)) {
      let col = 0;

      while (col < 15) {
        if (board[row][col].tile != null) {
          equation[equationCount].push(board[row][col]);
          console.log(board[row][col]);
        } else if (board[row][col].tile == null) {
          while (col < 15 && board[row][col].tile == null) {
            col++;
          }

          if (col < 15 && equation[0].length !== 0) {
            equation.push([]);
            equationCount++;
          }

          continue;
        }
        col++;
      }
    } else {
      while (row < 15 && !(board[row][j].tile != null && (board[row][j + 1].tile != null || board[row][j - 1].tile != null))) {
        row++;
      }
      continue;
    }
    row++;
  }
  if(turn.value > 0){
  equation = equation.filter((equality) => _.uniq(equality.map(cell => cell.isReserved)).length > 1)
  }
  try{
  equation.forEach((equality) => {
    if (evaluate(equality.map(tileOnCell => tileOnCell.tile.value).join('')) != true) {
      throw new Error('Not an equation')
    }
  })}
  catch(error){
    throw new Error('Not an equation')
  }

  //use uniq to loop isReserved in equation again if return false delete that equation
  //use evaluate loop in equation if it not return true(false,number) delete that equation
};


const getEquationHorizontal = function (i, j) {
  let col = 0;
  var equationCount = 0;
  while (col < 15) {
    if (board[i][col].tile != null) {
      equation[equationCount].push(board[i][col])
      console.log(board[i][col])
    }
    else if (board[i][col].tile == null) {
      while (col < 15 && board[i][col].tile == null) {
        col++

      }

      if (col < 15 && equation[0].length !== 0) {
        equation.push([])
        equationCount++

      }
      continue;

    }
    col++
  }
  if(turn.value  > 0){
  equation = equation.filter((equality) => _.uniq(equality.map(cell => cell.isReserved)).length > 1)
  }
  console.log(equation)
  if (equation.length > 1 || equation.length < 1) {
    throw new Error('Equation is more than one or didnt have')
  }
  // use uniq to loop isReserved in equation if uniq return true dont delete that equation and move to next equation , if equation uniq return false delete that equation 
  // if recieve more than 1 equation exit all function 
  col = 0
  

  while (col < 15) {
    if (board[i][col].tile != null && (board[i + 1][col].tile != null || board[i - 1][col].tile != null)) {
      let row = 0;
      while (row < 15) {
        if (board[row][col].tile != null) {
          equation[equationCount].push(board[row][col])
          console.log(board[row][col])
        }
        else if (board[row][col].tile == null) {
          while (row < 15 && board[row][col].tile == null) {

            row++

          }
          if (row < 15 && equation[0].length !== 0) {
            equation.push([])
            equationCount++

          }

          continue;
        }
        row++
      }


    }
    else {
      while (col < 15 && !(board[i][col].tile != null && (board[i + 1][col].tile != null || board[i - 1][col].tile != null))) {
        col++
      }
      continue;
    }
    col++

  }
  if(turn.value > 0){
  equation = equation.filter((equality) => _.uniq(equality.map(cell => cell.isReserved)).length > 1)
  }
  try{
  equation.forEach((equality) => {
    if (evaluate(equality.map(tileOnCell => tileOnCell.tile.value).join('')) != true) {
      throw new Error('Not an equation')
    }
  })}
  catch(error){
    throw new Error('Not an equation')
  }

  //use uniq to loop isReserved in equation again if return false delete that equation
  //use evaluate loop in equation if it not return true(false,number) delete that equation

}



const validate = function () {
  let validateArray = [[], []]
  board.forEach((row, i) => {
    board[i].forEach((col, j) => {
      
      if(turn.value == 0 && board[7][7].tile == null){
        throw new Error('please start at center of board')
      }
    
      if (board[i][j].tile != null && board[i][j].isReserved == false) {
        validateArray[0].push(board[i][j].i)
        validateArray[1].push(board[i][j].j)
      }
    })
  })
  console.log(_.uniq(validateArray[0]).length > 1 && _.uniq(validateArray[1]).length > 1 ? false : true)
  return _.uniq(validateArray[0]).length > 1 && _.uniq(validateArray[1]).length > 1 ? false : true;

}

const isAdjacent = function (row, col) {
  //upper-left
  try {
    if (board[row - 1][col - 1].tile != null) {
      return board[row][col - 1].tile != null && board[row - 1][col].tile != null ? false : true
    }
  } catch { }
  //upper-right
  try {
    if (board[row - 1][col + 1].tile != null) {
      return board[row][col + 1].tile != null && board[row - 1][col].tile != null ? false : true
    }
  } catch { }
  //lower-left
  try {
    if (board[row + 1][col - 1].tile != null) {
      return board[row][col - 1].tile != null && board[row + 1][col].tile != null ? false : true
    }
  } catch { }
  //lower-right
  try {
    if (board[row + 1][col + 1].tile != null) {
      return board[row + 1][col].tile != null && board[row][col + 1].tile != null ? false : true
    }
  } catch { }
  return true;

}

onMounted(() => {
  initBoard()
})



</script>

<style>
body {
  background-color: rgb(12, 48, 48);
}

.rack {
  display: flex;

  margin: 0 auto;
  flex-direction: row;
  height: 35px;
  width: fit-content;


}

.tile {
  height: 35px;
  width: 35px;
  background-color: cadetblue;
  border: 1px solid black;

}

.cell {
  background-color: blue;
  width: 35px;
  height: 35px;
  border: 1px solid black;


}

.TE3 {
  background-color: red;
  width: 35px;
  height: 35px;
  border: 1px solid black;
}

.DE2 {
  background-color: yellow;
  width: 35px;
  height: 35px;
  border: 1px solid black;


}

.TP3 {
  background-color: cyan;
  width: 35px;
  height: 35px;
  border: 1px solid black;

}

.DP2 {
  background-color: orange;
  width: 35px;
  height: 35px;
  border: 1px solid black;

}

.STR {
  background-color: pink;
  width: 35px;
  height: 35px;
  border: 1px solid black;
}
</style>



