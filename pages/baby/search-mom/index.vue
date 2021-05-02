<template>
  <div>
    <div id="search-mom" v-if="render == true">
      <side-bar :linked="linked"></side-bar>
      <linked-mom :linked="linked"></linked-mom>
      <div class="cont">
        <template v-if="linked.length == 0">
        <!-- <p class="mt-5"><img src="/images/icon_mom.png" />엄마의 신호가 필요해요.</p> -->

        <div class="stay-connection text-center">
          엄마의 신호가<br />
          올때까지 잠시만<br />
          기다려볼까요?
        </div>

        </template>
        <template v-else>
          <template v-if="!questGroup">
            <div class="blue-box stay-quest-box">
              <p class="title">
                아직,<br />
                퀘스트가 도착하지<br />
                않았습니다.<br />
              </p>
              <p class="description">
                엄마가 퀘스트를 줄 때까지 <br />
                잠깐만 기다려주세요.
              </p>
            </div>
          </template>
        </template>
      </div>

      <div class="stay" v-if="linkedComplete.length == 0">
        <p>
          <img src="/images/icon_baby.png" />
          <b-icon icon="three-dots" animation="cylon" font-scale="2" style="color:#bbb"></b-icon>
        </p>
        <p class="txt">
          엄마를 하염없이  기다리는 중…
        </p>
      </div>
      <div class="stay" v-else>
        <p>
          <img src="/images/icon_baby.png" />
          <b-icon icon="three-dots" animation="cylon" font-scale="2" style="color:#bbb"></b-icon>
        </p>
        <p class="txt">
          엄마의 퀘스트를  기다리는 중…
        </p>
      </div>

      <b-modal id="linked-mom-modal" ref="linked-mom-modal" hide-header hide-footer centered  :no-close-on-backdrop="true">
        <template v-if="linkedStay.length > 0">
          <div class="text-center">
            <p class="upload-image">
                <template v-if="mom.profile_image">
                    <img :src="profileImageURL" />
                </template>
            </p>
            <p class="primary">{{mom.nick_name}}</p>
            <p>엄마가 맞나요?</p>
          </div>
          <b-row>
            <b-col class="p-2">
              <b-button variant="light" @click="no">아니오</b-button>
            </b-col>
              <b-col class="p-2">
                <b-button variant="primary" @click="yes">네</b-button>
              </b-col>
          </b-row>
        </template>
        <template v-else>
          <div class="text-center">
            <p class="upload-image">
                <template v-if="mom.profile_image">
                    <img :src="profileImageURL" />
                </template>
            </p>
            <p class="primary">{{mom.nick_name}}</p>
            <p>연결이 완료 되었습니다.</p>
          </div>
          <b-row>
            <b-col class="p-2">
              <b-button variant="primary">확인</b-button>
            </b-col>
          </b-row>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/baby/side-bar'
import LinkedMom from '@/components/baby/linked-mom'
  export default {
    components: {
      'linked-mom': LinkedMom,
      'side-bar':Sidebar
    },
    data () {
      return {
        linked:[],
        questGroup:'',
        mom:'',
        render:false,
        intervalId:'',
      }
    },
    computed: {
      authUser () {
        return this.$store.getters['authUser']
      },
      profileImageURL () {
          if(window.location.host == 'localhost:3000') {
            return `http://localhost:9102${this.mom.profile_image}`
          } else {
            return this.mom.profile_image
          }
      },
      linkedStay () {
          let linked = _.filter(this.linked, item=>{
            return item.status == 0
          })

          return linked;
      },
      linkedComplete () {
          let linked = _.filter(this.linked, item=>{
            return item.status == 1
          })

          return linked;
      },
    },
    mounted () {
      this.init()

      this.intervalId = window.setInterval(()=>{
        this.init()
      }, 1000 * 30)
    },
    methods: {
      async init () {
        this.linked = await this.loadData()

        if(this.linked.length > 0) {
          this.questGroup = await this.loadQuestGroup()

          if(this.questGroup) this.$router.push({path:'/baby/quest/start'})
          else this.render = true

          this.mom = await this.loadMom()
          this.$store.commit('Baby/setMom', this.mom)

          if(this.linkedStay.length > 0) {
            this.$refs['linked-mom-modal'].show()
          }
        } else {
          this.render = true
        }
      },
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
      loadMom () {
        return new Promise(resolve=>{
          this.$axios.get(`/api/user/${this.linked[0].mom_nick_name}`).then(res=>{
            resolve(res.data[0])
          })
        })
      },
      loadQuestGroup () {
        return new Promise(resolve=>{
          this.$axios.get(`/api/selectQuestGroup/${this.linked[0].id}`).then(res=>{
            resolve(res.data[0])
          })
        })
      },
      updateLinkedStatus () {
        return new Promise(resolve=>{
          this.$axios.post(`/api/update-linked/${this.linked[0].id}`, {
            status:1,
          }).then(res=>{
            resolve(res.data)
          })
        })
      },
      deleteLinkedStatus () {
        return new Promise(resolve=>{
          this.$axios.post(`/api/delete-linked/${this.linked[0].id}`).then(res=>{
            resolve(res.data)
          })
        })
      },
      async yes () {
        await this.updateLinkedStatus();
        this.$refs['linked-mom-modal'].hide()
        this.linked = await this.loadData()
      },
      async no () {
        await this.deleteLinkedStatus();
        this.$refs['linked-mom-modal'].hide()
      },
    },
    destroyed () {
      window.clearInterval(this.intervalId)
    },
  }
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/common.scss";

#search-mom {
  margin-top:rem(168px);
}

.title {
  margin-top: rem(30px);
  font-size:rem(32px);
  line-height: rem(44px);
  position: relative;
  margin-bottom: rem(60px);

  .title-img {
    position: absolute;
    top:rem(40px);
    right: rem(40px);

    img {
      width: rem(100px);
    }
  }
}

.description {
  font-size: rem(16px);
  line-height: rem(24px);
  margin-top:rem(30px);
}

.stay-connection {
  margin-top: rem(40px);
  background:url('/images/baby-ing-mom.png');
  background-size: contain;
  background-repeat: no-repeat;
  border-radius: rem(8px);
  color:#FFF;
  font-size: rem(24px);
  line-height: ren(30px);
  padding:rem(112px) 0 rem(250px) 0;
}

.stay {
  padding:rem(30px) rem(20px);

  img {
    width: rem(36px);
  }

  .txt {
    font-size: rem(12px);
    color:#1773e2;
    text-decoration: underline;
  }
}

.modal {
  .upload-image {
      width: rem(100px);
      height: rem(100px);
      background: #f1cef5;
      border-radius: 100%;
      overflow: hidden;
      z-index:5;
      margin::0 auto;

      img {
          width:100%;
      }
  }
}


.btn-create-quest {
  position: absolute;
  bottom:rem(80px);
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

.stay-quest-box {

}
</style>

<style lang="scss">
@import "~@/assets/scss/common.scss";
#linked-mom-modal{
  .upload-image {
      width: rem(100px);
      height: rem(100px);
      background: #f1cef5;
      border-radius: 100%;
      overflow: hidden;
      z-index:5;
      margin::0 auto;

      img {
          width:100%;
          height: 100%;
      }
  }
}
</style>
