<template>
  <div>
    <side-bar :linked="linked"></side-bar>
    <linked-mom :linked="linked"></linked-mom>
    <div class="quest-start-wrapper">
      <div class="blue-box">
        <p class="title mb-3">
          엄마의 퀘스트가<br />
          시작됐어요!
        </p>
        <img src="/images/img_quest_box.png" style="width:182px" />
        <p class="description" style="margin-top:-60px">어떤 퀘스트가 도착했는지 확인해볼까요?</p>
      </div>
    </div>
    <b-row>
      <b-col class="p-2 mt-2 mb-5">
        <b-button variant="primary" @click="onStart">퀘스트 시작하기</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import Sidebar from '@/components/baby/side-bar'
  export default {
    components: {
      'side-bar':Sidebar
    },
    data () {
      return {
        linked:[],
        questGroup:'',
      }
    },
    async mounted () {
      this.linked = await this.loadData()
      this.questGroup = await this.loadQuestGroup()

      this.$store.commit('Baby/setLinked', this.linked)
    },
    computed: {
      authUser () {
        return this.$store.getters['authUser']
      },
    },
    methods: {
      loadData () {
        return new Promise(resolve=>{
          this.$axios.get(`/api/linked/baby`, {
            params: {
              baby_nick_names:this.authUser,
            }
          }).then(res=>{
            resolve(res.data)
          })
        })
      },
      loadQuestGroup () {
        return new Promise(resolve=>{
          this.$axios.get(`/api/selectQuestGroup/${this.linked[0].id}`).then(res=>{
            resolve(res.data)
          })
        })
      },
      onStart () {
        if(this.questGroup[0].complete_state == 1) {
          this.$router.push({path:'/baby/quest/complete'})
        } else {
          if(this.questGroup[0].execution_state == 1) {
            this.$router.push({path:'/baby/quest/confirm'})
          } else {
            this.$router.push({path:'/baby/quest/tutorial'})
          }
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/common.scss";

.quest-start-wrapper {
  margin-top: rem(168px);
}
</style>
