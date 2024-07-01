<template>
  <div class="container mt-5">
    <div class="row row-cols-1 g-4">
      <div v-for="page in pages" :key="page.id" class="col">
        <div class="card mb-4">
          <div class="card-img-top">
            <img :src="getRandomImage()" alt="Random Image" />
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ page.properties.Name.title[0].text.content }}</h5>
            <h6>프로젝트 기간: {{ page.properties.Date.date.start}} ~ {{ page.properties.Date.date.end}}</h6>
            <p class="card-text">
              <a :href="page.url" target="_blank" class="btn btn-primary">Open Notion Page</a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-4" v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { fetchNotionPages } from '../api/notion';


const pages = ref([]);
const loading = ref(true);
const img_url = ref([]);

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * img_url.value.length);
  return img_url.value[randomIndex];
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

const fetchPages = async () => {
  loading.value = true;
  pages.value = await fetchNotionPages();
  loading.value = false;
};

onMounted(() => {
  getImg();
  fetchPages();
});
</script>

<style scoped>
@import "vue-notion/src/styles.css";
.card {
  margin-bottom: 20px;
  width: 100%;
}
.card-img-top {
  height: 500px; /* 예시 높이 설정 */
  background-color: #ddd; /* 이미지를 대체할 색상 */
  overflow: hidden; /* 이미지가 영역을 벗어날 경우를 대비해 숨김 처리 */
}
.card-img-top img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지를 영역에 맞게 조정 */
}
</style>
