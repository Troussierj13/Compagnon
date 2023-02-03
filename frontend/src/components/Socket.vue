<template>
  <div>
    <button @click="emitHi()">Emit</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { io } from 'socket.io-client';


const socket = io('http://localhost:8000');

    onMounted(() => {
      socket.on('connect', () => {
        console.log('connected to socket');
      });
    });

function emitHi() {
  socket.emit('hi', 'hello');
    }

</script>

<style scoped>
  /* votre style */
</style>
