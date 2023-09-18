<template>
  <h1 style="margin: 0;">Math-Scrabble</h1>
  <div style="width: fit-content; height:480px; margin:0px auto; ">
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


  <div v-if="showselecttile == true" class="select_window_background">
    <div class="select_window">
      please choose tile
      <div class="special_tile_group">
        <div v-for="stile in specialtile" class="special_tile" @click="submitSpecialTile(stile)">
          <img :src="stile.imgURL" alt="Img_notFound">
        </div>
      </div>
      <div class="cancel_button" @click="cancelSelectTile">cancel</div>
    </div>
  </div>

  <div v-if="show_change_tile == true" class="select_window_background">
    <div class="select_window">
      please choose tile to change
      <div :class="ctile_parent">
        <div v-for="ctile in changetile" class="special_tile" @click="selectTileToChange(ctile, $event)">
          <img :src="ctile.imgURL" alt="Img_notFound">
        </div>
      </div>
      <div class="cancel_button" @click="submitChangeTile">change</div>
      <div class="cancel_button" @click="cancelChangeTile">cancel</div>
    </div>
  </div>
  <div class="operation">
    <div class="rack">
      <div class="tile" v-for="slot in Object.entries(rack)" :key="slot" @click="tileHandleClick(slot)">
        <img :src="slot[1].tile == null ? holeImgUrl : slot[1].tile.imgURL" alt="Img_notFound"
          :class="{ 'clicked': slot[1].clicked == true }">
      </div>
    </div>
    <button @click="initAll" v-if="turn < 0">(☛´∀｀*)☛ กดเริ่มนะจ้ะ</button>
    <button @click="computedScore">ซับมิด อีคัวชั่น</button>
    <button @click="retrieveAll">retrieveAll</button>
    <button @click="selectChangeTile">changeTile</button>
    <button @click="function(){bot_turn = !bot_turn }">botttttttt</button>
    <button v-if="checkSpecialTile() == true" @click="selectSpecialTile">
      {{ showselecttile == true ? 'selecting tile' : 'select tile' }}
    </button>
    <h3>เทินเท่าไหร่แล้วงับ : {{ turn == -1 ? "-" : turn }}</h3>
  </div>

  <div class="user_panel">
    <h4>ยัวร์สกอร์งับ : </h4>
    <h1>{{ player_score }}</h1>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue';
import { column, evaluate } from 'mathjs';
import _ from 'lodash';
import { Permutation, Combination } from 'https://cdn.jsdelivr.net/npm/js-combinatorics@2.1.1/combinatorics.min.js';
// let c = Permutation.of('abcdefgh', 4);
// // let a = Permutation.of('abcd');
// for (const elem of c) {
// console.log(elem) 
// }

