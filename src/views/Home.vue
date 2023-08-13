<template>
  <h1>Home</h1>
  <div style="width: fit-content; height:480px; margin:100px auto;  ">
  <div v-for="(row,i) in board" :key="i" style=" display: flex; flex-direction: row;">
    <div v-for="(cell,j) in board[i] " :key="j" 
      @click="cellHandleClick(i,j,cell)"
    :class="{
      'TE3': cell.positionAttribute.value=='TE3',
      'DE2': cell.positionAttribute.value=='DE2',
      'TP3': cell.positionAttribute.value=='TP3',
      'DP2': cell.positionAttribute.value=='DP2',
      'STR': cell.positionAttribute.value=='STR',
      'cell' : cell.positionAttribute.value=='NN0'
    }">
      <img :src="cell.imgURL" alt="Img_notFound">
    </div>
  </div>
  
</div>
<div class="rack"  >
  <div class="tile" v-for="tile in rack" :key="tile " @click="getInfo(tile)"  >
    <img :src="tile.imgURL" alt="Img_notFound" >
  </div>
</div>

<div> {{ selectedState }} {{ currentSelected.selectedTile != null ? currentSelected.selectedTile.amount : currentSelected.selectedTile}}</div>
<img :src=TILE_ATTRIBUTE[0].imgURL alt="Img_notFound">


<button @click="function(){console.log(board)}">check</button>
<button @click="computedScore">get</button>
<button @click="function(){boardShow = !boardShow}">{{ boardShow}}</button>



</template>

<script setup>
  import { ref, computed, onMounted, watch,reactive } from 'vue';
  import { evaluate } from 'mathjs';
  const TILE_ATTRIBUTE = {
    0 : {
      tileId: 0,
      value : '0',
      amount : 5,
      point : 1,
      

    },
    1 : {
      tileId: 1,
      value : '1',
      amount : 6,
      point : 1,
      imgURL : 'http://localhost:5173/src/assets/1.png'
    },
    2 : {
      tileId: 2,
      value : '2',
      amount : 6,
      point : 1,
      imgURL : 'http://localhost:5173/src/assets/2.png'
    },
    3 : {
      tileId: 3,
      value : '3',
      amount : 5,
      point : 1,
      imgURL : 'http://localhost:5173/src/assets/3.png'
    },
    4 : {
      tileId: 4,
      value : '4',
      amount : 5,
      point : 2,
      imgURL : 'http://localhost:5173/src/assets/4.png'
    },
    5 : {
      tileId: 5,
      value : '5',
      amount : 4,
      point : 2
    },
    6 : {
      tileId: 6,
      value : '6',
      amount : 4,
      point : 2
    },
    7 : {
      tileId: 7,
      value : '7',
      amount : 4,
      point : 2

    },
    8 : {
      tileId: 8,
      value : '8',
      amount : 4,
      point : 2,
    },
    9 : {
      tileId: 9,
      value : '9',
      amount : 4,
      point : 2,
    },
    '+' : {
      tileId: 21,
      value: '+',
      amount : 10,
      point: 1,
      imgURL : 'http://localhost:5173/src/assets/+.png'
    },
     '/' : {
      tileId: 25,
      value: '/',
      amount : 10,
      point: 1,
    
    },
    '==' : {
      tileId: 27,
      value: '==',
      amount : 10,
      point: 1,
      imgURL : 'http://localhost:5173/src/assets/=.png'
    }

  }
  
  const BOARD_ATTRIBUTE = {
     TE3 :{
        value : 'TE3',
        imgURL: 'http://localhost:5173/src/assets/TE3.png'
      },
      TP3 : {
        value : 'TP3',
        imgURL: 'http://localhost:5173/src/assets/TP3.png'
        
      },
      DE2 :{
        value: 'DE2',
        imgURL: 'http://localhost:5173/src/assets/DE2.png'
       
      },
      DP2 : {
        value: 'DP2',
        imgURL: 'http://localhost:5173/src/assets/DP2.png'
       
      },
      NN0 : {
        value:'NN0',
        imgURL: 'http://localhost:5173/src/assets/NN0.png'
        
      },
      STR : {
        value : 'STR',
        imgURL: 'http://localhost:5173/src/assets/STR.png'
      }
    }
  const rack = [TILE_ATTRIBUTE[1],TILE_ATTRIBUTE[2],TILE_ATTRIBUTE[3],TILE_ATTRIBUTE[4]
                ,TILE_ATTRIBUTE['+'],TILE_ATTRIBUTE['==']]
  

  
  var board = []
  const boardShow = ref(false)
  
  
  
  
  const BOARD_ATTRIBUTE_POSITION = [[BOARD_ATTRIBUTE.TE3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TE3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TE3],
                           [BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DE2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TP3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TP3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DE2,BOARD_ATTRIBUTE.NN0],
                           [BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DE2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DE2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0],
                           [BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DE2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DE2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2],
                           [BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TP3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TP3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0],
                           [BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TP3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TP3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TP3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TP3,BOARD_ATTRIBUTE.NN0],
                           [BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0],
                           [BOARD_ATTRIBUTE.TE3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.STR,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TE3],
                           [BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0],
                           [BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TP3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TP3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TP3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TP3,BOARD_ATTRIBUTE.NN0],
                           [BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TP3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TP3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0],
                           [BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DE2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DE2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2],
                           [BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DE2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DE2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0],
                           [BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DE2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TP3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TP3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DE2,BOARD_ATTRIBUTE.NN0],
                           [BOARD_ATTRIBUTE.TE3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TE3,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.DP2,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.NN0,BOARD_ATTRIBUTE.TE3]]
