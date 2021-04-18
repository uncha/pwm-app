<template>
  <div>
    <top :linked="linked" :backURL="'/baby/quest/start'"></top>
    <linked-mom :linked="linked"></linked-mom>
    <div class="quest-box" :class="{'quest-fail':unSuccessQuest[0] && unSuccessQuest[0].success_state == 2}">
      <template v-if="unSuccessQuest[0] && questGroup[0]">
        <template v-if="unSuccessQuest[0].complete_sate == 0">
          <p>수행 퀘스트</p>
          <p class="quest-name">"{{unSuccessQuest[0].title}}"</p>
          <b-button variant="primary" @click="$router.push({path:'/baby/quest/perform'})">완료 했나요?</b-button>
        </template>
        <template v-else-if="unSuccessQuest[0].complete_sate == 1">
          <template v-if="successCount != questGroup[0].success_count">
            <template v-if="unSuccessQuest[0].success_state == 0">
              <p class="ing">
                엄마가<br />
                퀘스트 완료를 <br />
                확인 중…
              </p>
            </template>
            <template v-else-if="unSuccessQuest[0].success_state == 1">
              <div class="quest-success">
                <p>퀘스트 성공!</p>
                <p class="msg">짝짝짝</p>
                <img class="img-dk" src="/images/item_default.png" />
                <p class="txt-dk">당근 +1</p>
              </div>
            </template>
            <template v-else-if="unSuccessQuest[0].success_state == 2">
              <div class="quest-fail">
                <p>퀘스트 실패!</p>
                <p class="msg">아쉬워라~ㅠㅠ</p>
                <img class="img-dk" src="/images/item_01_faild.png" />
                <p class="txt-dk">당근 +0</p>
              </div>
            </template>
          </template>
          <template v-else>
            <div class="quest-complete">
              <p>퀘스트 성공!</p>
              <p class="msg">와우~!</p>
              <img class="img-dk" src="/images/item_01_gold.png" />
              <p class="txt-dk">골드당근 +1</p>
            </div>
          </template>
        </template>
      </template>
    </div>

    <template v-if="questGroup[0]">
      <template v-if="successCount != questGroup[0].success_count">
        <b-button @click="setNextQuest" variant="primary" class="mt-4" v-if="unSuccessQuest[0] && unSuccessQuest[0].success_state > 0">다음 퀘스트를 확인해볼까요?</b-button>
      </template>
      <template v-else>
        <b-button @click="onCompleteQuest" variant="primary" class="mt-4" v-if="unSuccessQuest[0] && unSuccessQuest[0].success_state > 0">퀘스트 완료</b-button>
      </template>
    </template>

    <div class="quest-success-count text-center">
      {{this.quest.length}}개 중 <span class="text-primary">{{successCount}}</span>개 달성 중
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
        questGroup:[],
        quest:[],
      }
    },
    computed: {
      linked () {
        return this.$store.getters['Baby/linked']
      },
      unSuccessQuest () {
        return _.filter(this.quest, item =>{
          return item.complete_sate != 2
        })
      },
      successCount () {
        return _.filter(this.quest, item =>{
          return item.success_state == 1
        }).length
      },
    },
    mounted () {
      this.init()
    },
    methods: {
      async init () {
        this.questGroup = await this.loadQuestGroup()
        this.quest = await this.loadQuest()
      },
      loadQuestGroup () {
        return new Promise(resolve=>{
          this.$axios.get(`/api/selectQuestGroup/${this.linked[0].id}`).then(res=>{
            resolve(res.data)
          })
        })
      },
      loadQuest () {
        return new Promise(resolve =>{
          this.$axios.get(`/api/selectQuest/${this.questGroup[0].id}`).then(res=>{
            let list = _.sortBy(res.data, item=>{
              return item.start_date
            })

            resolve(list)
          })
        })
      },
      setNextQuest () {
        this.$axios.post(`/api/completeQuest/${this.unSuccessQuest[0].id}`).then(res=>{
          this.init()
        })
      },
      onCompleteQuest () {
        this.$axios.post(`/api/completeQuestGroup/${this.questGroup[0].id}`, {
          state:'1'
        }).then(res=>{
          this.$router.push({path:'/baby/quest/complete'})
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/common.scss";

.quest-box {
  text-align: center;
  margin-top:rem(168px);
  background: #497ff5;
  padding:rem(30px) rem(20px);
  color:#FFF;
  border-radius: rem(8px);
  box-shadow: 2px 2px 10px 5px rgba(0, 0, 0, 0.2);

  .quest-name {
    font-size: rem(24px);
    font-family: NotoSansCJKkr-Bold;
    margin-top: rem(80px);
    margin-bottom: rem(107px);
  }

  .ing {
    padding:rem(105px) 0;
    font-size: rem(24px);
  }

  &.quest-fail {
    background: #f54949;
  }
}

.quest-success-count {
  position: absolute;
  width: 100%;
  bottom: rem(40px);
  left:0;
}

.msg {
  font-size: rem(36px);
  font-family: NotoSansCJKkr-Bold;
}

.img-dk {
  width: rem(108px);
  margin-bottom: rem(12px);
}

.txt-dk {
  font-size: rem(18px);
  font-family: NotoSansCJKkr-Bold;
}

.quest-success {

}

.quest-fail {

}
</style>
