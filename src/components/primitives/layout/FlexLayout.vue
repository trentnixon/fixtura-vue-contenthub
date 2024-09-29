<template>
    <v-row
      :class="rowClass"
      :align="align"
      :justify="justify"
      :wrap="wrap"
      :direction="direction"
    >
      <v-col
        v-for="(col, index) in columns"
        :key="index"
        :cols="col.cols"
        :class="col.class"
        :align-self="col.alignSelf"
        :order="col.order"
      >
        <slot :name="'col-' + index"></slot>
      </v-col>
    </v-row>
  </template>

  <script setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    columns: {
      type: Array,
      required: true,
    },
    align: {
      type: String,
      default: 'stretch', // Could be start, center, end, stretch, etc.
    },
    justify: {
      type: String,
      default: 'start', // Could be start, center, end, space-between, etc.
    },
    wrap: {
      type: String,
      default: 'wrap', // Could be wrap, nowrap, wrap-reverse
    },
    direction: {
      type: String,
      default: 'row', // Could be row, row-reverse, column, column-reverse
    },
    rowClass: {
      type: String,
      default: '',
    },
  });
  </script>

  <style scoped>
  /* Add custom styles if needed */
  </style>