const initBoard = function(){
 
  board = reactive(Array(15)
                  .fill([])
                  .map( (row,i)=> Array(15)
                                          .fill({})
                                          .map( (col,j)=> ({
                                  i: i,
                                  j: j,
                                  tile: null,
                                  isReserved: false,
                                  positionAttribute : BOARD_ATTRIBUTE_POSITION[i][j],
                                  imgURL: BOARD_ATTRIBUTE_POSITION[i][j].imgURL
  }))
  ))
}

  
  const selectedState = ref(false)
  const currentSelected = reactive({
    imgURL : '' ,
    selectedTile : null

  })
  
  const getInfo = function(tile){
    if(selectedState.value == false){
      currentSelected.imgURL = tile.imgURL
      console.log(currentSelected.imgURL)
      currentSelected.selectedTile = TILE_ATTRIBUTE[tile.value]
      
      selectedState.value = !selectedState.value
    
    
    }
  }
  const cellHandleClick = function(i,j,cell){
    if(cell.isReserved == false && cell.tile != null){
      //cancel tile on board if didnt submit
      cell.tile = null
      cell.imgURL = BOARD_ATTRIBUTE_POSITION[i][j].imgURL
      console.log(cell.tile)
      console.log(cell.imgURL)
    }else{
      placeInfo(i,j,cell)
    }
    
  }
    const placeInfo = function(i,j,cell){
      if(selectedState.value == true  && isAdjacent(i,j) && cell.isReserved != true){
      board[i][j].imgURL = currentSelected.imgURL
      board[i][j].tile = currentSelected.selectedTile

      selectedState.value = !selectedState.value

    }
  }

  
  var isBreak = false
  var equation = []
  const computedScore = function(){
  outer_loop : board.some((row,i)=>{
    board[i].some((cell,j)=>{
      if(board[i][j].tile != null && board[i][j].isReserved == false){
        getEquation(i,j,board[i][j])
        
        isBreak = true;
        return true; 
      }
    })
    return isBreak ? true : false
   })
   isBreak = false
  }

  const getEquation = function(i,j,cell){
    //vertical
    if(board[i+1][j].tile != null || board[i-1][j].tile != null){
      let row = 0;
      while(row<15){
        if(board[row][j].tile != null){
        equation.push(board[row][j])
        console.log(board[row][j])
        }
        row++
      }
    }
    //horizontal
    if(board[i][j+1].tile != null || board[i][j-1].tile != null){
      let col = 0;
      while(col<15){
        if(board[i][col].tile != null){
          equation.push(board[i][col])
          console.log(board[i][col])
        }
        col++
      }
    }
  try{
    console.log(evaluate(equation.map(tileOnCell => tileOnCell.tile.value).join('')))
    console.log(equation.map(tileOnCell => tileOnCell.tile.value).join(''))
  }
  catch(error){
    alert('error')
    return;
  }
  equation.forEach((tileOnCell) => board[tileOnCell.i][tileOnCell.j].isReserved = true)
  equation=[]
  }

  const isAdjacent = function(row,col){
    //upper-left
    if(board[row-1][col-1].tile != null){
      return board[row][col-1].tile != null && board[row-1][col].tile != null ? false : true
    }
    //upper-right
    else if(board[row-1][col+1].tile != null){
      return board[row][col+1].tile != null && board[row-1][col].tile != null ? false : true
    }
    //lower-left
    else if(board[row+1][col-1].tile != null){
      return board[row][col-1].tile != null && board[row+1][col].tile != null ? false : true
    }
    //lower-right
    else if(board[row+1][col+1].tile != null){
      return board[row+1][col].tile != null && board[row][col+1].tile != null ? false : true 
    }
    else{
      return true;
    }
  }

  onMounted(() => {
    initBoard()
  })
    

  
</script>

<style>
body{
  background-color: rgb(12, 48, 48);
}
.rack{
  display: flex;
  
  margin:0 auto;
  flex-direction: row;
  height: 35px;
  width: fit-content;
 
 
}
.tile{
  height: 35px;
  width:35px;
  background-color: cadetblue;
  border: 1px solid black;

}
.cell{
  background-color: blue; 
  width:35px; 
  height: 35px; 
  border: 1px solid black  ; 
  
 
}
.TE3{
  background-color: red;
  width:35px; 
  height: 35px;
  border: 1px solid black  ; 
}
.DE2{
  background-color: yellow;
  width:35px; 
  height: 35px;
  border: 1px solid black  ; 


}
.TP3{
  background-color: cyan;
  width:35px; 
  height: 35px;
  border: 1px solid black  ; 

}
.DP2{
  background-color: orange;
  width:35px; 
  height: 35px;
  border: 1px solid black  ; 

}
.STR{
  background-color: pink;
  width:35px; 
  height: 35px;
  border: 1px solid black  ; 
}

</style>



