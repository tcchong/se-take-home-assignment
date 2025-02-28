<script setup lang="ts">
import { Button } from "./ui/button";
import { useOrderStore } from "../stores/order-store";

const store = useOrderStore();
</script>

<template>
  <div class="flex gap-2">
    <Button @click="store.addVIPOrder()">New VIP Order</Button>
    <Button @click="store.addNormalOrder()">New Normal Order</Button>
    <Button @click="store.addBot()">+ Bot</Button>
    <Button @click="store.removeBot()">- Bot</Button>
  </div>
</template>

<style scoped></style>
