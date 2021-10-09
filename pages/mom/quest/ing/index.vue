<template>
  <div>
    <top
      :whiteBg="true"
      :backURL="'/mom/quest/create/start'"
    >
    </top>
    <div>
      <b-row>
        <b-col>
          <p class="tit">퀘스트 완료현황</p>
        </b-col>
        <b-col class="text-right">
        </b-col>
      </b-row>
      <div class="quest-list-total">
        <!-- {{completeCount}} -->
        <ul v-if="selectGroup">
          <li
            v-for="i in selectGroup.success_count"
            :key="`cnt-${i}`"
          >
            <template v-if="i <= completeCount">
              <img
                class="ico"
                src="/images/ico-quest-success.svg"
              />
            </template>
            <template v-else>
              <img
                class="ico"
                src="/images/ico-quest-notyet.svg"
              />
            </template>
          </li>
        </ul>
      </div>
      <div class="divine"></div>
      <div class="quest-list">
        <p>퀘스트 달성현황</p>
        <ul class="list">
          <!-- <li
            @click="questConfirm(item.id, item)"
            v-for="(item, i) in executionQuestList"
            :key="`confirm-${i}`"
          > -->
          <li
            v-for="(item, i) in executionQuestList"
            :key="`confirm-${i}`"
          >
            <template v-if="item.complete_state == 1">
              <b-row no-gutters>
                <b-col
                  class=""
                  cols="2"
                >
                  <img
                    class="execution-image"
                    :src="executionPicURL(item.execution_pic)"
                  />
                </b-col>
                <b-col
                  class="date"
                  cols="10"
                >
                  <p class="mb-0">{{getFormatDate(item.execution_date)}}</p>
                  <p
                    class="quest-title"
                    :class="{'success':item.success_state==1, 'failed':item.success_state==2}"
                    cols="7"
                  >{{item.title}}
                  </p>
                </b-col>

              </b-row>
            </template>
          </li>
        </ul>
      </div>

      <div class="divine"></div>

      <div class="gift">
        <p>퀘스트 보상</p>
        <img
          class="upload-image"
          :src="giftImageURL"
        />
      </div>

      <div class="divine"></div>

      <div class="text-center">
        <a
          href="#"
          class="btn-cancel-quest"
          @click.prevent="cancelQuest"
        >퀘스트 취소하기</a>
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

      <div>
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
      ref="modal-quest-cancel"
      centered
      hide-header
      hide-footer
    >
      <div class="text-center">
        <p class="quest-title">퀘스트를 취소하시겠습니까?</p>
      </div>

      <div class="text-center mt-5">
        <b-row>
          <b-col class="p-1">
            <b-button
              variant="light"
              @click="handleCancelClose()"
            >아니요
            </b-button>
          </b-col>
          <b-col class="p-1">
            <b-button
              variant="primary"
              @click="handleCancel()"
            >취소할게요
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

<script>
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
      selectGroup: "",
      confirmQuest: "",
      links: [],
      confirmData: "",
      intervalId: "",
      successCount: 0,
      executionQuestList: [],
    };
  },
  computed: {
    authUser() {
      return this.$store.getters["authUser"];
    },
    selectLink() {
      return this.$store.getters["selectLink"];
    },
    completeCount() {
      return _.filter(this.executionQuestList, (item) => {
        return item.success_state == 1;
      }).length;
    },
    confirmDataImageURL() {
      if (window.location.host == "localhost:3000") {
        return `http://localhost:9102${this.confirmData.execution_pic}`;
      } else {
        return this.confirmData.execution_pic;
      }
    },

    giftImageURL() {
      if (window.location.host == "localhost:3000") {
        return `http://localhost:9102${this.selectGroup.success_gift}`;
      } else {
        return this.selectGroup.success_gift;
      }
    },
  },
  mounted() {
    this.init();

    // this.intervalId = setInterval(() => {
    //   this.init();
    // }, 1000 * 3);
  },
  methods: {
    async init() {
      let selectGroup = await this.loadSelectGroup(this.selectLink);
      this.selectGroup = selectGroup[0];
      this.questList = await this.loadQuestList(this.selectGroup);
      this.executionQuestList = await this.loadExecutionQuestList(
        this.selectGroup
      );

      console.log("this.executionQuestList", this.executionQuestList);

      await this.$axios
        .get(`/api/linked/mom`, {
          params: {
            mom_nick_name: this.authUser,
          },
        })
        .then((res) => {
          this.links = res.data;
          console.log("RES.DATA4444", res);

          //this.completeCheck();
        });
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
      if (!group) return [];

      return new Promise((resolve) => {
        this.$axios.get(`/api/executionQuest/${group.id}`).then((res) => {
          let list = _.sortBy(res.data, (item) => {
            return item.start_date;
          });

          resolve(list);
        });
      });
    },
    completeCheck() {
      this.$nextTick(() => {
        if (this.completeCount == this.selectGroup.success_count) {
          console.log("complete");

          if (this.$refs["modal-quest-complete"])
            this.$refs["modal-quest-complete"].show();
        }
      });
    },
    executionPicURL(url) {
      if (window.location.host == "localhost:3000") {
        return `http://localhost:9102${url}`;
      } else {
        return url;
      }
    },
    getFormatDate(date) {
      return `${moment(date).month() + 1}월${moment(
        date
      ).date()}일(${this.getWeekName(moment(date).day())})`;
    },
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
    cancelQuest() {
      this.$refs["modal-quest-cancel"].show();
    },
    handleCancelClose() {
      this.$refs["modal-quest-cancel"].hide();
    },
    handleCancel() {
      this.$axios
        .post(`/api/restartQuest/${this.selectGroup.id}`)
        .then((res) => {
          console.log("RES", res);
          this.$router.push({ path: "/mom/quest/create/start" });
        });
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
    position: relative;
    top: rem(2px);
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
    color: #aaa;
    font-family: NotoSansCJKkr-Regular;
  }

  .quest-title {
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
    border-radius: rem(15px);
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

.btn-cancel-quest {
  line-height: rem(60px);
  font-size: rem(14px);
  color: #aaa;

  &:active {
    text-decoration: none;
  }

  &:hover {
    text-decoration: none;
  }

  &:visited {
    text-decoration: none;
  }
}
</style>
