<template>
  <div v-if="isPositionReady">
    <naver-map
      style="width: 100%; height: 400px"
      :map-options="mapOptions"
    >
      <naver-marker
        :latitude="markerPosition.latitude"
        :longitude="markerPosition.longitude"
      />
    </naver-map>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { NaverMap, NaverMarker } from 'vue3-naver-maps';

const positionObj = ref({ latitude: 37.51347, longitude: 127.041722 });
const isPositionReady = ref(false);

const getCurrentPosition = () => {
  if (!navigator.geolocation) {
    setAlert('위치 정보를 찾을 수 없습니다.1');
  } else {
    navigator.geolocation.getCurrentPosition(getPositionValue, geolocationError);
  }
};

const getPositionValue = (val) => {
  positionObj.value.latitude = val.coords.latitude;
  positionObj.value.longitude = val.coords.longitude;
  isPositionReady.value = true;
  setAlert('주소 확인 완료');
};

const geolocationError = () => {
  setAlert('위치 정보를 찾을 수 없습니다.2');
};

const setAlert = (text) => {
  alert(text);
};

const mapOptions = ref({
  center: { lat: 37.51347, lng: 127.041722 },
  zoom: 13,
});

const markerPosition = ref({
  latitude: 37.51347,
  longitude: 127.041722,
});

watchEffect(() => {
  if (isPositionReady.value) {
    mapOptions.value.center = {
      lat: positionObj.value.latitude,
      lng: positionObj.value.longitude,
    };
    markerPosition.value = {
      latitude: positionObj.value.latitude,
      longitude: positionObj.value.longitude,
    };
  }
});

// 현재 위치 가져오기 함수 호출
getCurrentPosition();

</script>

<style scoped>
</style>
