<template>
  <div id="linked">
      <div class="linked-babies text-center" v-if="completeLinked.length > 0">
          <b-button
          class="btn-link"
          v-for="(link, i) in completeLinked"
          :class="{
            'bg-white':link.status==0,
            'bg0':link.status==1 && i==0,
            'bg1':link.status==1 && i==1,
          }"
          >
              <img :src="getProfileImageURL(link.profile_image)" class="face" />
              <template v-if="link.status == 0">
                {{link.mom_nick_name}} 연결중...
              </template>
              <template v-else>
                {{link.mom_nick_name}}
              </template>
          </b-button>
      </div>
      <div class="linked-babies not-linked text-center" v-else>
        <b-button class="btn-link" variant="white">
            <img src="/images/icon_mom.png" class="face2" /> 엄마의 신호가 필요해요
        </b-button>
        <p class="exclamation"><img src="/images/icon_warning.png" /></b-icon></p>
      </div>
  </div>
</template>

<script>
 export default {
   props: {
     linked: {
       type:Array,
       required:true,
     }
   },
   data () {
     return {

     }
   },
   computed: {
     mom () {
       console.log('THIS.$STORE', this.$store)
       return this.$store.getters['Baby/mom']
     },
     profileImageURL () {
         if(window.location.host == 'localhost:3000') {
           return `http://localhost:9102${this.mom.profile_image}`
         } else {
           return this.mom.profile_image
         }
     },
     completeLinked () {
        let linked = _.filter(this.linked, item=>{
          return item.status == 1
        })

        _.forEach(linked, async (item, i) => {
          let baby = await this.loadMom(item)
          this.$set(item, 'profile_image', baby[0].profile_image)
        });

        return linked
     },
   },
   mounted () {
   },
   methods: {
     loadMom(mom) {
       return new Promise(resolve=>{
         this.$axios.get(`/api/user/${mom.mom_nick_name}`).then(res=>{
           resolve(res.data)
         })
       })
     },
     getProfileImageURL (url) {
         if(window.location.host == 'localhost:3000') {
           return `http://localhost:9102${url}`
         } else {
           return url
         }
     },
   }
 }
</script>

<style lang="scss" scoped>
  @import "~@/assets/scss/common.scss";

  #linked {
      position: fixed;
      top:rem(80px);
      left:0;
      right:0;
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
