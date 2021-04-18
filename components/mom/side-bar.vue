<template>
  <div id="side-bar">
    <b-button v-b-toggle.sidebar-right variant="white" class="btn-toggle"><b-icon icon="list" scale="1.2"></b-icon></b-button>
    <b-sidebar id="sidebar-right" right shadow>
      <div class="sidebar-right-cont">
        <div class="profile text-center">
          <img :src="getProfileImageURL(userProfile.profile_image)" class="profile-image" />
          <p class="label">닉네임</p>
          <p class="nick-name">{{userProfile.nick_name}}</p>
          <div class="buttons">
            <b-button variant="light" @click="logout">로그아웃</b-button>
            <b-button variant="light">수정</b-button>
          </div>
        </div>
        <div class="divine"></div>
        <div class="linked-list">
          <ul>
            <li v-for="(link, i) in links">
              <b-row>
                <b-col cols="2">
                  <img :src="getProfileImageURL(link.profile_image)" class="profile-image children" />
                </b-col>
                <b-col cols="6">
                  <p class="label">{{getLinkStatusLabel(link.status)}}</p>
                  <p class="nick-name">{{link.baby_nick_names}}</p>
                </b-col>
                <b-col cols="4">
                <b-button variant="light" v-if="link.status == 1">연결 해제</b-button>
                </b-col>
              </b-row>
            </li>
            <li>
              <b-button variant="primary" class="add-chilren" @click="$router.push({path:'/mom/search-baby'})">자녀 추가하기</b-button>
            </li>
          </ul>
        </div>
        <div class="footer-cont">
          <p class="text-right version">버전정보 1.00</p>
          <hr />
          <div class="info">
            <p class="company mb-0">㈜엑스티</p>
            <p class="details">서울시 관악구 남부순환로 1531, 2층<br/>
            사업자등록번호 822-88-00882<br/>
            대표 김현수, 송의택<br/>
            TEL 02-853-6582</p>
          </div>
        </div>
      </div>
    </b-sidebar>
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
        userProfile:'',
      }
    },
    computed: {
      authUser () {
        return this.$store.getters['authUser']
      },
    },
    mounted () {
      this.$axios.get(`/api/user/${this.authUser}`).then(res=>{
        this.userProfile = res.data[0]
      })
    },
    methods: {
      getProfileImageURL (url) {
        if(window.location.host == 'localhost:3000') {
          return `http://localhost:8001${url}`
        } else {
          return url
        }
      },
      getLinkStatusLabel (n) {
        return n == 1 ? '연결된 자녀' : '연결 전'
      },
      logout () {
        let w = window.open('https://nid.naver.com/nidlogin.logout', "PopupWin", "width=500,height=600")
        setTimeout(()=>{
          w.close()
          this.$router.push({path:'/'})
        }, 100)
      },
    }
  }
</script>

<style lang="scss">
#side-bar {
  .btn-toggle {
    position: fixed;
    top:17px;
    right:12px;
  }

  .b-sidebar-header {
    position: absolute;
    top:15px;
    right:5px;

    .close {
      color:#000 !important;
    }
  }
}

#sidebar-right {
  width:100%;
  background: #FFF !important;

  .sidebar-right-cont {
    padding:24px;
    padding-top:70px;
  }

  .profile-image {
    width:80px;
    height: 80px;
    border-radius: 100%;

    &.children {
      width:48px;
      height: 48px;
    }
  }

  .label {
    font-size: 14px;
    color:#aaa;
    margin-top:10px;
    margin-bottom: 0;
  }

  .nick-name {
    font-size: 20px;
  }

  button.btn {
    width: auto;
    height: auto;
    font-size: 12px;
  }

  .buttons {
    margin-bottom: 30px;
  }

  .footer-cont {
    margin-top:60px;

    .info {
      color:#aaa;
      font-size: 12px;
      line-height: 18px;

      .company {
        line-height: 30px;
      }
    }

    .version {
      font-size: 12px;
      color:#aaa;
      margin-bottom: 0;
    }

    hr {
      margin:0.5rem 0;
    }
  }

  .linked-list {
    > ul {
      > li {
        padding:20px 0;
        border-bottom: 1px solid #eee;

        .label {
          margin:0;
          font-size: 12px;
        }

        .nick-name {
          margin:0;
          font-size: 16px;
        }

        button.btn {
          float:right;

          font-size:12px;
          margin-top: 8px;

          &.add-chilren {
            background: #497ff5;
          }
        }

        &:last-child {
          border-bottom: 0;
        }
      }
    }
  }
}
</style>
