<template>
  <div>
    <div class="quest-wrapper">
      <div class="profile-image children">
        <div
          style="background-size:cover; width:100%; height:100%;"
          :style="{'background':`url(${getProfileImageURL(selectLink.profile_image)})`}"
        >
        </div>
      </div>
      <div class="text-center children-name">{{selectLink.baby_nick_names}}</div>
      <div class="text-center mb-6 ing">
        <span>퀘스트 진행중</span>
      </div>
      <div class="current-quest">
        <p>현재 수행중 퀘스트</p>
        <p class="quest-name">{{ingQuest[0] && ingQuest[0].title}}</p>
      </div>

      <div class="divine"></div>

      <div class="quest-list">
        <div
          v-if="isFirstQuest == true"
          class="text-center"
        >
          <img src="/images/img-carrot.svg" />
          <p class="first-message">
            {{selectLink.baby_nick_names}}와 함께하는 첫 퀘스트가 진행중입니다.<br />
            당근을 얻지 못해도 괜찮아요~<br />
            함께하는 과정을 재미있게 즐겨 주세요!<br />
            <br />
            아이와 함께하는 퀘스트는 무제한이니까요
          </p>
        </div>
        <ul class="list">
          <li
            @click="questConfirm(item.id, item)"
            v-for="(item, i) in executionQuestList"
            :key="`confirm-${i}`"
          >
            <template v-if="item.complete_state == 1">
              <b-row no-gutters>
                <b-col
                  class="date"
                  cols="2"
                >
                  <img
                    class="ico"
                    src="/images/ico-quest-success.svg"
                    v-if="item.success_state == 1"
                  />
                  <img
                    class="ico"
                    src="/images/ico-quest-notyet.svg"
                    v-else
                  />
                </b-col>
                <b-col
                  class="quest-title"
                  :class="{'success':item.success_state==1, 'failed':item.success_state==2}"
                  cols="7"
                >{{item.title}}
                </b-col>
              </b-row>
            </template>
          </li>
        </ul>
      </div>

      <div class="bottom-wrap text-center">
        <a
          class="quest-status"
          href="#"
          @click.prevent="goConfirm"
        >
          {{selectGroup.success_count}}개 중 <span class="text-primary">{{successCount}}</span>개달성
          <img src="/images/btn-next.svg" />
        </a>
      </div>

    </div>

    <b-modal
      ref="modal-quest-confirm"
      centered
      hide-header
      hide-footer
    >
      <div class="text-center">
        <p class="quest-title">"{{confirmQuest.title}}"</p>
        <p class="question">퀘스트를 달성했나요?</p>
      </div>

      <div class="quest-image">
        <img
          class="confirm-data-image"
          :src="confirmDataImageURL"
        />
      </div>

      <div class="text-center">
        <b-row>
          <b-col class="p-1">
            <b-button
              variant="light"
              @click="handleFailed()"
            >실패
            </b-button>
          </b-col>
          <b-col class="p-1">
            <b-button
              variant="primary"
              @click="handleSuccess()"
            >성공!
            </b-button>
          </b-col>
        </b-row>
      </div>
    </b-modal>

    <b-modal
      ref="modal-quest-complete"
      centered
      hide-header
      hide-footer
    >
      <div class="text-center">
        <p class="quest-title">"퀘스트를 완료하시겠습니까?"</p>
      </div>

      <div class="text-center m-3">
        <b-row>
          <b-col
            class="p-1"
            cols="5"
          >
            <b-button
              variant="light"
              @click="cancelComplete()"
            >취소
            </b-button>
          </b-col>
          <b-col
            class="p-1"
            cols="7"
          >
            <b-button
              variant="primary"
              @click="successComplete()"
            >완료
            </b-button>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script type="text/javascript">
import LoginCheck from "@/mixins/loginCheck.js";
import Top from "@/components/top";

