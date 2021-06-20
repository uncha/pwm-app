<template>
  <div>
    <side-bar :links="links"></side-bar>
    <template v-if="isIng===false">
      <h1>
        퀘스트를<br />
        만들어보세요!
      </h1>

      <linked-babies
        :links="links"
        @selectLink="onSelectLink"
      >
      </linked-babies>

      <div class="bottom-wrap">
        <template v-if="!selectLink || selectLink.status == 0">

          <b-button
            variant="light"
            class="btn-create-quest"
          >
            <span class="create-text">
              퀘스트
              만들기
              <!-- <b-icon
                class="ing-icon"
                icon="chevron-right"
                font-scale="1"
              ></b-icon> -->
            </span>
          </b-button>
        </template>
        <template v-else>
          <p class="ing text-center active">
            <img src="/images/illust.png" />
          </p>

          <b-button
            variant="primary"
            @click.prevent="$router.push({path:'/mom/quest/create/select-quest'})"
          >
            퀘스트
            만들기
          </b-button>
        </template>
      </div>
    </template>
    <template v-else>
      <quest-status></quest-status>
    </template>
  </div>
</template>

<script type="text/javascript">
import LoginCheck from "@/mixins/loginCheck.js";
import LinkedBabies from "@/components/mom/quest/linked-babies";
import SideBar from "@/components/mom/side-bar";
import QuestStatus from "@/components/mom/quest/quest-status";

export default {
  mixins: [LoginCheck],
  components: {
    "linked-babies": LinkedBabies,
    "side-bar": SideBar,
    "quest-status": QuestStatus,
  },
  data() {
    return {
      links: [],
      selectLink: "",
      isIng: false,
      intervalId: "",
      selectGroup: "",
    };
  },
  async fetch() {
    await this.$axios
      .get(`/api/linked/mom`, {
        params: {
          mom_nick_name: this.authUser,
        },
      })
      .then((res) => {
        this.links = res.data;
      });
  },
  computed: {
    authUser() {
      return this.$store.getters["authUser"];
    },
  },
  mounted() {
    this.intervalId = window.setInterval(() => {
      this.$fetch();
    }, 1000 * 5);
  },
  methods: {
    async onSelectLink(link) {
      this.selectGroup = await this.loadSelectGroup(link);
      if (this.selectGroup.length > 0) {
        this.isIng = true;
      } else {
        this.isIng = false;
      }

      this.selectLink = link;
      this.$store.commit("setSelectLink", link);
    },
    loadSelectGroup(link) {
      return new Promise((resolve) => {
        this.$axios.get(`/api/selectQuestGroup/${link.id}`).then((res) => {
          resolve(res.data);
        });
      });
    },
    goConfirm() {
      if (this.selectGroup[0].complete_state == "1") {
        this.$router.push({ path: "/mom/quest/ing/complete" });
      } else {
        this.$router.push({ path: "/mom/quest/ing" });
      }
    },
  },
  destroyed() {
    window.clearInterval(this.intervalId);
  },
};
</script>

<style lang="scss" scoped>
</style>
