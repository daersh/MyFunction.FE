<template>
  <div class="container mt-5">
    <div class="row row-cols-1 g-4 justify-content-center">
      <div v-for="board in boards" :key="board.boardCode" class="col">
        <div class="card mb-4">
          <!-- 이미지 공간 -->
          <div class="card-img-top">
            <img :src="getRandomImage()" alt="Random Image" />
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
const img_url = ref([]);

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

const getImg = async () => {
  try {
    const response = await axios.get('https://api.unsplash.com/photos/random?client_id=VEl75nxG2NReKoYWKewXtGnDXE6NDc6gfpIpQdl7fh8&count=30');
    img_url.value = response.data.map(photo => photo.urls.small);
    console.log(response.data);
  } catch (error) {
    console.error('Failed to fetch image', error);
  }
};

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * img_url.value.length);
  return img_url.value[randomIndex];
};

getImg();

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
  margin-bottom: 20px; /* 카드 아래 여백 설정 */
  max-width: 800px; /* 최대 카드 너비 설정 */
  margin: 0 auto; /* 가운데 정렬 */
}
.card-img-top {
  max-height: 300px; /* 예시 높이 설정 */
  background-color: #ddd; /* 이미지를 대체할 색상 */
  overflow: hidden; /* 이미지가 영역을 벗어날 경우를 대비해 숨김 처리 */
}
.card-img-top img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지를 영역에 맞게 조정 */
}
</style>