const TILE_ATTRIBUTE = {
  0: {

    value: '0',
    amount: 5,
    point: 1,
    imgURL: 'http://localhost:5173/src/assets/0.png'


  },
  1: {

    value: '1',
    amount: 6,
    point: 1,
    imgURL: 'http://localhost:5173/src/assets/1.png'
  },
  2: {

    value: '2',
    amount: 6,
    point: 1,
    imgURL: 'http://localhost:5173/src/assets/2.png'
  },
  3: {

    value: '3',
    amount: 5,
    point: 1,
    imgURL: 'http://localhost:5173/src/assets/3.png'
  },
  4: {

    value: '4',
    amount: 5,
    point: 2,
    imgURL: 'http://localhost:5173/src/assets/4.png'
  },
  5: {

    value: '5',
    amount: 4,
    point: 2,
    imgURL: 'http://localhost:5173/src/assets/5.png'

  },
  6: {

    value: '6',
    amount: 4,
    point: 2,
    imgURL: 'http://localhost:5173/src/assets/6.png'

  },
  7: {

    value: '7',
    amount: 4,
    point: 2,
    imgURL: 'http://localhost:5173/src/assets/7.png'


  },
  8: {

    value: '8',
    amount: 4,
    point: 2,
    imgURL: 'http://localhost:5173/src/assets/8.png'

  },
  9: {

    value: '9',
    amount: 4,
    point: 2,
    imgURL: 'http://localhost:5173/src/assets/9.png'

  },
  10: {

    value: '10',
    amount: 2,
    point: 3,
    imgURL: 'http://localhost:5173/src/assets/10.png'

  },
  11: {

    value: '11',
    amount: 1,
    point: 4,
    imgURL: 'http://localhost:5173/src/assets/11.png'

  },
  12: {

    value: '12',
    amount: 2,
    point: 3,
    imgURL: 'http://localhost:5173/src/assets/12.png'

  },
  13: {

    value: '13',
    amount: 1,
    point: 6,
    imgURL: 'http://localhost:5173/src/assets/13.png'

  },
  14: {

    value: '14',
    amount: 1,
    point: 4,
    imgURL: 'http://localhost:5173/src/assets/14.png'

  },
  15: {

    value: '15',
    amount: 1,
    point: 4,
    imgURL: 'http://localhost:5173/src/assets/15.png'

  },
  16: {

    value: '16',
    amount: 1,
    point: 4,
    imgURL: 'http://localhost:5173/src/assets/16.png'

  },
  17: {

    value: '17',
    amount: 1,
    point: 6,
    imgURL: 'http://localhost:5173/src/assets/17.png'

  },
  18: {

    value: '18',
    amount: 1,
    point: 4,
    imgURL: 'http://localhost:5173/src/assets/18.png'

  },
  19: {

    value: '19',
    amount: 1,
    point: 7,
    imgURL: 'http://localhost:5173/src/assets/19.png'

  },
  20: {

    value: '20',
    amount: 1,
    point: 5,
    imgURL: 'http://localhost:5173/src/assets/20.png'

  },
  '+': {

    value: '+',
    amount: 4,
    point: 2,
    imgURL: 'http://localhost:5173/src/assets/plus.png'
  }, '-': {

    value: '-',
    amount: 4,
    point: 2,
    imgURL: 'http://localhost:5173/src/assets/minus.png'
  },
  'plusminus': {

    value: 'plusminus',
    amount: 5,
    point: 1,
    imgURL: 'http://localhost:5173/src/assets/plusminus.png'
  },

  '*': {

    value: '*',
    amount: 4,
    point: 2,
    imgURL: 'http://localhost:5173/src/assets/multiply.png'
  },
  '/': {

    value: '/',
    amount: 4,
    point: 2,
    imgURL: 'http://localhost:5173/src/assets/divide.png'


  },
  'multiplydivide': {

    value: 'multiplydivide',
    amount: 4,
    point: 1,
    imgURL: 'http://localhost:5173/src/assets/multiplydivide.png'


  },
  '==': {

    value: '==',
    amount: 11,
    point: 1,
    imgURL: 'http://localhost:5173/src/assets/equal.png'
  },
  'blank': {
    value: 'blank',
    amount: 4,
    point: 0,
    imgURL: 'http://localhost:5173/src/assets/blank.png'
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

let board = []
let bag = []
let rack = reactive({})
let botRack = []

const clicked = ref('clicked')

const turn = ref(-1);
const botTurn = ref(false)
const holeImgUrl = 'http://localhost:5173/src/assets/hole.png'

const oneDigit = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const twoDigit = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
const sign = ['+', '-', '*', '/', '==']

const change_quota = ref(0)
const player_score = ref(0)
const bot_score = ref(0)
const bot_turn = ref(false)

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
        value: '',
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

const tileHandleClick = function (slot) {
  for (const tile of Object.entries(rack)) {
    if (tile[1].clicked == true) {
      tile[1].clicked = false
      let swap1 = tile[1].tile
      let swap2 = slot[1].tile
      tile[1].tile = swap2
      slot[1].tile = swap1
      currentSelected.imgURL = ''
      currentSelected.selectedTile = null
      selectedState.value = !selectedState.value
      return
    }

  }
  getInfo(slot)
}
const getInfo = function (slot) {
  if (slot[1].tile != null) {
    currentSelected.imgURL = slot[1].tile.imgURL
    console.log(currentSelected.imgURL)
    currentSelected.selectedTile = slot[1].tile

    console.log(currentSelected.selectedTile.value)

    slot[1].clicked = !slot[1].clicked
    selectedState.value = !selectedState.value
  }
}
const cellHandleClick = function (i, j, cell) {
  if (cell.isReserved == false && cell.tile != null) {
    //cancel tile on board if didnt submit
    for (const tile of Object.entries(rack)) {
      if (tile[1].tile == null) {
        tile[1].tile = cell.tile
        break
      }
    }
    cell.tile = null
    cell.imgURL = BOARD_ATTRIBUTE_POSITION[i][j].imgURL
    console.log(cell.tile)
    console.log(cell.imgURL)
  } else {
    placeInfo(i, j, cell)
  }

}
const placeInfo = function (i, j, cell) {
  if (isAdjacent(i, j) && cell.isReserved != true && selectedState.value == true) {
    board[i][j].imgURL = currentSelected.imgURL
    board[i][j].tile = currentSelected.selectedTile
    currentSelected.imgURL = ""
    currentSelected.selectedTile = null
    for (const tile of Object.entries(rack)) {
      if (tile[1].clicked == true) {
        tile[1].tile = null
        tile[1].clicked = false
      }
    }
    selectedState.value = !selectedState.value
  }
}
let isBreak = false
let equation = [[]]
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
  if (isBreak == false) {
    alert('ยังไม่ได้ลงเบี้ยสักตัวเลยน้อง')
  }
  isBreak = false

}

const checkSpecialTile = function () {
  if (currentSelected.selectedTile == null) {
    return false
  }
  let checktile = currentSelected.selectedTile.value
  if (checktile == 'blank' || checktile == 'plusminus' || checktile == 'multiplydivide') {
    return true
  }


}

let showselecttile = ref(false)
let specialtile = []
const selectSpecialTile = function () {
  showselecttile.value = true
  let checktile = currentSelected.selectedTile.value
  if (checktile == 'blank') {
    for (const [key, value] of Object.entries(TILE_ATTRIBUTE)) {
      if (!(key === "blank" || key === "plusminus" || key === "multiplydivide")) {
        specialtile.push(TILE_ATTRIBUTE[key])
      }
    }

  }
  else if (checktile == 'plusminus') {
    specialtile.push(TILE_ATTRIBUTE['+'])
    specialtile.push(TILE_ATTRIBUTE['-'])

  }
  else if (checktile == 'multiplydivide') {
    specialtile.push(TILE_ATTRIBUTE['*'])
    specialtile.push(TILE_ATTRIBUTE['/'])

  }

}
const submitSpecialTile = function (stile) {
  for (const tile of Object.entries(rack)) {
    if (tile[1].clicked == true) {
      tile[1].clicked = false
      //assign special tile only value
      // tile[1].tile.value = stile.value

      tile[1].tile = Object.create(TILE_ATTRIBUTE[tile[1].tile.value])
      tile[1].tile.value = stile.value
      currentSelected.imgURL = ''
      currentSelected.selectedTile = null
      selectedState.value = !selectedState.value
      showselecttile.value = !showselecttile.value
      specialtile = []
      return
    }
  }


}
const cancelSelectTile = function () {
  for (const tile of Object.entries(rack)) {
    if (tile[1].clicked == true) {
      tile[1].clicked = false
      currentSelected.imgURL = ''
      currentSelected.selectedTile = null
      selectedState.value = !selectedState.value
      showselecttile.value = !showselecttile.value
      specialtile = []
      return
    }
  }
}

const retrieveAll = function () {
  board.some((row, i) => {
    board[i].some((cell, j) => {
      if (board[i][j].tile != null && board[i][j].isReserved == false) {
        for (const tile of Object.entries(rack)) {
          if (tile[1].tile == null) {
            tile[1].tile = board[i][j].tile
            board[i][j].tile = null
            board[i][j].imgURL = BOARD_ATTRIBUTE_POSITION[i][j].imgURL
          }
        }
      }
    })

  })

}
const getEquation = function (i, j, cell) {
  try {
    validate()
    if (validate() == false) {
      alert('please insert with the same direction')
      return
    }
  } catch (error) {
    alert(error)
    return;
  }


  try {
    //vertical
    if (board[i + 1][j].tile != null || board[i - 1][j].tile != null) {
      getEquationVertical(i, j)
    }
    //horizontal
    else if (board[i][j + 1].tile != null || board[i][j - 1].tile != null) {
      getEquationHorizontal(i, j)
    }
    else {
      alert('วางส้นตรีนไรครับเนี่ย')
      return
    }
  }
  catch (error) {
    equation = [[]]
    alert(error)
    return;

  }
  try {
    equation.forEach(equationStatement => {
      let digitLogicCount = 0
      let zeroLogicCount = 0

      equationStatement.forEach(tileOnCell => {
        if (digitLogicCount == 4) {
          throw new Error('digit logic หว่อง')
        }
        if (tileOnCell.tile.value != '0' && zeroLogicCount == 0) {
          zeroLogicCount = -1
        }
        if (tileOnCell.tile.value == '+' && digitLogicCount == 0) {
          throw new Error('plus sign หว่อง')
        }
        if (oneDigit.indexOf(tileOnCell.tile.value) !== -1) {
          digitLogicCount++
        }
        else if (twoDigit.indexOf(tileOnCell.tile.value) !== -1) {
          digitLogicCount = digitLogicCount + 3
        }
        else if (sign.indexOf(tileOnCell.tile.value) !== -1) {
          digitLogicCount = 0
          zeroLogicCount = 0
        }
        if (zeroLogicCount == 1) {
          throw new Error('zero digit in หว่อง position')
        }

        if (tileOnCell.tile.value == '0' && zeroLogicCount != -1) {
          zeroLogicCount++
        }
      }
      )


    });
  }
  catch (error) {
    equation = [[]]
    console.log(error)
    alert(error)
    return
  }
  try {
    equation.forEach(equationStatement => console.log(evaluate(equationStatement.map(tileOnCell => tileOnCell.tile.value).join(''))))
    equation.forEach(equationStatement => console.log(equationStatement.map(tileOnCell => tileOnCell.tile.value).join('')))
  }
  catch (error) {
    equation = [[]]
    alert('error')
    return;
  }
  let score = 0
  equation.forEach(equationStatement => {
    let multipier = 1
    let statement_score = 0
    equationStatement.forEach(tileOnCell => {
      if (tileOnCell.positionAttribute.value == BOARD_ATTRIBUTE.DE2.value && tileOnCell.isReserved === false) {
        multipier = multipier * 2
        statement_score = statement_score + tileOnCell.tile.point

      }
      else if (tileOnCell.positionAttribute.value == BOARD_ATTRIBUTE.DP2.value && tileOnCell.isReserved === false) {
        statement_score = statement_score + (tileOnCell.tile.point * 2)

      }
      else if (tileOnCell.positionAttribute.value == BOARD_ATTRIBUTE.TE3.value && tileOnCell.isReserved === false) {
        multipier = multipier * 3
        statement_score = statement_score + tileOnCell.tile.point
      }
      else if (tileOnCell.positionAttribute.value == BOARD_ATTRIBUTE.TP3.value && tileOnCell.isReserved === false) {
        statement_score = statement_score + (tileOnCell.tile.point * 3)
      }
      else {
        statement_score = statement_score + tileOnCell.tile.point
      }
    })
    score = score + (statement_score * multipier)

  })
  let bingo_count = 0
  for (const slot of Object.entries(rack)) {
    if (slot[1].tile != null) {
      break
    }
    bingo_count += 1
  }
  if (bingo_count == 8) {
    score += 40
  }
  let interval_score = 0
  let score_counting = setInterval(function () {
    interval_score++;
    player_score.value++;
    if (interval_score == score) { clearInterval(score_counting) }
  }, 100)
  console.log(score)
  equation.forEach(equationStatement => equationStatement.forEach((tileOnCell) => board[tileOnCell.i][tileOnCell.j].isReserved = true))
  equation = [[]]
  turn.value++
  bot_turn.value = true 
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
      if (board[row][j].isReserved == false) {
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
      }
    } else {
      while (row < 15 && !(board[row][j].tile != null && (board[row][j + 1].tile != null || board[row][j - 1].tile != null))) {
        row++;
      }
      continue;
    }
    row++;
  }
  if (equation.length == 1 && turn.value > 0) {
    equation = equation.filter((equality) => _.uniq(equality.map(cell => cell.isReserved)).length > 1)
  }
  try {
    equation.forEach((equality) => {
      if (evaluate(equality.map(tileOnCell => tileOnCell.tile.value).join('')) != true) {
        throw new Error('Not an equation')
      }
    })
  }
  catch (error) {
    throw new Error('Not an equation')
  }

  //use uniq to loop isReserved in equation again if return false delete that equation
  //use evaluate loop in equation if it not return true(false,number) delete that equation
}

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
      if (board[i][col].isReserved == false) {
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
    }
    else {
      while (col < 15 && !(board[i][col].tile != null && (board[i + 1][col].tile != null || board[i - 1][col].tile != null))) {
        col++
      }
      continue;
    }
    col++

  }
  if (equation.length == 1 && turn.value > 0) {
    equation = equation.filter((equality) => _.uniq(equality.map(cell => cell.isReserved)).length > 1)
  }
  try {
    equation.forEach((equality) => {
      if (evaluate(equality.map(tileOnCell => tileOnCell.tile.value).join('')) != true) {
        throw new Error('Not an equation')
      }
    })
  }
  catch (error) {
    throw new Error('Not an equation')
  }

  //use uniq to loop isReserved in equation again if return false delete that equation
  //use evaluate loop in equation if it not return true(false,number) delete that equation

}

