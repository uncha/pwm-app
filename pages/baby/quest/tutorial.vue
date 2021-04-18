<template>
  <div>
    <top :linked="links" :backURL="'/baby/quest/start'"></top>
    <div class="quest-start">
      <template v-if="step==1">
        <div class="title">
          <span class="text-primary">{{authUser}}</span>야, <br />
          오늘부터
        </div>
      </template>
      <template v-if="step==2">
        <div class="title">
          새로운 퀘스트가<br />
          시작될거야.
        </div>
      </template>
      <template v-if="step==3">
        <div class="title">
          총 <span class="text-primary">{{questGroup.success_count}}</span>개의<br />
          당근을 모으면
        </div>
      </template>
      <template v-if="step==4">
        <div class="title">
          이 <span class="text-primary">선물</span>이<br />
          기다리고 있을거야
        </div>
        <img class="success-gift" :src="giftImageURL" />
      </template>
      <template v-if="step==5">
        <div class="title">
          엄마의<br />
          퀘스트에<br />
          도전해 볼래?
        </div>
        <a href="#" class="btn-create-quest active" @click.prevent="$router.push({path:'/baby/quest/confirm'})">
          <div class="gradient-circle">
            <span class="create-text">
              도전하기<br />
              <b-icon class="ing-icon mt-4" icon="chevron-right"  font-scale="1"></b-icon>
            </span>
          </div>
        </a>
      </template>
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
        step:1,
        timerId:'',
        linked:'',
        questGroup:'',
      }
    },
    computed: {
      authUser () {
        return this.$store.getters['authUser']
      },
      giftImageURL () {
          if(window.location.host == 'localhost:3000') {
            return `http://localhost:9102${this.questGroup.success_gift}`
          } else {
            return this.questGroup.success_gift
          }
      },
      links () {
        return this.$store.getters['Baby/linked']
      },
    },
    async mounted () {
      this.timerId = setInterval(()=>{
        this.step++
        if(this.step == 5) {
          clearInterval(this.timerId)
        }
      }, 1000);

      this.linked = await this.loadData()
      this.questGroup = await this.loadQuestGroup()
      console.log('THIS.QUESTGROUP', this.questGroup)
    },
    methods: {
      loadData () {
        return new Promise(resolve=>{
          this.$axios.get(`/api/linked/baby`, {
            params: {
              baby_nick_names:this.authUser,
            }
          }).then(res=>{
            resolve(res.data[0])
          })
        })
      },
      loadQuestGroup () {
        return new Promise(resolve=>{
          this.$axios.get(`/api/selectQuestGroup/${this.linked.id}`).then(res=>{
            resolve(res.data[0])
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/common.scss";

.quest-start {
  padding:0 rem(20px);

  .title {
    font-size: rem(32px);
    margin-top:rem(100px);
  }

  .success-gift {
    width: 100%;
    border-radius: 5px;
    margin-top:rem(48px);
  }
}


.btn-create-quest {
  position: absolute;
  bottom:rem(120px);
  display: block;
  text-align: center;
  width: rem(234px);
  height: rem(234px);
  border-radius: 100%;
  background: #ddd;
  margin:0 auto;
  left:0;
  right:0;
  text-decoration: none;

  &.active {
    background: #FFF;
    border: 1px solid #50bfd0;
    width: rem(248px);
    height: rem(248px);

    .gradient-circle {
      background:linear-gradient(130deg, #61faa9, #3f85f9, #f71cba);
      width:rem(234px);
      height:rem(234px);
      position: relative;
      left:rem(6px);
      top:rem(6px);
      border-radius: 100%;
    }
  }

  .create-text {
    font-size: rem(36px);
    line-height: rem(48px);
    color:#FFF;
    padding-top:rem(50px);
    display: inline-block;
  }
}
</style>
