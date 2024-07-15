<template>
  <div class="container mt-5">

    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">게시물 작성</h5>
        <form @submit.prevent="createBoard">
          <div class="mb-3">
            <label for="title" class="form-label">제목</label>
            <input type="text" class="form-control" id="title" v-model="newBoard.title" required>
          </div>
          <div class="mb-3">
            <label for="content" class="form-label">내용</label>
            <textarea class="form-control" id="content" v-model="newBoard.content" rows="3" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">작성</button>
        </form>
      </div>
    </div>

    <div class="row row-cols-1 g-4 justify-content-center">
      <div v-for="board in boards" :key="board.boardCode" class="col">
        <div class="card mb-4">
          <!-- 이미지 공간 -->
          <!-- <div class="card-img-top">
            <img :src="getRandomImage()" alt="Random Image" />
          </div> -->
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

    <!-- 로딩 스피너 -->
    <div class="text-center mt-4" v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- 더 이상 로드할 게시물이 없을 때 메시지 -->
    <div class="text-center mt-4" v-if="!hasNextPage && !loading && boards.length > 0">
      <p>No more boards to load.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/plugins/axios'; // 새로 만든 Axios 인스턴스 import

// 게시물 작성 폼 데이터
const newBoard = ref({
  title: '',
  content: ''
});

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
    const response = await axios.get('/board', {
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

  } catch (error) {
    console.error('Failed to fetch image', error);
  }
};

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * img_url.value.length);
  return img_url.value[randomIndex];
};

// getImg();

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

// 게시물 작성 함수
const createBoard = async () => {
  try {
    const response = await axios.post('/board', {
      title: newBoard.value.title,
      content: newBoard.value.content
    });


    resetFilter(); // 게시물 작성 후 목록 갱신
  } catch (error) {
    console.error('Failed to create board', error);
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
  max-width: 800px;
  margin: 0 auto;
}
.card-img-top {
  max-height: 300px;
  background-color: #ddd;
  overflow: hidden;
}
.card-img-top img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
