<template>
  <div>
    <top :backURL="'/mom/quest/create/start'">
    </top>
    <div class="complete-wrapper text-center">
      <p class="text-primary">모든 퀘스트 달성을 완료하였습니다!</p>
      <p class="title">내 아이와의<br/>
      약속을 지켜주세요!</p>
      <img class="upload-image" :src="giftImageURL" />
      <b-button variant="primary" class="mt-4" @click="restartQuest">새로 시작하기</b-button>
    </div>
  </div>
</template>

<script>
import LoginCheck from '@/mixins/loginCheck.js'
import Top from '@/components/top'

export default {
  mixins:[LoginCheck],
  components: {
      'top': Top,
  },
  data () {
    return {
      selectGroup:'',
    }
  },
  async fetch() {
      let selectGroup = await this.loadSelectGroup(this.selectLink)
      this.selectGroup = selectGroup[0]
  },
  computed: {
    authUser () {
      return this.$store.getters['authUser']
    },
    selectLink () {
      return this.$store.getters['selectLink']
    },
    giftImageURL () {
        if(window.location.host == 'localhost:3000') {
          return `http://localhost:8001${this.selectGroup.success_gift}`
        } else {
          return this.uploadImage
        }
    },
  },
  methods: {
    loadSelectGroup (link) {
       return new Promise(resolve=>{
          this.$axios.get(`/api/selectQuestGroup/${link.id}`).then(res=>{
              resolve(res.data)
          })
       })
    },
    restartQuest () {
      this.$axios.post(`/api/restartQuest/${this.selectGroup.id}`).then(res=>{
        console.log('RES', res)
        this.$router.push({path:'/mom/quest/create/start'})
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/common.scss";
.complete-wrapper {
  margin-top:rem(80px);
}

.title {
  font-size:rem(24px);
  font-family: NotoSansCJKkr-Bold;
}

.upload-image {
  width: rem(260px);
  height: rem(260px);
  border-radius: 100%;
  margin-top:rem(40px);
}
</style>
