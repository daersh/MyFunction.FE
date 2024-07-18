<template>
  <div>
    <!-- 네이버 로그인 버튼 노출 영역 -->
    <div id="naver_id_login"></div>
  </div>
</template>
<script>

const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;

export default {
  components: {},
  data() {
    return {};
  },
  mounted() {
    this.naverLogin = new window.naver_id_login(
      clientId,
      "http://localhost:5173/Naverlogin"  // 개발자센터에서 등록한 Callback URL
    );
    var state = this.naverLogin.getUniqState();
    this.naverLogin.setButton("white", 2, 40); // 버튼설정
    this.naverLogin.setDomain("http://localhost:5173");
    this.naverLogin.setState(state);
    // this.naverLogin.setPopup(); // 팝업 여부
    this.naverLogin.init_naver_id_login();
  },
};
</script>
