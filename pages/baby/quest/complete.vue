<template>
  <div>
    <top :linked="linked" :backURL="'/baby/quest/start'"></top>
    <linked-mom :linked="linked"></linked-mom>
    <div class="wrap text-center">
      <p class="text-primary">모든 퀘스트 달성을 완료하였습니다!</p>
      <p class="title"><span class="strong">엄마가 선물을 준비중이에요!</span><br />
      조금만 기다려줄수 있죠?</p>
      <img v-if="questGroup" class="upload-image" :src="giftImageURL" />
    </div>
  </div>
</template>

<script>
  import Top from '@/components/baby/top'
  export default {
    components: {
      'top':Top
    },
    data () {
      return {
        questGroup:'',
      }
    },
    computed: {
      linked () {
        return this.$store.getters['Baby/linked']
      },
      giftImageURL () {
        console.log('THIS.QUESTGROUP[0].SUCCESS_GIFT', this.questGroup[0].success_gift)
        if(window.location.host == 'localhost:3000') {
          console.log('???')
          return `http://localhost:9102${this.questGroup[0].success_gift}`
        } else {
          return this.questGroup[0].success_gift
        }
      },
    },
    mounted () {
      this.init()
    },
    methods: {
      async init () {
        this.questGroup = await this.loadQuestGroup()
      },
      loadQuestGroup () {
        return new Promise(resolve=>{
          this.$axios.get(`/api/selectQuestGroup/${this.linked[0].id}`).then(res=>{
            resolve(res.data)
          })
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
 

.wrap {
  margin-top:rem(180px);
}

.upload-image {
  width:rem(260px);
  height: rem(260px);
  border-radius: 100%;
  margin-top: rem(40px);
}

.title {
  .strong {
    font-family: NotoSansCJKkr-Bold;
    font-size: rem(24px);
  }
}
</style>
