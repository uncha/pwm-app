<template>
  <div>
    <side-bar :links="links"></side-bar>
    <p class="title text-center">
        퀘스트를<br />
        만들어보세요.
    </p>

    <linked-babies :links="links" @selectLink="onSelectLink">
    </linked-babies>

    <template v-if="!selectLink || selectLink.status == 0">

      <a href="#" class="btn-create-quest">
        <span class="create-text">
          퀘스트<br />
          만들기<br />
          <b-icon class="ing-icon" icon="chevron-right" font-scale="1"></b-icon>
        </span>
      </a>
      <p class="ing text-center">
        <img src="/images/group_22.png" />
        <b-icon class="ing-icon" icon="three-dots" animation="cylon" font-scale="2.4"></b-icon>
      </p>
    </template>
    <template v-else>
      <p class="ing text-center active">
        <img src="/images/illust.png" />
      </p>
      <template v-if="isIng===false">
        <a href="#" class="btn-create-quest active" @click.prevent="$router.push({path:'/mom/quest/create/select-quest'})">
          <div class="gradient-circle">
            <span class="create-text">
              퀘스트<br />
              만들기<br />
              <b-icon class="ing-icon" icon="chevron-right" font-scale="1"></b-icon>
            </span>
          </div>
        </a>
      </template>
      <template v-else>
        <a href="#" class="btn-create-quest active" @click.prevent="goConfirm">
          <div class="gradient-circle">
            <span class="create-text">
              퀘스트<br />
              확인하기<br />
              <b-icon class="ing-icon" icon="chevron-right" font-scale="1"></b-icon>
            </span>
          </div>
        </a>
      </template>
    </template>
  </div>
</template>

<script type="text/javascript">
    import LoginCheck from '@/mixins/loginCheck.js'
    import LinkedBabies from '@/components/mom/quest/linked-babies'
    import SideBar from '@/components/mom/side-bar'
    
    export default {
      mixins:[LoginCheck],
      components: {
          'linked-babies': LinkedBabies,
          'side-bar': SideBar,
      },
      data () {
        return {
          links:[],
          selectLink:'',
          isIng:false,
          intervalId:'',
          selectGroup:'',
        }
      },
      async fetch() {
        await this.$axios.get(`/api/linked/mom`, {
          params:{
            mom_nick_name:this.authUser
          }
        }).then(res=>{
          this.links = res.data
        })
      },
      computed: {
        authUser () {
          return this.$store.getters['authUser']
        },
      },
      mounted () {
        this.intervalId = window.setInterval(()=>{
          this.$fetch()
        }, 1000 * 60)
      },
      methods: {
        async onSelectLink (link) {
          this.selectGroup = await this.loadSelectGroup(link)
          if(this.selectGroup.length > 0){
            this.isIng = true
          } else {
            this.isIng = false
          }

          this.selectLink = link
          this.$store.commit('setSelectLink', link)
        },
        loadSelectGroup (link) {
           return new Promise(resolve=>{
              this.$axios.get(`/api/selectQuestGroup/${link.id}`).then(res=>{
                  resolve(res.data)
              })
           })
        },
        goConfirm () {
          if(this.selectGroup[0].complete_state == '1') {
            this.$router.push({path:'/mom/quest/ing/complete'})
          } else {
            this.$router.push({path:'/mom/quest/ing'})
          }
        },
      },
      destroyed () {
        window.clearInterval(this.intervalId)
      },
    }
</script>


<style lang="scss" scoped>
@import "~@/assets/scss/common.scss";
.title {
  font-size: rem(36px);
  line-height: rem(44px);
  margin-top: rem(96px);
  margin-bottom: rem(26px);
}

.ing {
  position: absolute;
  bottom: rem(27px);
  left:0;
  right:0;

  img {
    width:rem(67px);
  }

  &.active {
    img {
      width:rem(122px);
    }
  }

  .ing-icon {
    color:#bbb;
    padding-top:rem(5px);
  }
}

.btn-create-quest {
  display: block;
  text-align: center;
  width: rem(234px);
  height: rem(234px);
  border-radius: 100%;
  background: #ddd;
  margin:0 auto;
  text-decoration: none;
  margin-top: rem(25px);

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
