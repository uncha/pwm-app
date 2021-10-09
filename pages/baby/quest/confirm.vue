<template>
  <div>
    <top
      :linked="linked"
      :theme="'white'"
    ></top>
    <div
      class="quest-box"
      :class="{'quest-fail':ingQuest[0] && ingQuest[0].success_state == 2}"
    >
      <template v-if="ingQuest[0] && questGroup[0]">
        <template v-if="ingQuest[0].complete_state == 0">
          <p class="text-white">수행 퀘스트</p>
          <h1 class="quest-name text-white">{{ingQuest[0].title}}</h1>
          <p class="text-center">
            <img src="/images/icon-dangen.svg" />
          </p>
          <div class="button-wrap">
            <b-button
              variant="white"
              class="btn-confirm btn-white"
              @click="$router.push({path:'/baby/quest/perform'})"
            >완료 했나요?</b-button>
          </div>
        </template>
        <template v-else-if="ingQuest[0].complete_state == 1">
          <template v-if="successCount != questGroup[0].success_count">
            <template v-if="ingQuest[0].success_state == 0">
              <p class="mb-0 text-white">수행 퀘스트</p>
              <h1 class="ing text-white">
                엄마가 퀘스트 완료를<br>
                확인중 이에요...
              </h1>
              <div class="text-center">
                <img src="/images/img-confirm.svg" />
              </div>
            </template>
            <template v-else-if="ingQuest[0].success_state == 1">
              <div class="quest-success">
                <p class="msg">짝짝짝 <br />퀘스트 성공!</p>
                <p class="img-success-carot">
                  <img
                    class="img-dk"
                    src="/images/img-success-carot.svg"
                  />
                </p>
                <p class="txt-dk">당근획득 +1</p>

                <div class="bottom-wrap">
                  <b-button
                    class="btn btn-white"
                    @click="nextQuest"
                  >다음 퀘스트 확인하기</b-button>
                </div>
              </div>
            </template>
            <template v-else-if="ingQuest[0].success_state == 2">
              <div class="quest-fail">
                <p class="msg">아쉬워라~ㅠㅠ</p>
                <p class="img-fail-carot">
                  <img
                    class="img-dk"
                    src="/images/img-fail-carot.svg"
                  />
                </p>
                <p class="txt-dk">당근획득 +0</p>

                <div class="bottom-wrap">
                  <b-button
                    class="btn btn-white"
                    @click="nextQuest"
                  >다음 퀘스트 확인하기</b-button>
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <div class="quest-success">
              <p class="msg">짝짝짝 <br />퀘스트 성공!</p>
              <p class="img-success-carot">
                <img
                  class="img-dk"
                  src="/images/img-success-carot.svg"
                />
              </p>
              <p class="txt-dk">당근획득 +1</p>
            </div>
            <div class="bottom-wrap text-white text-center">
              <p></p>모든 퀘스트가 완료되었습니다.<br /> 잠시만 기다려주세요.
            </div>
          </template>
        </template>
      </template>
    </div>

    <div
      class="quest-success-count"
      @click="goIng"
    >
      <div class="row">
        <div class="inline-col">
          <div
            class="profile-image"
            :style="{
            'background':`url(${profileImage})`,
            'width':'54px',
            'height':'54px',
            'border-radius': '100%',
          }"
          ></div>
        </div>
        <div class="col pl-2 pr-6">
          <div class="row mb-2">
            <div class="col">
              <p class="mb-0 name">{{this.mom.nick_name}}</p>
            </div>
            <div
              class="col text-right"
              v-if="this.questGroup[0]"
            >
              {{this.questGroup[0].success_count}}개 중 <span class="text-primary">{{successCount}}</span>개 달성 중
            </div>
          </div>
          <b-progress
            :value="progress"
            :max="max"
            :precision="2"
            class="mb-3"
          ></b-progress>
          <b-button
            variant="white"
            class="btn-next"
          ><img src="/images/btn-next2.svg" /></b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Top from "@/components/baby/top";
