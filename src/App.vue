<script setup lang="ts">
import ActionMenu from "./components/ActionMenu.vue";
import CardQueue from "./components/CardQueue.vue";

import { useOrderStore } from "./stores/order-store";

const store = useOrderStore();
</script>

<template>
  <div class="container p-4 flex flex-col gap-4">
    <ActionMenu />
    <div class="flex gap-4">
      <CardQueue cardTitle="Bots" :cardItems="store.botCards" />
      <CardQueue
        cardTitle="Pending Orders"
        :cardItems="store.pendingOrderCards"
      />
      <CardQueue
        cardTitle="Completed Orders"
        :cardItems="store.completedOrderCards"
      />
    </div>
  </div>
</template>
