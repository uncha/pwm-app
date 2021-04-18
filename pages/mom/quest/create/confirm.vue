<template>
  <div>
    <top></top>
    <div class="confirm-wrap">
      <p class="title text-center">
        지금부터, <br/>
        매일 퀘스트가 주어집니다.
      </p>
      <p class="title-img">
        <img class="w-100" src="/images/img-quest.png" />
      </p>
      <p class="title text-center">
        하나의 퀘스트가 종료되면 <br/>
        다음 퀘스트가 랜덤으로 <br/>
        발송되며 진행됩니다.
      </p>
      <b-button class="btn-confirm" variant="primary" @click="onSubmit">
          퀘스트 시작하기
      </b-button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    computed: {
      questList () {
        return this.$store.getters['questList']
      },
      successCount () {
        return this.$store.getters['successCount']
      },
      gift () {
        return this.$store.getters['gift']
      },
      selectLink () {
        return this.$store.getters['selectLink']
      },
    },
    methods: {
      onSubmit () {

        let form = {
          linked_id:this.selectLink.id,
          success_count:this.successCount,
          success_gift:this.gift,
          date_type:'day',
          event_time:0,
          event_week:0,
          start_date:moment().format('YYYY-MM-DD'),
        }

        this.$axios.post('/api/selectQuestGroup', form).then(res=>{
          let promises = []
          let startDate = moment()
          let eventDate

          _.shuffle(this.questList)

          _.forEach(this.questList, (title, i) => {
            promises.push(new Promise(resolve=>{
              eventDate = startDate.add('day', 1).hour(0).minutes(0).seconds(0)

              this.$axios.post('/api/selectQuest', {
                title:title,
                group_id:res.data.insertId,
                start_date:eventDate.format('YYYY-MM-DD HH:mm:ss'),
              }).then(res=>{
                resolve(res)
              })
            }))
          });

          Promise.all(promises).then(resAll=>{
            this.$router.push({path:'/mom/quest/ing'})
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
    @import "~@/assets/scss/common.scss";

    .title {
      font-size: rem(20px);
    }

    .confirm-wrap {
      margin-top:rem(84px);
    }

    .title-img {
      margin: rem(40px) 0 rem(24px);
    }

    .btn-confirm {
      position: absolute;
      bottom:rem(24px);
      width:calc(100% - 48px)
    }
</style>
