<template>
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
        </li>
        <li v-for="page in pages" :key="page" class="page-item" :class="{ active: page === currentPage }">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>
  </template>
  
  <script setup>
  import { computed, toRefs } from 'vue';
  
  const props = defineProps({
    totalPages: Number,
    currentPage: Number
  });
  
  const emit = defineEmits(['changePage']);
  
  const { totalPages, currentPage } = toRefs(props);
  
  const pages = computed(() => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages.value; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  });
  
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      emit('changePage', page);
    }
  };
  </script>
  
  <style scoped>
  .page-item.disabled .page-link {
    pointer-events: none;
    opacity: 0.6;
  }
  .page-item.active .page-link {
    background-color: #007bff;
    border-color: #007bff;
    color: white;
  }
  </style>
  