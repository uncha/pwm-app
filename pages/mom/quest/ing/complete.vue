<template>
  <div>
    <top
      :hideBack="true"
      :backURL="'/mom/quest/create/start'"
    >
    </top>
    <div class="text-center">
      <h1 class="">WOW!!<br>
        모든 퀘스트를 달성<br>
        하였습니다!</h1>
      <!-- <img class="upload-image" :src="giftImageURL" /> -->
      <div class="gift-wrap">
        <div
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
      <p class="txt">아이와의 약속을 지켜주세요!</p>
      <div class="bottom-wrap">
        <b-button
          variant="primary"
          class="mt-4"
          @click="restartQuest"
        >새로운 퀘스트 시작하기</b-button>
      </div>
    </div>
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
      selectGroup: "",
    };
  },
  async fetch() {
    let selectGroup = await this.loadSelectGroup(this.selectLink);
    this.selectGroup = selectGroup[0];
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
  },
  methods: {
    loadSelectGroup(link) {
      return new Promise((resolve) => {
        this.$axios.get(`/api/selectQuestGroup/${link.id}`).then((res) => {
          resolve(res.data);
        });
      });
    },
    restartQuest() {
      this.$axios
        .post(`/api/restartQuest/${this.selectGroup.id}`)
        .then((res) => {
          console.log("RES", res);
          this.$router.push({ path: "/mom/quest/create/start" });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.complete-wrapper {
  margin-top: rem(80px);
}

.title {
  font-size: rem(24px);
  font-family: NotoSansCJKkr-Bold;
}

.upload-image {
  width: rem(260px);
  height: rem(260px);
  border-radius: 100%;
  margin-top: rem(40px);
}

.profile-image {
  background-size: cover !important;
}

.gift-wrap {
  position: relative;

  .medal {
    position: absolute;
    bottom: -47px;
    right: 48px;
  }
}

.txt {
  font-size: rem(16px);
  color: #1ec89b;
  font-weight: 700;
  margin-top: rem(20px);
}
</style>
