<script setup>
import ItemListComp from '../components/ItemList.vue'
import { ref, computed, onMounted, watch,reactive } from 'vue';



const id = ref(1)
const typo = ref('')
const hideCompleted = ref(false)
const Mounted = ref(null)
const dummyData = ref(null)
const dummyTitle = ref(null)
const count = ref(0)

const sprintLists = ref([
  { text: "this is first list", state: false },
  { text: "this is second list", state: false },
  { text: "this is third list", state: false },
])

const filteredSprintLists = computed(() => {
  return hideCompleted.value ? sprintLists.value.filter(x => x.state == false) : sprintLists.value
})

var addList = function () {
  sprintLists.value.push({ text: typo.value, state: false })
}

var removeList = function (sprint) {
  sprintLists.value = sprintLists.value.filter(x => x !== sprint)
}

var changeStatus = function(){
  hideCompleted.value = !hideCompleted.value
}


var fetchData = async function () {
  dummyData.value = null
  const respond = await fetch(`https://dummyjson.com/products/${id.value}`);
  const data = await respond.json();
  dummyData.value = data;
  dummyTitle.value = dummyData.value['title']

}


var counting = function () {
  var x = 0;
  var counterInterval = setInterval(function () { x++; count.value++; if (x == 100) { clearInterval(counterInterval) } }, 10)
}

onMounted(() => {
  Mounted.value.textContent = "Web loaded";
})

watch(id, fetchData)
</script>

<template>
    <input v-model="typo" placeholder="typehere" />
  <h2>My Message is : {{ typo }}</h2>

  <ItemListComp 
    :msg="typo" 
    :status="hideCompleted" 
    :list="sprintLists" 
    :filteredlist="filteredSprintLists"
    @addList="addList" 
    @removeList="removeList"
    @changeStatus="changeStatus"
  />

  <h1>{{ count }}</h1>
  <button @click="counting">counter</button>

  <p ref="Mounted">g</p>
  <p v-if="!dummyData">loading</p>
  <pre v-else>{{ dummyData }}</pre>

  <h2>{{ dummyTitle }}</h2>
  <button @click="id++">fetch dummy data</button>

</template>