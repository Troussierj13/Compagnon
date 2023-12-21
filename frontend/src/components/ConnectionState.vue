<template>
    <p>State: {{ connected }}</p>
  </template>
  
  <script lang="ts">
  import { stateSocket } from "@/socket";
  
  export default {
    name: "ConnectionState",
  
    computed: {
      connected() {
        return stateSocket.connected;
      }
    }
  }
  </script>