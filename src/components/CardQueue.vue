<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";

defineProps<{
  cardTitle: string;
  cardItems: { title: string; description: string; status: string }[];
}>();
</script>

<template>
  <Card class="w-fit">
    <CardHeader class="flex flex-row items-start gap-2 min-w-[200px]">
      <CardTitle>{{ cardTitle }}</CardTitle>
      <Badge variant="secondary">{{ cardItems.length }}</Badge>
    </CardHeader>
    <CardContent>
      <ul class="flex flex-col gap-2">
        <li v-for="item in cardItems" :key="item.title">
          <CardDescription class="flex flex-col gap-1">
            <span class="font-semibold">{{ item.title }}</span>
            <span class="text-sm text-muted-foreground">{{
              item.description
            }}</span>
          </CardDescription>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>
