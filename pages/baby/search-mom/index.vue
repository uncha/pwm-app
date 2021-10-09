<template>
  <div>
    <div
      id="search-mom"
      v-if="render == true"
    >
      <side-bar :linked="linked"></side-bar>
      <!-- <linked-mom :linked="linked"></linked-mom> -->
      <div class="cont">
        <template v-if="linked.length == 0">
          <!-- <p class="mt-5"><img src="/images/icon_mom.png" />엄마의 신호가 필요해요.</p> -->

          <h1>
            엄마의 신호가
            올때까지<br /> 잠시만
            기다려볼까요?
          </h1>

        </template>
        <template v-else>
          <template v-if="!questGroup">
            <div class="stay-quest-box">
              <h1>
                아직,
                퀘스트가<br /> 도착하지
                않았습니다.<br />
              </h1>
              <p class="description">
                엄마가 퀘스트를 줄 때까지 <br />
                잠깐만 기다려주세요.
              </p>
            </div>
          </template>
        </template>
      </div>

      <div
        class="stay"
        v-if="linkedComplete.length == 0"
      >
        <p>
          <img src="/images/icon-baby-face.svg" />
          <b-icon
            icon="three-dots"
            animation="cylon"
            font-scale="2"
            style="color:#bbb"
          ></b-icon>
        </p>
        <p class="txt">
          엄마를 하염없이 기다리는 중…
        </p>
      </div>
      <div
        class="stay"
        v-else
      >
        <p>
          <img src="/images/icon-baby-face.svg" />
          <b-icon
            icon="three-dots"
            animation="cylon"
            font-scale="2"
            style="color:#bbb"
          ></b-icon>
        </p>
        <p class="txt">
          엄마를 하염없이 기다리는 중…
        </p>
      </div>

      <b-modal
        id="linked-mom-modal"
        ref="linked-mom-modal"
        hide-header
        hide-footer
        centered
        :no-close-on-backdrop="true"
      >
        <template v-if="linkedStay.length > 0">
          <div class="text-center">
            <p class="upload-image mb-0">
              <template v-if="mom.profile_image">
                <img
                  class="profile-image"
                  :style="{
                    'background':`url(${profileImageURL})`,
                  }"
                />
              </template>
            </p>
            <h1 class="mt-0 mb-1">{{mom.nick_name}}</h1>
            <p class="question text-primary mb-6">엄마가 맞나요?</p>
          </div>
          <b-row>
            <b-col class="">
              <b-button
                variant="light"
                @click="no"
              >아니에요</b-button>
            </b-col>
            <b-col class="">
              <b-button
                variant="primary"
                @click="yes"
              >네, 맞아요</b-button>
            </b-col>
          </b-row>
        </template>
        <template v-else>
          <div class="text-center">
            <!-- <p class="upload-image">
              <template v-if="mom.profile_image">
                <img :src="profileImageURL" />
              </template>
            </p> -->
            <p class="primary">{{mom.nick_name}}</p>
            <p>연결이 완료 되었습니다.</p>
          </div>
          <b-row>
            <b-col class="p-2">
              <b-button
                variant="primary"
                @click="linkedSuccess"
              >확인</b-button>
            </b-col>
          </b-row>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/baby/side-bar";
import LinkedMom from "@/components/baby/linked-mom";
export default {
  components: {
    "linked-mom": LinkedMom,
    "side-bar": Sidebar,
  },
  data() {
    return {
      linked: [],
      questGroup: "",
      mom: "",
      render: false,
      intervalId: "",
    };
  },
  computed: {
    authUser() {
      return this.$store.getters["authUser"];
    },
    profileImageURL() {
      if (window.location.host == "localhost:3000") {
        return `http://localhost:9102${this.mom.profile_image}`;
      } else {
        return this.mom.profile_image;
      }
    },
    linkedStay() {
      let linked = _.filter(this.linked, (item) => {
        return item.status == 0;
      });

      return linked;
    },
    linkedComplete() {
      let linked = _.filter(this.linked, (item) => {
        return item.status == 1;
      });

      return linked;
    },
  },
  mounted() {
    this.init();

    this.intervalId = window.setInterval(() => {
      this.init();
    }, 1000 * 3);
  },
  methods: {
    async init() {
      this.linked = await this.loadData();

      if (this.linked.length > 0) {
        this.questGroup = await this.loadQuestGroup();

        if (this.questGroup) this.$router.push({ path: "/baby/quest/start" });
        else this.render = true;

        this.mom = await this.loadMom();
        console.log("THIS.MOM", this.mom);
        this.$store.commit("Baby/setMom", this.mom);

        if (this.linkedStay.length > 0) {
          this.$refs["linked-mom-modal"].show();
        }
      } else {
        this.render = true;
      }
    },
    loadData() {
      return new Promise((resolve) => {
        this.$axios
          .get(`/api/linked/baby`, {
            params: {
              baby_nick_names: this.authUser,
            },
          })
          .then((res) => {
            resolve(res.data);
          });
      });
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
    loadQuestGroup() {
      return new Promise((resolve) => {
        this.$axios
          .get(`/api/selectQuestGroup/${this.linked[0].id}`)
          .then((res) => {
            resolve(res.data[0]);
          });
      });
    },
    updateLinkedStatus() {
      return new Promise((resolve) => {
        this.$axios
          .post(`/api/update-linked/${this.linked[0].id}`, {
            status: 1,
          })
          .then((res) => {
            resolve(res.data);
          });
      });
    },
    deleteLinkedStatus() {
      return new Promise((resolve) => {
        this.$axios
          .post(`/api/delete-linked/${this.linked[0].id}`)
          .then((res) => {
            resolve(res.data);
          });
      });
    },
    async yes() {
      await this.updateLinkedStatus();
      this.$refs["linked-mom-modal"].hide();
      this.linked = await this.loadData();
    },
    async no() {
      await this.deleteLinkedStatus();
      this.$refs["linked-mom-modal"].hide();
    },
    linkedSuccess() {
      this.$refs["linked-mom-modal"].hide();
    },
  },
  destroyed() {
    window.clearInterval(this.intervalId);
  },
};
</script>

<style lang="scss" scoped>
.stay {
  position: fixed;
  bottom: 50px;

  .txt {
    color: $primary;
    text-decoration: underline;
    font-size: 12px;
    font-family: NotoSansMonoCJKkr-Regular;
  }
}

.stay-quest-box {
  .description {
    color: $primary;
    margin-top: rem(-30px);
  }
}

.profile-image {
  width: 80px;
  height: 80px;
  border-radius: 100%;
  margin: 0 auto;
  background-size: cover !important;
}

.question {
  font-size: rem(12px);
  font-weight: 400;
  font-family: NotoSansMonoCJKkr-Regular;
}
</style>

<style lang="scss">
</style>
