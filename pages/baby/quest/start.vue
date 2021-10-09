<template>
  <div>
    <side-bar :linked="linked"></side-bar>
    <!-- <linked-mom :linked="linked"></linked-mom> -->
    <div class="quest-start-wrapper">
      <div class="">
        <h1 class="">
          엄마의 퀘스트가<br />
          시작됐어요!
        </h1>
        <p class="description">어떤 퀘스트가 도착했는지 확인해볼까요?</p>
        <p class="text-center">
          <img
            class="img-gift-box"
            src="/images/gift-box.jpg"
          />
        </p>
      </div>
    </div>
    <div class="bottom-wrap">
      <b-button
        variant="primary"
        @click="onStart"
      >퀘스트 시작하기</b-button>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/baby/side-bar";
export default {
  components: {
    "side-bar": Sidebar,
  },
  data() {
    return {
      linked: [],
      questGroup: "",
      intervalId: "",
    };
  },
  mounted() {
    this.init();

    this.intervalId = setInterval(() => {
      this.init();
    }, 1000 * 30);
  },
  computed: {
    authUser() {
      return this.$store.getters["authUser"];
    },
  },
  methods: {
    async init() {
      this.linked = await this.loadData();
      this.questGroup = await this.loadQuestGroup();

      this.$store.commit("Baby/setLinked", this.linked);

      if (this.questGroup[0].execution_state == 1) {
        this.$router.push({ path: "/baby/quest/confirm" });
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
    loadQuestGroup() {
      return new Promise((resolve) => {
        this.$axios
          .get(`/api/selectQuestGroup/${this.linked[0].id}`)
          .then((res) => {
            resolve(res.data);
          });
      });
    },
    onStart() {
      if (this.questGroup[0].complete_state == 1) {
        this.$router.push({ path: "/baby/quest/complete" });
      } else {
        if (this.questGroup[0].execution_state == 1) {
          this.$router.push({ path: "/baby/quest/confirm" });
        } else {
          this.$router.push({ path: "/baby/quest/tutorial" });
        }
      }
    },
  },
  destroyed() {
    window.clearInterval(this.intervalId);
  },
};
</script>

<style lang="scss" scoped>
.quest-start-wrapper {
  .description {
    margin-top: rem(-30px);
    color: $primary;
  }
}

.img-gift-box {
  max-width: 100%;
}
</style>
