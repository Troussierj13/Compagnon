<template>
  <div class="flex flex-col text-xl mx-auto font-sansserif">
    <button class="border rounded p-2 m-1" @click="createSocket()">Créer une partie</button>
    <button class="border rounded p-2 m-1" @click="connect()">Connect</button>
    <button class="border rounded p-2 m-1" @click="emitHi()">Emit "hi"</button>
    <button class="border rounded p-2 m-1" @click="disconnect()">Disconnect</button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { io } from 'socket.io-client';


const socket = io('http://localhost:8000');

function emitHi() {
  socket.emit('hi', 'hello');
}
function connect() {
  socket.connect();
  socket.emit("join", "123");
}
async function createSocket() {
  const response = await fetch('http://localhost:8000/api/game/123');
  const data = await  response.json();
  console.log(data);
}
function disconnect() {
  socket.close();
    }

</script>

<style scoped>
  /* votre style */
</style>
