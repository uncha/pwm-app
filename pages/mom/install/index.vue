<template>
  <div>
    <top></top>
    <h1>
      자녀의 휴대폰에<br />
      엄마의 퀘스트가 설치되어<br />
       있나요?
    </h1>
    <div class="bottom-wrap">
      <b-button class="" variant="primary" @click="$router.push({path:'/mom/qr-link'})">
        아니오, 설치해야 해요
      </b-button>
      <b-button class="mt-2 installed" variant="mute" @click="$router.push({path:'/mom/search-baby'})">
        네! 설치되어 있어요
        <span><img src="/images/icon-arrow01.svg" /></span>
      </b-button>
    </div>
  </div>
</template>

<script>
  import Top from '@/components/top';
  export default {
    components:{
      'top':Top,
    }
  }
</script>

<style lang="scss" scoped>
   .installed {
     font-size: 14px;
   }
</style>