export default {
  components: {
    top: Top,
  },
  data() {
    return {
      questGroup: [],
      quest: [],
      executionQuestList: [],
      intervalId: "",
      profileImageUrl: "",
      max: 100,
      mom: "",
    };
  },
  computed: {
    linked() {
      return this.$store.getters["Baby/linked"];
    },
    ingQuest() {
      return _.sortBy(this.executionQuestList, "id").reverse();
    },
    successCount() {
      return _.filter(this.executionQuestList, (item) => {
        return item.success_state == 1;
      }).length;
    },
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
    progress() {
      if (!this.questGroup[0]) return 0;
      return (this.successCount / this.questGroup[0].success_count) * 100;
    },
  },
  async mounted() {
    this.init();
    //this.loadProfile();
    this.mom = await this.loadMom();
    this.profileImageUrl = this.mom.profile_image;

    console.log("mounted@@@@@");
    this.intervalId = setInterval(() => {
      console.log("set interval########");
      this.init();
    }, 1000 * 3);
  },
  methods: {
    async init() {
      this.questGroup = await this.loadQuestGroup();

      if (!this.questGroup[0]) {
        this.$router.push({ path: "/baby/search-mom" });
      }

      if (this.questGroup[0].complete_state == 1) {
        this.$router.push({ path: "/baby/quest/complete" });
      }

      this.quest = await this.loadQuest();
      this.executionQuestList = await this.loadExecutionQuestList();

      // this.checkNewQuest();
    },
    checkNewQuest() {
      let diff = moment().diff(moment(this.questGroup[0].start_date), "days");

      for (let i = 0; i <= diff; i++) {
        let isEmptyQuest = true;
        let checkDate = moment(this.questGroup[0].start_date)
          .add(i)
          .hour(0)
          .minutes(0)
          .seconds(0)
          .format("YYYY-MM-DD HH:mm:ss");

        _.forEach(this.executionQuestList, (item) => {
          if (item.execution_date == checkDate) {
            isEmptyQuest = false;
          }
        });

        // 퀘스트가 없을경우 생성
        console.log("isEmptyQuest", isEmptyQuest);
        if (isEmptyQuest == true) {
          let randomQuest = _.shuffle(this.quest);
          console.log("randomQuest", randomQuest);
          console.log("params", this.questGroup[0]);
          this.$axios
            .post("/api/executionQuest", {
              title: randomQuest[0].title,
              group_id: this.questGroup[0].id,
              execution_date: checkDate,
            })
            .then(async (res) => {
              console.log("res.data", res.data);

              this.executionQuestList = await this.loadExecutionQuestList();
            });
        }
      }
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
    loadProfile() {
      this.$axios.get(`/api/user/${this.authUser}`).then((res) => {
        console.log(res);

        this.userProfile = res.data[0];

        this.profileImageUrl = this.userProfile.profile_image;
      });
    },
    loadQuestGroup() {
      return new Promise((resolve) => {
        this.$axios
          .get(`/api/selectQuestGroup/${this.linked[0].id}`)
          .then((res) => {
            resolve(res.data);
          });
      });
    },
    loadQuest() {
      return new Promise((resolve) => {
        this.$axios
          .get(`/api/selectQuest/${this.questGroup[0].id}`)
          .then((res) => {
            let list = _.sortBy(res.data, (item) => {
              return item.start_date;
            });

            resolve(list);
          });
      });
    },
    loadExecutionQuestList() {
      return new Promise((resolve) => {
        this.$axios
          .get(`/api/executionQuest/${this.questGroup[0].id}`)
          .then((res) => {
            let list = _.sortBy(res.data, (item) => {
              return item.start_date;
            });

            console.log("list@@@@@", list);

            resolve(list);
          });
      });
    },
    // setNextQuest() {
    //   this.$axios
    //     .post(`/api/completeQuest/${this.ingQuest[0].id}`)
    //     .then((res) => {
    //       this.init();
    //     });
    // },
    onCompleteQuest() {
      this.$axios
        .post(`/api/completeQuestGroup/${this.questGroup[0].id}`, {
          state: "1",
        })
        .then((res) => {
          this.$router.push({ path: "/baby/quest/complete" });
        });
    },
    goIng() {
      this.$router.push({
        path: "/baby/quest/ing?back=/baby/quest/confirm",
      });
    },
    nextQuest() {
      let randomQuest = _.shuffle(this.quest);

      this.$axios
        .post("/api/executionQuest", {
          title: randomQuest[0].title,
          group_id: this.questGroup[0].id,
          execution_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        })
        .then(async (res) => {
          console.log("res.data", res.data);

          this.executionQuestList = await this.loadExecutionQuestList();
        });
    },
  },
  destroyed() {
    console.log("clear interval~~~~~~~~~~~~~~");
    window.clearInterval(this.intervalId);
  },
};
</script>

<style lang="scss" scoped>
.quest-box {
  height: calc(100% - 134px);
}

.quest-success-count {
  padding: rem(30px) rem(30px);
  position: fixed;
  bottom: 0;
  left: 0;
  background: #fff;
  width: 100%;

  .name {
    font-family: NotoSansCJKkr-Bold !important;
    font-size: 14px;
  }

  .ing {
    font-size: 14px;
  }

  .btn-next {
    position: absolute;
    padding: 0.4rem;
    width: auto;
    height: auto;
    line-height: rem(16px);
    right: rem(-8px);
    top: rem(10px);
  }
}

.btn-white {
  background: #fff;
  color: #1ec89b;
}

.profile-image {
  background-size: cover !important;
}

.button-wrap {
  position: fixed;
  left: 0;
  bottom: 160px;
  width: 100%;
  padding: 0 rem(30px);
}

.quest-success {
  color: #fff;
  text-align: center;
  .msg {
    font-size: rem(30px);
    line-height: 1.5;
    font-weight: 700;
  }
  .txt-dk {
    font-size: rem(26px);
    font-weight: 700;
  }

  .img-success-carot {
    margin: 0 auto;
    margin-bottom: rem(10px);
    width: rem(246px);
    line-height: rem(246px);
    border-radius: 100%;
    background: #a4e9d6;
  }
}

.quest-fail {
  color: #fff;
  text-align: center;
  .msg {
    font-size: rem(30px);
    line-height: 1.5;
    font-weight: 700;
  }
  .txt-dk {
    font-size: rem(26px);
    font-weight: 700;
  }

  .img-fail-carot {
    margin: 0 auto;
    margin-bottom: rem(20px);
    margin-top: rem(56px);
  }
}

.bottom-wrap {
  bottom: rem(130px);
}

.quest-name {
  font-size: rem(28px);
}
</style>