export default {
  mixins: [LoginCheck],
  components: {
    top: Top,
  },
  data() {
    return {
      questList: [],
      executionQuestList: [],
      selectGroup: "",
      confirmQuest: "",
      links: [],
      confirmData: "",
      intervalId: "",
    };
  },
  computed: {
    authUser() {
      return this.$store.getters["authUser"];
    },
    selectLink() {
      return this.$store.getters["selectLink"];
    },
    giftImageURL() {
      if (window.location.host == "localhost:3000") {
        return `http://localhost:9102${this.selectGroup.success_gift}`;
      } else {
        return this.selectGroup.success_gift;
      }
    },
    confirmDataImageURL() {
      if (window.location.host == "localhost:3000") {
        return `http://localhost:9102${this.confirmData.execution_pic}`;
      } else {
        return this.confirmData.execution_pic;
      }
    },
    successCount() {
      let successQuest = _.filter(this.executionQuestList, (item) => {
        return item.success_state == 1;
      });
      return successQuest.length;
    },
    currentQuest() {
      let currentQuest = _.find(this.questList, (item) => {
        return moment(item.start_date).valueOf() <= moment().valueOf();
      });

      return currentQuest;
    },
    nextQuest() {
      let nextQuest = _.find(this.questList, (item) => {
        return (
          moment(item.start_date).valueOf() >
          moment(this.currentQuest.start_date).valueOf()
        );
      });

      return nextQuest;
    },
    successIndex() {
      let id = 0;
      let cnt = 0;

      _.forEach(this.questList, (item, i) => {
        if (item.success_state == 1 && cnt < this.selectGroup.success_count) {
          cnt++;
          id++;
        }
      });

      return id == this.selectGroup.success_count ? id : -1;
    },
    ingQuest() {
      return _.filter(this.executionQuestList, (item, i) => {
        console.log("item", item);
        return (
          item.execution_date ==
          moment().hour(0).minutes(0).seconds(0).format("YYYY-MM-DD HH:mm:ss")
        );
      });
    },
    executionList() {
      return _.filter(this.executionQuestList, (item) => {
        console.log("item", item);
        return item.success_state != 0;
      });
    },
    isFirstQuest() {
      let isFirst = true;

      _.forEach(this.executionQuestList, (item) => {
        if (item.complete_state != 0) isFirst = false;
      });

      return isFirst;
    },
  },
  mounted() {
    this.init();

    this.intervalId = setInterval(() => {
      this.init();
    }, 1000 * 3);
  },
  methods: {
    async init() {
      let selectGroup = await this.loadSelectGroup(this.selectLink);
      this.selectGroup = selectGroup[0];
      this.questList = await this.loadQuestList(this.selectGroup);
      this.executionQuestList = await this.loadExecutionQuestList(
        this.selectGroup
      );

      let newExecutionQuest = _.find(this.executionQuestList, (item) => {
        return item.success_state == 0 && item.complete_state == 1;
      });
      console.log("newExecutionQuest", newExecutionQuest);
      if (newExecutionQuest) {
        this.questConfirm(newExecutionQuest.id, newExecutionQuest);
      }

      await this.$axios
        .get(`/api/linked/mom`, {
          params: {
            mom_nick_name: this.authUser,
          },
        })
        .then((res) => {
          this.links = res.data;
          console.log("RES.DATA4444", res);

          this.completeCheck();
        });
    },
    // checkNewQuest() {
    //   let diff = moment().diff(moment(this.selectGroup.start_date), "days");

    //   for (let i = 0; i <= diff; i++) {
    //     let isEmptyQuest = true;
    //     let checkDate = moment(this.selectGroup.start_date)
    //       .add(i, "day")
    //       .hour(0)
    //       .minutes(0)
    //       .seconds(0)
    //       .format("YYYY-MM-DD HH:mm:ss");

    //     console.log("checkDate", checkDate);

    //     _.forEach(this.executionQuestList, (item) => {
    //       if (item.execution_date == checkDate) {
    //         isEmptyQuest = false;
    //       }
    //     });

    //     console.log("isEmptyQuest", isEmptyQuest);
    //     if (isEmptyQuest == true) {
    //       let randomQuest = _.shuffle(this.questList);

    //       this.$axios
    //         .post("/api/executionQuest", {
    //           title: randomQuest[0].title,
    //           group_id: this.selectGroup.id,
    //           execution_date: checkDate,
    //         })
    //         .then((res) => {
    //           console.log("res.data", res.data);
    //         });
    //     }
    //   }
    // },
    questConfirm(questId, confirmData) {
      this.confirmQuest = _.find(this.executionQuestList, (item) => {
        return item.id == questId;
      });

      this.confirmData = confirmData;

      // if(moment(this.confirmQuest.start_date).valueOf() <= moment().valueOf()) {
      //   this.$refs['modal-quest-confirm'].show()
      // }
      this.$refs["modal-quest-confirm"].show();
    },
    loadSelectGroup(link) {
      return new Promise((resolve) => {
        this.$axios.get(`/api/selectQuestGroup/${link.id}`).then((res) => {
          resolve(res.data);
        });
      });
    },
    loadQuestList(group) {
      return new Promise((resolve) => {
        this.$axios.get(`/api/selectQuest/${group.id}`).then((res) => {
          let list = _.sortBy(res.data, (item) => {
            return item.start_date;
          });

          resolve(list);
        });
      });
    },
    loadExecutionQuestList(group) {
      return new Promise((resolve) => {
        this.$axios.get(`/api/executionQuest/${group.id}`).then((res) => {
          let list = _.sortBy(res.data, (item) => {
            return item.start_date;
          });

          resolve(list);
        });
      });
    },
    getFormatDate(date) {
      return `${moment(date).month() + 1}월${moment(
        date
      ).date()}일(${this.getWeekName(moment(date).day())})`;
    },
    getFormatTime(date) {
      let hour = moment(date).hour();

      if (hour > 12) {
        return `오후 ${hour - 12}`;
      } else {
        return `오전 ${hour}`;
      }
    },
    questStatus() {
      let message = "";
      if (this.questList.length == 0) return "";

      let diff = moment(this.questList[0].start_date).diff(moment(), "day");
      message = `${diff + 1}일째 진행중`;

      return message;
    },
    async handleSuccess() {
      console.log(this.confirmQuest);
      this.$axios
        .post(`/api/executionQuestConfirm/${this.confirmQuest.id}`, {
          success_state: 1,
        })
        .then((res) => {
          this.resetQuestList();
          this.$refs["modal-quest-confirm"].hide();
        });
    },
    async handleFailed() {
      this.$axios
        .post(`/api/executionQuestConfirm/${this.confirmQuest.id}`, {
          success_state: 2,
        })
        .then((res) => {
          this.resetQuestList();
          this.$refs["modal-quest-confirm"].hide();
        });
    },
    async resetQuestList() {
      this.questList = await this.loadQuestList(this.selectGroup);
      this.executionQuestList = await this.loadExecutionQuestList(
        this.selectGroup
      );

      this.completeCheck();
    },
    executionPicURL(url) {
      if (window.location.host == "localhost:3000") {
        return `http://localhost:9102${url}`;
      } else {
        return url;
      }
    },
    completeCheck() {
      this.$nextTick(() => {
        if (this.successCount == this.selectGroup.success_count) {
          console.log("complete");

          this.$refs["modal-quest-complete"].show();
        }
      });
    },
    cancelComplete() {
      this.$refs["modal-quest-complete"].hide();
    },
    successComplete() {
      this.$axios
        .post(`/api/completeQuestGroup/${this.selectGroup.id}`, {
          state: "1",
        })
        .then((res) => {
          this.$router.push({ path: "/mom/quest/ing/complete" });
        });
    },
    goConfirm() {
      if (this.selectGroup.complete_state == "1") {
        this.$router.push({ path: "/mom/quest/ing/complete" });
      } else {
        this.$router.push({ path: "/mom/quest/ing" });
      }
    },
    getProfileImageURL(url) {
      if (window.location.host == "localhost:3000") {
        return `http://localhost:9102${url}`;
      } else {
        return url;
      }
    },
  },
  destroyed() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  },
};
</script>

