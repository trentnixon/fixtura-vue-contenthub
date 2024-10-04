<template>
  <slot></slot>
</template>

<script>
import { provide } from "vue";
import icons from "../theme/icons";

export default {
  name: "IconProvider",
  setup() {
    provide("icons", icons);
  },
};
</script>
