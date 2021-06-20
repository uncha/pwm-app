<template>
  <div class="container">
    <p class="title text-center"><img src="/images/title.svg" /></p>

    <div class="social text-center">
      <!-- <kakao-login class="mt-1" /> -->
      <!-- <naver-login class="mt-1" /> -->
      <!-- <google-login /> -->
      <!-- <apple-login class="mt-1" /> -->
      <b-button
        variant="primary"
        @click="$router.push({path:'/join'})"
      >시작하기</b-button>
    </div>
  </div>
</template>

<script>
import KakaoLogin from "@/components/login/KakaoLogin.vue";
import GoogleLogin from "@/components/login/GoogleLogin.vue";
import NaverLogin from "@/components/login/NaverLogin.vue";
import AppleLogin from "@/components/login/AppleLogin.vue";

export default {
  components: {
    KakaoLogin,
    GoogleLogin,
    NaverLogin,
    AppleLogin,
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.title {
  img {
    width: rem(226px);
  }
}

.main_img {
  img {
    width: rem(157px);
  }
}

.social {
  position: absolute;
  bottom: rem(80px);
  left: 0;
  right: 0;

  button {
    width: 60%;
    display: block;
    margin: 0 auto;
    margin-top: rem(10px);
  }
}
</style>
