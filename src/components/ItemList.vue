<script setup>
    const ItemListProps = defineProps({
        msg : String,
        status : Boolean,
        list : Array,
        filteredlist : Array
    })

    const ItemListEmit = defineEmits(['addList','removeList','changeStatus'])
   
 
</script>
<template>
    <button @click="$emit('addList')">ADD LIST</button>
    <div v-for="sprint in filteredlist" :key="sprint.text">
        <input type="checkbox" v-model="sprint.state">
        <button @click="$emit('removeList',sprint)">{{ sprint.text }}</button>
    </div>
    <button @click="$emit('changeStatus')">
        {{ !status ? "Hide Completed Sprint" : "Show Completed Sprint" }}
    </button>
    
</template>