<style lang="scss" scoped>
.today-quest {
  background: #497ff5;
  color: #fff;
  box-shadow: 0 5px 10px #ccc;
  margin-bottom: rem(30px);
  padding: rem(30px) 0;

  .date {
    font-size: rem(16px);
    margin-bottom: rem(10px);
  }

  .title {
    font-weight: 600;
    font-size: rem(20px);
    margin-bottom: rem(30px);
  }

  .description {
    font-size: rem(14px);
    color: #497ff5;
    background: #fff;
    border-radius: rem(40px);
    width: rem(200px);
    line-height: rem(40px);
    text-align: center;
    margin: 0 auto;
  }
}

.div {
  background: #f5f5f5;
  height: rem(18px);
  position: absolute;
  width: 100%;
  left: 0;
}

.quest-list {
  > .list {
    height: 240px;
    overflow-y: auto;
  }

  margin-top: rem(25px);

  .t1 {
    font-size: rem(16px);
    line-height: rem(30px);
  }

  .quest-status {
    font-size: rem(14px);
    line-height: rem(30px);
    color: #497ff5;
    text-align: right;
  }
}

.total-success {
  font-size: rem(18px);
  line-height: rem(30px);
  color: #000;
  margin-top: rem(10px);

  .count {
    color: #497ff5;
  }
}

