<template>
  <NotionRenderer :blockMap="blockMap" fullPage />
</template>

<script lang="ts">
import { NotionRenderer, getPageBlocks } from "vue-notion";

export default {
  components: { NotionRenderer },
  data: () => ({ blockMap: null }),
  async created() {
    // get Notion blocks from the API via a Notion pageId
    this.blockMap = await getPageBlocks("2622b825d9a04ee681924738a2b8593e");
  },
};
</script>

<style>
/* optional Notion-like styles */
@import "vue-notion/src/styles.css";
</style>