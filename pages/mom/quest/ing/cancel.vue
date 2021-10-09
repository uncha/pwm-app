<template>
  <div>
    <top :hideBack="true">
    </top>
    <div class="">
      <h1>
        아낌없는 칭찬으로<br>
        동기부여를 시켜주세요!
      </h1>
      <p>
        <img
          class="img"
          src="/images/cancel-carrot.svg"
        />
      </p>
    </div>
    <div class="bottom-wrap">
      <b-button
        variant="primary"
        class="mt-4"
        @click="restartQuest"
      >새로 시작하기</b-button>
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
  computed: {
    authUser() {
      return this.$store.getters["authUser"];
    },
    selectLink() {
      return this.$store.getters["selectLink"];
    },
  },
  async fetch() {
    let selectGroup = await this.loadSelectGroup(this.selectLink);
    this.selectGroup = selectGroup[0];
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
      console.log("test");

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
.img {
  width: rem(370px);
  margin: 0 auto;
  display: block;
}
</style>