.quest-list {
  .date {
    font-size: rem(13px);
    line-height: rem(48px);
    color: #000;
    font-family: NotoSansCJKkr-Regular;
  }

  .quest-title {
    font-size: rem(14px);
    line-height: rem(48px);

    &.success {
      color: #497ff5;
      text-decoration: line-through;
    }

    &.failed {
      color: #aaa;
      text-decoration: line-through;
    }
  }
}

.gift {
  margin-top: rem(25px);
  margin-bottom: rem(33px);

  img {
    max-width: 100%;
    border-radius: rem(5px);
  }
}
.modal-body {
  .quest-title {
    font-size: rem(24px);
    margin-bottom: 0;
    margin-top: rem(30px);
  }

  .question {
    font-size: rem(18px);
    margin-bottom: rem(60px);
  }
}

.quest-list-total {
  > ul {
    &:after {
      clear: both;
      content: "";
      display: block;
    }

    > li {
      width: 20%;
      float: left;
      margin-bottom: rem(18px);

      .ico {
        width: rem(48px);
        height: rem(48px);
      }
    }
  }
}

.date {
  font-size: rem(14px);
}

.execution-image {
  width: rem(44px);
  height: rem(44px);
  border-radius: 4px;
}

.confirm-data-image {
  width: 100%;
  box-shadow: 2px 2px 10px 5px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  margin-bottom: rem(40px);
}

.current-quest {
  background: #1ec89b;
  border-radius: rem(16px);
  padding: rem(14px) rem(14px) rem(36px) rem(14px);
  color: #fff;
  margin-bottom: rem(30px);

  p {
    margin-bottom: 0;
    font-weight: 400;
  }

  .quest-name {
    font-weight: 500;
    margin-top: rem(20px);
    font-size: rem(20px);
  }
}

.quest-status {
  color: #000;
}

.first-message {
  color: #aaa;
  font-size: rem(14px);
  margin-top: rem(16px);
}

.profile-image {
  width: rem(80px);
  height: rem(80px);
  position: relative;
  margin: 0 auto;

  > div {
    background-size: cover !important;
    border-radius: 100%;
  }
}

.children-name {
  font-size: rem(20px);
  padding: rem(5px);
  font-weight: 700;
}

.ing {
  > span {
    background: #1d7ff1;
    color: #fff;
    border-radius: rem(12px);
    font-size: rem(14px);
    padding: rem(2px) rem(10px);
  }
}

.list {
  padding-bottom: rem(150px);
}

.bottom-wrap {
  padding-top: rem(5px);
  background: #fff;
}

.quest-image {
  max-height: 300px;
  overflow: auto;
  max-width: 100%;
}
</style>
