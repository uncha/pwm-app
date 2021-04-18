<template>
  <div>
    <top></top>
    <p class="title text-center">
      자녀의 휴대폰에도<br />
      엄마의 퀘스트가<br />
      설치되어 있나요?
    </p>
    <div class="buttons">
      <b-button class="" variant="primary" @click="$router.push({path:'/mom/qr-link'})">
        아니오, 설치해야 해요
      </b-button>
      <b-button class="mt-2" variant="primary" @click="$router.push({path:'/mom/search-baby'})">
        네! 설치되어 있어요
      </b-button>
    </div>
  </div>
</template>

<script>
  import Top from '@/components/top';
  export default {

  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/scss/common.scss";

  .title {
    font-size: rem(20px);
    line-height: rem(30px);
    margin-top: rem(182px);
  }
  .buttons {
    position: absolute;
    bottom:rem(60px);
    left:0;
    right:0;
    padding:0 rem(24px);
  }
</style>
