<template>
  <h1>Home</h1>
  <div style="width: fit-content; height:480px; margin:100px auto;  ">
  <div v-for="(row,i) in board" :key="i" style=" display: flex; flex-direction: row;">
    <div v-for="(cell,j) in board[i] " :key="j" 
      @click="placeInfo(i,j,$event)"
    :class="{
      'TE3': cell.positionAttribute.value=='TE3',
      'DE2': cell.positionAttribute.value=='DE2',
      'TP3': cell.positionAttribute.value=='TP3',
      'DP2': cell.positionAttribute.value=='DP2',
      'STR': cell.positionAttribute.value=='STR',
      'cell' : cell.positionAttribute.value=='NN0'
    }">
      {{ cell.tile == null ? cell.positionAttribute.value : cell.tile.value }}
    </div>
  </div>
  
</div>
<div class="rack"  >
  <div class="tile" v-for="tile in rack" :key="tile " @click="getInfo" :value="tile.tileId"  >{{ tile.value }} </div>
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
      imgURL : 'http://localhost:5173/src/assets/0_tile.png'

    },
    1 : {
      tileId: 1,
      value : '1',
      amount : 6,
      point : 1
    },
    2 : {
      tileId: 2,
      value : '2',
      amount : 6,
      point : 1
    },
    3 : {
      tileId: 3,
      value : '3',
      amount : 5,
      point : 1
    },
    4 : {
      tileId: 4,
      value : '4',
      amount : 5,
      point : 2
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
    21 : {
      tileId: 21,
      value: '+',
      amount : 10,
      point: 1
    },
    25 : {
      tileId: 25,
      value: '/',
      amount : 10,
      point: 1
    },
    27 : {
      tileId: 27,
      value: '==',
      amount : 10,
      point: 1
    }

  }
  const TE3 = {
        value : 'TE3'
      },
      TP3 = {
        value : 'TP3'
        
      },
      DE2 = {
        value: 'DE2'
       
      },
      DP2 = {
        value: 'DP2'
       
      },
      NN0 = {
        value:'NN0'
        
      },
      STR ={
        value : 'STR'
      }
  const rack = [TILE_ATTRIBUTE[0],TILE_ATTRIBUTE[1],TILE_ATTRIBUTE[2],TILE_ATTRIBUTE[3],TILE_ATTRIBUTE[4]
                ,TILE_ATTRIBUTE[7],TILE_ATTRIBUTE[21],TILE_ATTRIBUTE[27],TILE_ATTRIBUTE[0],TILE_ATTRIBUTE[1],TILE_ATTRIBUTE[2],TILE_ATTRIBUTE[3],TILE_ATTRIBUTE[4]
                ,TILE_ATTRIBUTE[7],TILE_ATTRIBUTE[25],TILE_ATTRIBUTE[27]]
  

  
  var board = []
  const boardShow = ref(false)
  
  
  
  
  const BOARD_ATTRIBUTE = [[TE3,NN0,NN0,DP2,NN0,NN0,NN0,TE3,NN0,NN0,NN0,DP2,NN0,NN0,TE3],
                           [NN0,DE2,NN0,NN0,NN0,TP3,NN0,NN0,NN0,TP3,NN0,NN0,NN0,DE2,NN0],
                           [NN0,NN0,DE2,NN0,NN0,NN0,DP2,NN0,DP2,NN0,NN0,NN0,DE2,NN0,NN0],
                           [DP2,NN0,NN0,DE2,NN0,NN0,NN0,DP2,NN0,NN0,NN0,DE2,NN0,NN0,DP2],
                           [NN0,NN0,NN0,NN0,TP3,NN0,NN0,NN0,NN0,NN0,TP3,NN0,NN0,NN0,NN0],
                           [NN0,TP3,NN0,NN0,NN0,TP3,NN0,NN0,NN0,TP3,NN0,NN0,NN0,TP3,NN0],
                           [NN0,NN0,DP2,NN0,NN0,NN0,DP2,NN0,DP2,NN0,NN0,NN0,DP2,NN0,NN0],
                           [TE3,NN0,NN0,DP2,NN0,NN0,NN0,STR,NN0,NN0,NN0,DP2,NN0,NN0,TE3],
                           [NN0,NN0,DP2,NN0,NN0,NN0,DP2,NN0,DP2,NN0,NN0,NN0,DP2,NN0,NN0],
                           [NN0,TP3,NN0,NN0,NN0,TP3,NN0,NN0,NN0,TP3,NN0,NN0,NN0,TP3,NN0],
                           [NN0,NN0,NN0,NN0,TP3,NN0,NN0,NN0,NN0,NN0,TP3,NN0,NN0,NN0,NN0],
                           [DP2,NN0,NN0,DE2,NN0,NN0,NN0,DP2,NN0,NN0,NN0,DE2,NN0,NN0,DP2],
                           [NN0,NN0,DE2,NN0,NN0,NN0,DP2,NN0,DP2,NN0,NN0,NN0,DE2,NN0,NN0],
                           [NN0,DE2,NN0,NN0,NN0,TP3,NN0,NN0,NN0,TP3,NN0,NN0,NN0,DE2,NN0],
                           [TE3,NN0,NN0,DP2,NN0,NN0,NN0,TE3,NN0,NN0,NN0,DP2,NN0,NN0,TE3]]
const initBoard = function(){
 
  board = Array(15)
                  .fill([])
                  .map( (row,i)=> Array(15)
                                          .fill({})
                                          .map( (col,j)=> ({
                                  i: i,
                                  j: j,
                                  tile: null,
                                  isReserved: false,
                                  positionAttribute : BOARD_ATTRIBUTE[i][j]
  }))
  )
}

  
  const selectedState = ref(false)
  const currentSelected = reactive({
    classInfo:'',
    selectedTile : null

  })
  
  const getInfo = function(e){
    if(selectedState.value == false){
      currentSelected.classInfo = e.target.className 
      currentSelected.selectedTile = TILE_ATTRIBUTE[e.target.getAttribute("value")]
      
      selectedState.value = !selectedState.value
    
    
    }
  }
    const placeInfo = function(i,j,e){
      if(selectedState.value == true  && isAdjacent(i,j)){
      while (e.target.classList.length > 0) {
        e.target.classList.remove(e.target.classList.item(0));
      }
      e.target.classList.add(currentSelected.classInfo)
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
        equation.push(board[row][j].tile.value)
        console.log(board[row][j].tile.value)
        }
        row++
      }
    }
    //horizontal
    if(board[i][j+1].tile != null || board[i][j-1].tile != null){
      let col = 0;
      while(col<15){
        if(board[i][col].tile != null){
          equation.push(board[i][col].tile.value)
          console.log(board[i][col].tile.value)
        }
        col++
      }
    }
   
    console.log(evaluate(equation.join('')))
    console.log(equation.join(''))
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



