<template>
  <div>
    <div class="quest-start-wrap">
      <div class="quest-start">
        <div
          class="title blue-box"
          ref="title1"
        >
          {{authUser}}야, <br />
          오늘부터
        </div>
        <div
          class="title blue-box mt-4"
          ref="title2"
        >
          <span class="text-primary">매일매일</span> 새로운<br />
          퀘스트가 시작될거야.
        </div>
        <div
          class="title blue-box"
          ref="title3"
        >
          <span class="text-primary">총 {{questGroup.success_count}}개의</span> 퀘스트를<br />
          달성하면,
        </div>
        <div
          class="title blue-box"
          ref="title4"
        >
          <p
            class="success-gift mb-1"
            :style="{'background':`url(${giftImageURL})`}"
          />
          이 선물이<br />
          기다리고 있을거야
        </div>
        <div
          class="title blue-box"
          ref="title5"
        >
          엄마의
          퀘스트에<br />
          도전해 볼래?
          <b-button
            variant="white"
            class="btn-challege mt-4"
            @click="onChallenge()"
          >도전할래!</b-button>
        </div>
        <div class="baby-icon text-center">
          <img src="/images/baby-tutorial-icon.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "animate.css";
import Top from "@/components/baby/top";

export default {
  components: {
    top: Top,
  },
  data() {
    return {
      step: 1,
      timerId: "",
      linked: "",
      questGroup: "",
    };
  },
  computed: {
    authUser() {
      return this.$store.getters["authUser"];
    },
    giftImageURL() {
      if (window.location.host == "localhost:3000") {
        return `http://localhost:9102${this.questGroup.success_gift}`;
      } else {
        return this.questGroup.success_gift;
      }
    },
    links() {
      return this.$store.getters["Baby/linked"];
    },
  },
  async mounted() {
    let time = 1000;
    // this.timerId = setInterval(() => {
    //   this.step++;
    //   if (this.step == 5) {
    //     clearInterval(this.timerId);
    //   }
    // }, 3000);

    // console.log("this.$refs[]", this.$refs["title1"]);

    const title1 = this.$refs["title1"];
    const title2 = this.$refs["title2"];
    const title3 = this.$refs["title3"];
    const title4 = this.$refs["title4"];
    const title5 = this.$refs["title5"];

    title1.classList.add("animate__animated", "animate__fadeInUp", "blue-box");
    title1.style.bottom = "195px";

    title1.addEventListener("animationend", handleAnimationEnd1, {
      once: true,
    });

    function handleAnimationEnd1() {
      title1.classList.remove(
        "animate__animated",
        "animate__fadeInUp",
        "animate__slideInUp"
      );

      setTimeout(() => {
        title1.classList.add("animate__animated", "animate__slideInUp");
        title1.style.bottom = "345px";

        title2.classList.add("animate__animated", "animate__fadeInUp");
        title2.style.bottom = "195px";

        title1.classList.remove("blue-box");
        title1.classList.add("white-box");
      }, time);
    }

    title2.addEventListener("animationend", handleAnimationEnd2, {
      once: true,
    });

    function handleAnimationEnd2() {
      title1.classList.remove(
        "animate__animated",
        "animate__fadeInUp",
        "animate__slideInUp"
      );
      title2.classList.remove("animate__animated", "animate__fadeInUp");

      setTimeout(() => {
        title1.classList.add("animate__animated", "animate__slideInUp");
        title1.style.bottom = "495px";

        title2.classList.add("animate__animated", "animate__slideInUp");
        title2.style.bottom = "345px";

        title3.classList.add("animate__animated", "animate__fadeInUp");
        title3.style.bottom = "195px";

        title2.classList.remove("blue-box");
        title2.classList.add("white-box");
      }, time);
    }

    title3.addEventListener("animationend", handleAnimationEnd3, {
      once: true,
    });

    function handleAnimationEnd3() {
      title1.classList.remove(
        "animate__animated",
        "animate__fadeInUp",
        "animate__slideInUp"
      );
      title2.classList.remove(
        "animate__animated",
        "animate__fadeInUp",
        "animate__slideInUp"
      );
      title3.classList.remove("animate__animated", "animate__fadeInUp");
      setTimeout(() => {
        title1.classList.add("animate__animated", "animate__slideInUp");
        title1.style.bottom = "737px";

        title2.classList.add("animate__animated", "animate__slideInUp");
        title2.style.bottom = "587px";

        title3.classList.add("animate__animated", "animate__slideInUp");
        title3.style.bottom = "447px";

        title4.classList.add("animate__animated", "animate__fadeInUp");
        title4.style.bottom = "195px";

        title3.classList.remove("blue-box");
        title3.classList.add("white-box");
      }, time);
    }

    title4.addEventListener("animationend", handleAnimationEnd4, {
      once: true,
    });

    function handleAnimationEnd4() {
      title1.classList.remove(
        "animate__animated",
        "animate__fadeInUp",
        "animate__slideInUp"
      );
      title2.classList.remove(
        "animate__animated",
        "animate__fadeInUp",
        "animate__slideInUp"
      );
      title3.classList.remove(
        "animate__animated",
        "animate__fadeInUp",
        "animate__slideInUp"
      );
      title4.classList.remove("animate__animated", "animate__fadeInUp");

      setTimeout(() => {
        title1.classList.add("animate__animated", "animate__slideInUp");
        title1.style.bottom = "860px";

        title2.classList.add("animate__animated", "animate__slideInUp");
        title2.style.bottom = "810px";

        title3.classList.add("animate__animated", "animate__slideInUp");
        title3.style.bottom = "670px";

        title4.classList.add("animate__animated", "animate__slideInUp");
        title4.style.bottom = "417px";

        title5.classList.add("animate__animated", "animate__fadeInUp");
        title5.style.bottom = "195px";

        title4.classList.remove("blue-box");
        title4.classList.add("white-box");
      }, time);
    }

    this.linked = await this.loadData();
    this.questGroup = await this.loadQuestGroup();
    console.log("THIS.QUESTGROUP", this.questGroup);
  },
  methods: {
    loadData() {
      return new Promise((resolve) => {
        this.$axios
          .get(`/api/linked/baby`, {
            params: {
              baby_nick_names: this.authUser,
            },
          })
          .then((res) => {
            resolve(res.data[0]);
          });
      });
    },
    loadQuestGroup() {
      return new Promise((resolve) => {
        this.$axios
          .get(`/api/selectQuestGroup/${this.linked.id}`)
          .then((res) => {
            resolve(res.data[0]);
          });
      });
    },
    onChallenge() {
      this.$axios
        .post(`/api/challengeQuest/${this.questGroup.id}`)
        .then((res) => {
          console.log("RES", res);
          this.$router.push({ path: "/baby/quest/confirm" });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.success-gift {
  background-size: cover !important;
  border-radius: 100%;
  width: rem(100px);
  height: rem(100px);
  margin: 0 auto;
}

.quest-start {
  position: relative;
  height: 102vh;
  width: 100%;

  .title {
    text-align: center;
    padding: rem(26px) rem(26px);
    font-size: rem(24px);
    font-weight: 500;
    bottom: 1000px;
    position: absolute;
    width: calc(100%);

    &.white-box {
      color: #000;
    }
  }
}

.btn-challege {
  background: white;
  color: $primary;
}

.baby-icon {
  position: fixed;
  bottom: 25px;
  width: 100%;
  left: 0;
}

.blue-box {
  color: #fff !important;

  .text-primary {
    color: #fff !important;
  }
}
</style>
