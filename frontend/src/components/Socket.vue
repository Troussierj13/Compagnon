<template>
    <div class="mx-auto flex flex-col font-sansserif text-xl">
        <button class="m-1 rounded border p-2" @click="createSocket()">
            Créer une partie
        </button>
        <button class="m-1 rounded border p-2" @click="connect()">
            Connect
        </button>
        <button class="m-1 rounded border p-2" @click="emitHi()">
            Emit "hi"
        </button>
        <button class="m-1 rounded border p-2" @click="disconnect()">
            Disconnect
        </button>
    </div>
</template>

<script lang="ts" setup>
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000');

function emitHi() {
    socket.emit('hi', 'hello');
}

function connect() {
    socket.connect();
    socket.emit('join', '123');
}

async function createSocket() {
    const response = await fetch('http://localhost:8000/api/game/123');
    const data = await response.json();
    console.log(data);
}

function disconnect() {
    socket.close();
}
</script>

<style scoped>
/* votre style */
</style>
