<template>
  <div class="root">
    <transition-group tag="ul" class="container">
      <li class="item" :class="'item' + index" v-for="(item, index) in items" :key="item.key" :style="{ 'background-color': item.color, border: '1px solid' }" draggable="true" @dragstart="handleDragStart($event, item)" @dragover.prevent="handleDragOver($event, item)" @dragenter="handleDragEnter($event, item)" @dragend="handleDragEnd($event, item)">
        <div>{{ item }}</div>
      </li>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Item {
  key: number;
  color: string;
}

const items = ref([
  { key: 1, color: '#0883a0' },
  { key: 2, color: '#1883a0' },
  { key: 3, color: '#2883a0' },
  { key: 4, color: '#3883a0' },
  { key: 5, color: '#4883a0' },
  { key: 6, color: '#5883a0' },
  { key: 7, color: '#6883a0' },
  { key: 8, color: '#7883a0' },
  { key: 9, color: '#8883a0' },
  { key: 10, color: '#9883a0' },
]);

let ending: Item | null = null;
let dragging: Item | null = null;
// 拖拽开始时触发的事件
const handleDragStart = (e: DragEvent, item: Item) => {
  dragging = item;
  console.log(e);
};
// 拖拽结束时触发的事件
const handleDragEnd = (e: DragEvent, item: Item) => {
  if (ending && ending.key === dragging?.key) {
    return;
  }
  console.log(e, item);

  const newItems = [...items.value];
  const src = newItems.indexOf(dragging!);
  const dst = newItems.indexOf(ending!);
  newItems.splice(src, 1, ...newItems.splice(dst, 1, newItems[src]));
  console.log(newItems);

  items.value = newItems;
  dragging = null; //被拖拽元素
  ending = null; //目标元素
};
// 拖拽过程中在目标元素上移动时触发的事件
const handleDragOver = (e: DragEvent, item: Item) => {
  e.dataTransfer!.dropEffect = 'move';
  console.log(e, item);
};
// 拖拽进入目标元素时触发的事件
const handleDragEnter = (e: DragEvent, item: Item) => {
  e.dataTransfer!.effectAllowed = 'move';
  ending = item;
};
</script>

<style scoped>
/* .container {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    padding: 0;
  } */

.item {
  height: 60px;
  margin: 10px;
  color: #fff;
  transition: all linear 0.3s;
}
</style>