const validate = function () {
  let validateArray = [[], []]
  board.forEach((row, i) => {
    board[i].forEach((col, j) => {

      if (turn.value == 0 && board[7][7].tile == null) {
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
const initBag = function () {
  for (const [key, value] of Object.entries(TILE_ATTRIBUTE)) {
    for (let i = 0; i < value.amount; i++) {
      bag.push(TILE_ATTRIBUTE[key])

    }
  }
  console.log(bag)
}

let show_change_tile = ref(false)
let changetile = []
let selectchangetile = []
let selectchangetile_index = []
const selectChangeTile = function () {
  for (const slot of Object.entries(rack)) {
    if (slot[1].tile == null) {
      return
    }
  }
  for (const slot of Object.entries(rack)) {
    changetile.push(slot[1].tile)
  }
  show_change_tile.value = true

}

const ctile_parent = ref('change_tile_group')
const selectTileToChange = function (ctile, event) {
  const change_tile_parent = document.querySelector(`.${ctile_parent.value}`)
  const change_tile_child = event.currentTarget

  if (!(event.target.classList.contains('clicked'))) {
    selectchangetile.push(ctile)
    selectchangetile_index.push(Array.from(change_tile_parent.children).indexOf(change_tile_child))
    event.target.classList.add("clicked")


  }
  else if (event.target.classList.contains('clicked')) {
    let c_tile_index = selectchangetile.indexOf(ctile)
    let position_index = selectchangetile_index.indexOf(Array.from(change_tile_parent.children).indexOf(change_tile_child))
    selectchangetile.splice(c_tile_index, 1)
    selectchangetile_index.splice(position_index, 1)
    event.target.classList.remove("clicked")



  }

}
const getTileFromImgURL = function (ctile) {
  for (const [key, value] of Object.entries(TILE_ATTRIBUTE)) {
    if (TILE_ATTRIBUTE[key].imgURL === ctile.imgURL) {
      return TILE_ATTRIBUTE[key]
    }

  }
}
const submitChangeTile = function () {

  // push element from selectchangetile to bag with imgURL

  for (const ctile of selectchangetile) {
    bag.push(getTileFromImgURL(ctile))
  }

  let position_index = 0
  for (const slot of Object.entries(rack)) {

    if (selectchangetile.indexOf(slot[1].tile) != -1 && selectchangetile_index.indexOf(position_index) != -1) {

      let index = selectchangetile.indexOf(slot[1].tile)
      selectchangetile.splice(index, 1)
      //fix to set null at right position
      slot[1].tile = null
    }
    if (slot[1].clicked == true) {
      slot[1].clicked = false
    }
    position_index++
  }
  currentSelected.imgURL = ''
  currentSelected.selectedTile = null
  selectedState.value = false
  show_change_tile.value = !show_change_tile.value
  changetile = []
  selectchangetile = []
  selectchangetile_index = []

  if (change_quota.value <= 3 && turn.value === 0) {
    change_quota.value++
    return
  }
  turn.value++
  return
}
const cancelChangeTile = function () {
  for (const slot of Object.entries(rack)) {
    if (slot[1].clicked == true) {
      slot[1].clicked = false
    }
  }
  currentSelected.imgURL = ''
  currentSelected.selectedTile = null
  selectedState.value = false
  show_change_tile.value = !show_change_tile.value
  changetile = []
  selectchangetile = []
  selectchangetile_index = []
  return
}
const assignRack = function () {
  rack = reactive({
    1: {
      tile: null,
      clicked: false
    }, 2: {
      tile: null
      ,
      clicked: false
    }, 3: {
      tile: null,
      clicked: false
    }, 4: {
      tile: null,
      clicked: false
    }, 5: {
      tile: null,
      clicked: false
    }, 6: {
      tile: null,
      clicked: false
    }, 7: {
      tile: null,
      clicked: false
    }, 8: {
      tile: null,
      clicked: false
    }
  })
}
const initRack = function () {
  for (const [key, value] of Object.entries(rack)) {
    let index = Math.floor(Math.random() * bag.length)
    rack[key].tile = bag[index]
    bag.splice(index, 1)

  }
  console.log(rack)
}
const initBot = function () {
  for (let i = 0; i < 8; i++) {
    let index = Math.floor(Math.random() * bag.length)
    botRack.push(bag[index])
    bag.splice(index, 1)
  }

}
const Bot = function () {
  const allPossibleCell = []
  const validAllPossibleCell = []
  let indexScore = 0
  //make vertical can get all possible cell
  const verticalCell = []
  for (let i = 0; i < board.length; i++) {
    verticalCell.push([])
    board.forEach(row => verticalCell[i].push(row[i]))
    
  }

  //get vertical
  for (const col of verticalCell) {
    let indexCell = 1
    for (let index = 0; index < verticalCell.length; index++) {
      while(indexCell <= 15){
        allPossibleCell.push(col.slice(index, indexCell++))
      }
      indexCell = index+2
    }
  }
  //get horizontal
  for (const row of board) {
    let indexCell = 1
    for (let index = 0; index < board.length; index++) {
      while(indexCell <= 15){
        allPossibleCell.push(row.slice(index, indexCell++))
      }
      indexCell = index+2
    }
  }
  console.log(allPossibleCell)
  allPossibleCell.forEach(cellGroup => {
    
    //first turn include str
    if (turn.value === 0 && cellGroup.map(cell => cell.positionAttribute.value).includes(BOARD_ATTRIBUTE.STR.value)==false) {
      return
    }
    //adjacent
    if (cellGroup.map(cell => isAdjacent(cell.i, cell.j)).includes(false)) {
      return
    }
    //include isReserved = true
    if (turn.value != 0 && cellGroup.map(cell => cell.isReserved).includes(true) == false) {
      return
    }
    //-array(3) .filter to get range of permutation = 2 (1 is reserved)
    const permuteLength = cellGroup.filter(cell => { cell.isReserved == false }).length
    //-permute (get all permute array of rack)
    const permutations = Permutation.of(botRack, permuteLength)
    
    for (const permute of permutations) {
      const tileGroup = cellGroup.map(cell => cell.isReserved ? cell.tile : permute.shift())
  
      
      try{
      if (evaluate(tileGroup.map(tile => tile.value).join('')) != true) {
        continue
      }}
      catch(error){
        continue
      }
      
      let digitLogicCount = 0
      let zeroLogicCount = 0
      let breakPermute = false

      tileGroup.some(tile => {
        if (digitLogicCount == 4) {
          breakPermute = true
          return true
          //throw new Error('digit logic หว่อง')
        }
        if (tile.value != '0' && zeroLogicCount == 0) {
          zeroLogicCount = -1
        }
        if (tile.value == '+' && digitLogicCount == 0) {
          breakPermute = true
          return true
          //throw new Error('plus sign หว่อง')
        }
        if (oneDigit.indexOf(tile.value) !== -1) {
          digitLogicCount++
        }
        else if (twoDigit.indexOf(tile.value) !== -1) {
          digitLogicCount = digitLogicCount + 3
        }
        else if (sign.indexOf(tile.value) !== -1) {
          digitLogicCount = 0
          zeroLogicCount = 0
        }
        if (zeroLogicCount == 1) {
          breakPermute = true
          return true
          //throw new Error('zero digit in หว่อง position')
        }
        if (tile.value == '0' && zeroLogicCount != -1) {
          zeroLogicCount++
        }
      }) 

      if (breakPermute === true) {
        continue
      }
      let score = 0
      let multipier = 1
      let statement_score = 0
      tileGroup.forEach((tile,i) => {
        if (cellGroup[i].positionAttribute.value == BOARD_ATTRIBUTE.DE2.value && cellGroup[i].isReserved === false) {
          multipier = multipier * 2
          statement_score += tile.point

        }
        else if (cellGroup[i].positionAttribute.value == BOARD_ATTRIBUTE.DP2.value && cellGroup[i].isReserved === false) {
          statement_score += (tile.point * 2)

        }
        else if (cellGroup[i].positionAttribute.value == BOARD_ATTRIBUTE.TE3.value && cellGroup[i].isReserved === false) {
          multipier = multipier * 3
          statement_score += tile.point
        }
        else if (cellGroup[i].positionAttribute.value == BOARD_ATTRIBUTE.TP3.value && cellGroup[i].isReserved === false) {
          statement_score += (tile.point * 3)
        }
        else {
          statement_score += tile.point
        }
      })
      score = score + (statement_score * multipier)

      if (permuteLength == 8) {
        score += 40
      }
      
      validAllPossibleCell.push({ position: cellGroup, tileGroup: tileGroup, 'score': score }) //add score poperty to object 

    }

  })
  
  if(validAllPossibleCell.length===0){
    console.log('hell yeah')
    return
  }
  _.sortBy(validAllPossibleCell,['score'])
  indexScore = validAllPossibleCell.length-1
  
  console.log(validAllPossibleCell[indexScore])
  validAllPossibleCell[indexScore].position.forEach((cell,i) =>{
    cell.imgURL = validAllPossibleCell[indexScore].tileGroup[i].imgURL
    cell.tile = validAllPossibleCell[indexScore].tileGroup[i]
    cell.isReserved = true
  })

  //-end turn
  turn.value++
 
}

const drawTile = function () {
  for (const [key, value] of Object.entries(rack)) {
    if (rack[key].tile == null) {
      let index = Math.floor(Math.random() * bag.length)
      rack[key].tile = bag[index]
      bag.splice(index, 1)
    }
  }
  console.log(bag)
}
const initAll = function () {
  initBag()
  initBoard()
  assignRack()
  initRack()
  initBot()
  console.log(botRack)
  turn.value = 0
}

watch(change_quota, drawTile)
watch(turn, drawTile)
watch(bot_turn,Bot)


</script>

<style>
body {
  background-color: rgb(206, 206, 206);
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

.clicked {
  filter: invert(100%);
}

.select_window_background {
  height: 100%;
  width: 100%;
  display: flex;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
}

.select_window {
  height: 30%;
  width: 30%;
  opacity: 100%;
  background-color: aliceblue;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  padding: 5px;


}

.cancel_button {
  width: 5vw;
  border: 2px solid black;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;

}

.special_tile_group {
  display: flex;
  flex-wrap: wrap;
}

.change_tile_group {
  display: flex;
  flex-wrap: wrap;
}

.operation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 0;
  left: 0;
  border: 2px black solid;
}

.user_panel {
  border: 2px solid black;
  position: fixed;
  bottom: 0;
  right: 0;
  width: 20vw;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>



