<template>
  <div id="side-bar-baby">
    <b-button
      v-b-toggle.sidebar-right
      variant="white"
      class="btn-toggle"
    >
      <!-- <b-icon
        icon="list"
        scale="1.2"
      ></b-icon> -->
      <img
        v-if="theme=='black'"
        src="/images/btn-list.svg"
      />
      <img
        v-else
        src="/images/btn-list-white.svg"
      />
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
            <img
              :style="{
              'background':`url(${getProfileImageURL(userProfile.profile_image)})`,
            }"
              class="profile-image"
            />
            <p class="label">닉네임</p>
            <p class="nick-name">{{userProfile.nick_name}}</p>
            <div class="buttons">
              <b-button
                variant="light"
                @click="logout"
              >로그아웃</b-button>
              <b-button
                variant="primary"
                @click="$refs['modify-modal'].show()"
              >정보수정</b-button>
            </div>
          </div>
          <div class="divine"></div>
          <div class="linked-list">
            <ul>
              <li v-for="(link, i) in linked">
                <b-row>
                  <b-col cols="2">
                    <div
                      class="profile-image"
                      :style="{
            'background':`url(${profileImage})`,
            'width':'54px',
            'height':'54px',
            'border-radius': '100%',
          }"
                    ></div>
                  </b-col>
                  <b-col cols="6">
                    <p class="label">{{getlinkedtatusLabel(link.status)}}</p>
                    <p class="nick-name">{{link.mom_nick_name}}</p>
                  </b-col>
                  <b-col cols="4">
                    <b-button
                      variant="light"
                      v-if="link.status == 1"
                      @click="disconnection(link)"
                    >연결 해제</b-button>
                  </b-col>
                </b-row>
              </li>
            </ul>
          </div>
          <div class="footer-cont">
            <p class="text-right version">버전정보 1.00</p>
            <!-- <hr />
            <div class="info">
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
          :style="{
            'background':`url(${getProfileImageURL(form.profile_image_url)})`,
            'width':'100px',
            'height':'100px',
            'border-radius': '100%',
            'backbround-size':'cover !important'
          }"
        ></div>
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
    linked: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      require: false,
      default: "black",
    },
  },
  data() {
    return {
      userProfile: "",
      form: {
        profile_image_url: "",
        profile_image: "",
      },
      mom: "",
      profileImageUrl: "",
    };
  },
  computed: {
    authUser() {
      return this.$store.getters["authUser"];
    },
    profileImage() {
      if (window.location.host == "localhost:3000") {
        return `http://localhost:9102${this.profileImageUrl}`;
      } else {
        return this.profileImageUrl;
      }
    },
  },
  async mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.$axios.get(`/api/user/${this.authUser}`).then((res) => {
        this.userProfile = res.data[0];

        this.form.profile_image_url = this.userProfile.profile_image;
      });

      if (this.linked.length > 0) {
        this.mom = await this.loadMom();
        this.profileImageUrl = this.mom.profile_image;
      }
    },
    getProfileImageURL(url) {
      if (window.location.host == "localhost:3000") {
        return `http://localhost:9102${url}`;
      } else {
        return url;
      }
    },
    getlinkedtatusLabel(n) {
      return n == 1 ? "연결된 엄마" : "연결 전";
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
      }, 500);
    },
    loadMom() {
      return new Promise((resolve) => {
        this.$axios
          .get(`/api/user/${this.linked[0].mom_nick_name}`)
          .then((res) => {
            resolve(res.data[0]);
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

<style lang="scss" scoped>
</style>

<style lang="scss">
#modify-modal {
  .profile-image {
    width: 80px;
    height: 80px;
    border-radius: 100%;
    margin: 0 auto;

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

#side-bar-baby {
  .btn {
    line-height: rem(24px) !important;
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
      color: #000 !important;
    }
  }
}

.profile-image {
  background-size: cover !important;
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
    padding-top: 100px;
  }

  .profile-image {
    width: 80px;
    height: 80px;
    border-radius: 100%;
    background-size: cover !important;

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
