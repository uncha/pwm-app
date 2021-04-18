<template>
    <div id="linked">
        <div class="linked-babies text-center" v-if="links.length > 0">
            <b-button
            class="btn-link"
            v-for="(link, i) in list"
            @click="onSelect(link)"
            :class="{
              'bg-white':link.status==0,
              'bg0':link.status==1 && i==0,
              'bg1':link.status==1 && i==1,
            }"
            >
                <img :src="getProfileImageURL(link.profile_image)" class="face" />
                <template v-if="link.status == 0">
                  {{link.baby_nick_names}} 연결중...
                </template>
                <template v-else>
                  {{link.baby_nick_names}}
                </template>
            </b-button>
        </div>
        <div class="linked-babies not-linked text-center" v-else>
          <b-button class="btn-link" variant="white" @click="$router.push({path:'/mom/search-baby'})">
              <img src="/images/group_34.png" class="face2" /> 자녀를 연결해 주세요.
          </b-button>
          <p class="exclamation"><img src="/images/icon_warning.png" /></b-icon></p>
        </div>
    </div>
</template>

<script>
  export default {
    props:{
      links: {
        type:Array,
        required:true,
      }
    },
    data () {
      return {
        nickName:''
      }
    },
    computed: {
      list () {
        return this.links.slice(0,2)
      },
    },
    watch: {
      links () {
        this.nickName = this.list[0].baby_nick_name

        this.$emit('selectLink', this.list[0])

        _.forEach(this.list, async (item, i) => {
          let baby = await this.loadBaby(item)
          this.$set(item, 'profile_image', baby[0].profile_image)
        });
      }
    },
    mounted () {
    },
    methods: {
      onSelect (link) {
        this.$emit('selectLink', link)
      },
      loadBaby(baby) {
        return new Promise(resolve=>{
          this.$axios.get(`/api/user/${baby.baby_nick_names}`).then(res=>{
            resolve(res.data)
          })
        })
      },
      getProfileImageURL (url) {
          if(window.location.host == 'localhost:3000') {
            return `http://localhost:8001${url}`
          } else {
            return url
          }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/scss/common.scss";

  #linked {
      // width:calc(100% - 3rem);
      // position: fixed;
      // bottom:rem(60px);
  }

  .linked-babies {
    .btn-link {
      border:1px solid #dddddd;
      border-radius: rem(100px);
      padding:rem(2px) rem(15px) rem(2px) rem(2px);
      font-size: rem(14px);
      color:#000;
      text-decoration: none;
      margin-right: rem(12px);
      left: rem(-12px);
      position: relative;

      &.bg0 {
        background: #ff7ba6;
        color:#FFF;
      }

      &.bg1 {
        background: #7b97ff;
        color:#FFF;
      }
    }

    &.not-linked {
      .exclamation {
        position: relative;
        top: -50px;
        right: -75px;

        img {
          width:rem(24px);
        }
      }
    }
  }

  .face {
    width:rem(44px);
    height:rem(44px);
    border-radius: 100%;
    margin-right: rem(6px);
  }

  .face2 {
    width:rem(36px);
    height:rem(32px);
    margin-right: rem(6px);
  }
</style>
