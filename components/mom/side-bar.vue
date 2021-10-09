<template>
  <div id="side-bar-mom">
    <b-button
      v-b-toggle.sidebar-right
      variant="white"
      class="btn-toggle"
    >
      <img src="/images/btn-list.svg" />
    </b-button>
    <b-sidebar
      id="sidebar-right"
      right
      shadow
      no-header
    >
      <template #default="{ hide }">
        <a
          href="#"
          @click.prevent="hide"
          class="btn-sidebar-close"
        >
          <img src="/images/btn-sidebar-close.svg" /></a>
        <div class="sidebar-right-cont">
          <div class="profile text-center">
            <div class="profile-image">
              <div
                :style="{'background':`url(${getProfileImageURL(userProfile.profile_image)})`}"
                style="background-size:cover !important; width:100%; height:100%; border-radius:100%"
              >
              </div>
              <!-- <img
            :src=""
            class=""
          /> -->
            </div>
            <p class="label">닉네임</p>
            <p class="nick-name">{{userProfile.nick_name}}</p>
            <div class="buttons">
              <b-button
                variant="light"
                class="pt-0 pb-0"
                @click="logout"
              >로그아웃</b-button>
              <b-button
                variant="primary"
                class="pt-0 pb-0"
                @click="$refs['modify-modal'].show()"
              >정보수정</b-button>
            </div>
          </div>
          <div class="divine"></div>
          <div class="linked-list">
            <ul>
              <li v-for="(link, i) in links">
                <b-row>
                  <b-col cols="2">
                    <div class="profile-image children">
                      <div
                        style="background-size:cover; width:100%; height:100%;"
                        :style="{'background':`url(${getProfileImageURL(link.profile_image)})`}"
                      >
                      </div>
                    </div>
                  </b-col>
                  <b-col cols="6">
                    <p class="label">{{getLinkStatusLabel(link.status)}}</p>
                    <p class="nick-name">{{link.baby_nick_names}}</p>
                  </b-col>
                  <b-col cols="4">
                    <b-button
                      variant="light"
                      class="pt-0 pb-0"
                      v-if="link.status == 1"
                      @click="disconnection(link)"
                    >연결 해제</b-button>
                  </b-col>
                </b-row>
              </li>
              <!-- <li>
                <b-button
                  variant="primary"
                  class="add-chilren pt-0 pb-0"
                  @click="$router.push({path:'/mom/search-baby'})"
                >자녀 추가하기</b-button>
              </li> -->
            </ul>
          </div>
          <div class="footer-cont">
            <p class="text-right version">버전정보 1.00</p>
            <!-- <hr /> -->
            <!-- <div class="info">
              <p class="company mb-0">㈜엑스티</p>
              <p class="details">서울시 관악구 남부순환로 1531, 2층<br />
                사업자등록번호 822-88-00882<br />
                대표 김현수, 송의택<br />
                TEL 02-853-6582</p>
            </div> -->
          </div>
        </div>
      </template>
    </b-sidebar>

    <b-modal
      id="modify-modal"
      ref="modify-modal"
      title="프로필 수정"
      hide-footer
      centered
    >
      <div class="profile text-center">
        <div
          class="profile-image"
          :style="{'background':`url(${getProfileImageURL(form.profile_image_url)})`}"
        >
        </div>
        <div class="profile-image-wrapper">
          <div class="box-file-input"><label>
              <b-form-group :label="''">
                <b-form-file
                  @change="onUploadImage"
                  accept="image/jpeg, image/png, image/gif"
                  v-model="form.profile_image"
                  class="mt-3"
                  plain
                ></b-form-file>
              </b-form-group>
            </label>
            <p class="mt-2">
              사진등록
            </p>
          </div>
        </div>
        <b-row>
          <b-col
            cols="5"
            class="pl-1 pr-1"
          >
            <b-button
              variant="light"
              @click="cancelModify"
            >취소</b-button>
          </b-col>
          <b-col
            cols="7"
            class="pl-1 pr-1"
          >
            <b-button
              variant="primary"
              @click="saveModify"
            >저장</b-button>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    links: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      userProfile: "",
      form: {
        profile_image_url: "",
        profile_image: "",
      },
    };
  },
  computed: {
    authUser() {
      return this.$store.getters["authUser"];
    },
    list() {
      return this.links.slice(0, 2);
    },
  },
  watch: {},
  mounted() {
    this.init();

    setTimeout(() => {
      this.nickName = this.list[0].baby_nick_name;

      _.forEach(this.list, async (item, i) => {
        let baby = await this.loadBaby(item);
        this.$set(item, "profile_image", baby[0].profile_image);
      });
    }, 1000);
  },
  methods: {
    init() {
      this.$axios.get(`/api/user/${this.authUser}`).then((res) => {
        this.userProfile = res.data[0];

        this.form.profile_image_url = this.userProfile.profile_image;
      });
    },
    getProfileImageURL(url) {
      if (window.location.host == "localhost:3000") {
        return `http://localhost:9102${url}`;
      } else {
        return url;
      }
    },
    getLinkStatusLabel(n) {
      return n == 1 ? "연결된 자녀" : "연결 전";
    },
    logout() {
      let w = window.open(
        "https://nid.naver.com/nidlogin.logout",
        "PopupWin",
        "width=500,height=600"
      );
      setTimeout(() => {
        w.close();
        this.$router.push({ path: "/" });
      }, 100);
    },
    loadBaby(baby) {
      return new Promise((resolve) => {
        this.$axios.get(`/api/user/${baby.baby_nick_names}`).then((res) => {
          resolve(res.data);
        });
      });
    },
    onUploadImage() {
      let formData = new FormData();

      window.setTimeout(() => {
        formData.append("profile_image", this.form.profile_image);

        this.$axios
          .post("/api/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            this.form.profile_image_url = `/uploads/${res.data}`;

            this.$forceUpdate();
          });
      });
    },
    cancelModify() {
      this.$refs["modify-modal"].hide();
      this.form.profile_image_url = this.userProfile.profile_image;
    },
    saveModify() {
      this.$axios
        .post(`/api/user/${this.authUser}`, {
          profile_image: this.form.profile_image_url,
        })
        .then((res) => {
          this.init();
          this.$refs["modify-modal"].hide();
        });
    },
    disconnection(link) {
      console.log("LINK", link);
      this.$axios.post(`/api/disconnection/${link.id}`).then((res) => {
        console.log("RES", res);
        this.$router.push({ path: "/" });
      });
    },
  },
};
</script>

