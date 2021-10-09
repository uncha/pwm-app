<template>
  <div>
    <top :linked="linked"></top>
    <div class="wrap text-center">
      <p class="title"><span class="strong">WOW!!<br> 모든 퀘스트를 달성<br> 하였습니다!
        </span><br />
      </p>
      <div class="gift-wrap">
        <div
          v-if="questGroup"
          class="profile-image"
          :style="{
            'background':`url(${this.giftImageURL})`,
            'width':'260px',
            'height':'260px',
            'margin':'0 auto',
            'border-radius': '100%',
          }"
        >
        </div>
        <img
          class="medal"
          src="/images/small-medal.svg"
        >
      </div>
      <p class="txt">엄마가 선물을 준비중!
      </p>
    </div>

    <div
      class="quest-success-count"
      @click="goIng"
    >
      <div class="divine"></div>
      <div class="row">
        <div class="inline-col">
          <div
            class="profile-image"
            :style="{
            'background':`url(${this.profileImage})`,
            'width':'54px',
            'height':'54px',
            'border-radius': '100%',
          }"
          ></div>
        </div>
        <div class="col pl-2 pr-6">
          <div class="row mb-2">
            <div class="col">
              <p class="mb-0 name">{{authUser}}</p>
            </div>
            <div
              class="col text-right ing"
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
      questGroup: "",
      profileImageUrl: "",
      quest: "",
      executionQuestList: [],
      intervalId: "",
    };
  },
  computed: {
    linked() {
      return this.$store.getters["Baby/linked"];
    },
    giftImageURL() {
      console.log(
        "THIS.QUESTGROUP[0].SUCCESS_GIFT",
        this.questGroup[0].success_gift
      );
      if (window.location.host == "localhost:3000") {
        console.log("???");
        return `http://localhost:9102${this.questGroup[0].success_gift}`;
      } else {
        return this.questGroup[0].success_gift;
      }
    },
    authUser() {
      return this.$store.getters["authUser"];
    },
    successCount() {
      return _.filter(this.executionQuestList, (item) => {
        return item.success_state == 1;
      }).length;
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
  mounted() {
    this.init();
    this.loadProfile();

    this.intervalId = setInterval(() => {
      this.init();
    }, 1000 * 3);
  },
  methods: {
    async init() {
      this.questGroup = await this.loadQuestGroup();

      if (this.questGroup.length == 0) {
        this.$router.push("/baby/search-mom");
      }

      this.quest = await this.loadQuest();
      this.executionQuestList = await this.loadExecutionQuestList();

      console.log("this.executionQuestList", this.executionQuestList);
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
    loadQuestGroup() {
      return new Promise((resolve) => {
        this.$axios
          .get(`/api/selectQuestGroup/${this.linked[0].id}`)
          .then((res) => {
            resolve(res.data);
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

            resolve(list);
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
    goIng() {
      this.$router.push({ path: "/baby/quest/ing?back=/baby/quest/complete" });
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
.upload-image {
  width: rem(260px);
  height: rem(260px);
  border-radius: 100%;
  margin-top: rem(40px);
}

.title {
  .strong {
    font-family: NotoSansCJKkr-Bold;
    font-size: rem(30px);
  }
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
.profile-image {
  background-size: cover !important;
}

.txt {
  font-size: rem(16px);
  color: #1ec89b;
  font-weight: 700;
  margin-top: rem(20px);
}
.bottom-wrap {
  bottom: rem=(80px);
}

.divine {
  top: -40px;
  left: -30px;
}

.gift-wrap {
  position: relative;

  .medal {
    position: absolute;
    bottom: -47px;
    right: 48px;
  }
}
</style>
