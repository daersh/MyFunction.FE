<template>
  <div class="container mt-5">
<!--    <form @submit.prevent="applyFilters" class="mb-4">-->
<!--      <div class="row mb-3">-->
<!--        <div class="col">-->
<!--          <input type="number" class="form-control" v-model="filter.likes" placeholder="Likes" required>-->
<!--        </div>-->
<!--        <div class="col">-->
<!--          <input type="number" class="form-control" v-model="filter.hits" placeholder="Hits" required>-->
<!--        </div>-->
<!--        <div class="col">-->
<!--          <input type="number" class="form-control" v-model="filter.category" placeholder="Category" required>-->
<!--        </div>-->
<!--        <div class="col">-->
<!--          <input type="text" class="form-control" v-model="filter.search" placeholder="Search">-->
<!--        </div>-->
<!--        <div class="col-auto">-->
<!--          <button type="submit" class="btn btn-primary">Apply Filters</button>-->
<!--        </div>-->
<!--        <div class="col-auto">-->
<!--          <button @click="resetFilter" class="btn btn-primary">Reset Filters</button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </form>-->

    <div class="row row-cols-1 g-4">
      <div v-for="board in boards" :key="board.boardCode" class="col">
        <div class="card mb-4">
          <!-- 이미지 공간 -->
          <div class="card-img-top">
            <!-- 추후 이미지를 넣을 공간 -->
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ board.title }}</h5>
            <p class="card-text">{{ board.content }}</p>
          </div>
          <div class="card-footer">
            <small class="text-muted">{{ board.userName }} - {{ board.postDate }}</small>
            <small class="float-end">Likes: {{ board.likes }} | Hits: {{ board.hits }}</small>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-4" v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div class="text-center mt-4" v-if="!hasNextPage && !loading && boards.length > 0">
      <p>No more boards to load.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const filter = ref({
  page: 1,
  likes: 0,
  hits: 0,
  category: 0,
  search: ''
});

const boards = ref([]);
const loading = ref(false);
const hasNextPage = ref(true);

const fetchBoards = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const response = await axios.get('http://localhost:8010/board', {
      params: {
        page: filter.value.page,
        likes: filter.value.likes,
        hits: filter.value.hits,
        category: filter.value.category,
        search: filter.value.search
      }
    });

    if (filter.value.page === 1) {
      boards.value = response.data.boardList;
    } else {
      boards.value.push(...response.data.boardList);
    }

    if (response.data.boardList.length === 0) {
      hasNextPage.value = false;
    } else {
      filter.value.page++;
    }

    console.log('Boards fetched successfully', response.data);
  } catch (error) {
    console.error('Failed to fetch boards', error);
  } finally {
    loading.value = false;
  }
};

const resetFilter = async () => {
  filter.value.page = 1;
  boards.value = [];
  filter.value.likes = 0;
  filter.value.hits = 0;
  filter.value.category = 0;
  filter.value.search = '';
  await fetchBoards();
};

const applyFilters = async () => {
  filter.value.page = 1;
  boards.value = [];
  await fetchBoards();
};

const handleScroll = () => {
  const bottomOfWindow = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 200;
  if (bottomOfWindow && !loading.value && hasNextPage.value) {
    fetchBoards();
  }
};

onMounted(() => {
  fetchBoards();
  window.addEventListener('scroll', handleScroll);
});

</script>

<style scoped>
.card {
  margin-bottom: 20px;
  width: 100%;
}
.card-img-top {
  height: 300px; /* 예시 높이 설정 */
  background-color: #ddd; /* 이미지를 대체할 색상 */
}
</style>