<style lang="scss">
#modify-modal {
  .profile-image {
    width: 80px;
    height: 80px;
    border-radius: 100%;
    margin: 0 auto;
    background-size: cover !important;

    &.children {
      width: 48px;
      height: 48px;
    }
  }

  .modal-header {
    .close {
      display: none;
    }
  }

  .profile-image-wrapper {
    position: relative;
    margin: 0 auto;
    top: rem(-80px);

    .box-file-input {
      position: absolute;
      z-index: 6;
      text-align: center;
      left: 0;
      right: 0;
    }

    .box-file-input .form-group {
      margin-bottom: 0;
    }

    .box-file-input label {
      display: inline-block;
      background: #497ff5;
      color: #fff;
      cursor: pointer;
      border-radius: 100%;
      position: relative;
      right: -25px;
      bottom: -12px;
    }

    .box-file-input label:after {
      display: inline-block;
      background-position: 0 0;
      background-repeat: no-repeat;
      width: rem(28px) !important;
      height: rem(24px) !important;
      content: "";
      background-image: url(/images/icon-camera.svg) !important;
      background-size: 60% !important;
      background-position: rem(6.5px) rem(6.5px) !important;
    }

    .box-file-input input[type="file"] {
      display: none;
    }

    .box-file-input .filename {
      display: inline-block;
      padding-left: rem(10px);
    }
  }
}

#side-bar-mom {
  .btn {
    line-height: rem(36px) !important;
    border-radius: rem(12px) !important;
  }
  .btn-toggle {
    position: fixed;
    top: rem(39px);
    right: rem(12px);
    width: auto;
  }

  .b-sidebar-header {
    position: absolute;
    top: rem(24px);
    right: rem(5px);

    .close {
      color: red !important;
    }
  }
}

#sidebar-right {
  width: 100%;
  background: #fff !important;

  .btn-sidebar-close {
    position: absolute;
    right: rem(20px);
    top: rem(45px);
  }

  .sidebar-right-cont {
    padding: 24px;
    padding-top: rem(100px);
  }

  .profile-image {
    width: 80px;
    height: 80px;
    margin: 0 auto;

    > div {
      border-radius: 100%;
      background-size: cover !important;
    }

    &.children {
      width: 48px;
      height: 48px;
    }
  }

  .label {
    font-size: 14px;
    color: #aaa;
    margin-top: 10px;
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
    margin-top: 60px;

    .info {
      color: #aaa;
      font-size: 12px;
      line-height: 18px;

      .company {
        line-height: 30px;
      }
    }

    .version {
      font-size: 12px;
      color: #aaa;
      margin-bottom: 0;
    }

    hr {
      margin: 0.5rem 0;
    }
  }

  .linked-list {
    > ul {
      > li {
        padding: 20px 0;
        border-bottom: 1px solid #eee;

        .label {
          margin: 0;
          font-size: 12px;
        }

        .nick-name {
          margin: 0;
          font-size: 16px;
        }

        button.btn {
          float: right;

          font-size: 12px;
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
