<template>
  <div id="select-quest">
    <top
      :message="'퀘스트를 선택해 주세요.'"
      :whiteBg="true"
    ></top>

    <div class="quest-list-wrap">
      <p class="quest-type-label">스킨십 <span class="cnt">{{skinshipSelected.length}}</span></p>
      <quest-group-list
        v-model="skinshipSelected"
        class="mt-4"
      >
      </quest-group-list>
      <div class="divine mt-6"></div>
      <p class="quest-type-label">습관 <span class="cnt">{{habitSelected.length}}</span></p>
      <quest-group-list
        v-model="habitSelected"
        class="mt-4"
      >
      </quest-group-list>
      <div class="divine mt-6"></div>
      <p class="quest-type-label">직접입력 <span class="cnt">{{customSelected.length}}</span></p>
      <quest-group-my-list
        v-model="customSelected"
        class="mt-4"
      >
      </quest-group-my-list>

      <template v-if="totalSelectCount == 0">
        <b-button
          class="btn-select"
          variant="light"
        >
          {{totalSelectCount}}
          개의 퀘스트 선택
        </b-button>
      </template>
      <template v-else>
        <b-button
          class="btn-select"
          variant="primary"
          @click="onSelectComplete"
        >
          {{totalSelectCount}}
          개의 퀘스트 선택
        </b-button>
      </template>
    </div>
  </div>
</template>

<script type="text/javascript">
import QuestGroupList from "@/components/mom/quest/quest-group-list";
import QuestGroupMyList from "@/components/mom/quest/quest-group-my-list";
import Top from "@/components/top";
import LoginCheck from "@/mixins/loginCheck.js";

export default {
  mixins: [LoginCheck],
  data() {
    return {
      skinshipSelected: [],
      habitSelected: [],
      customSelected: [],
    };
  },
  components: {
    "quest-group-list": QuestGroupList,
    "quest-group-my-list": QuestGroupMyList,
    top: Top,
  },
  computed: {
    totalSelectCount() {
      let cnt = 0;

      cnt += this.skinshipSelected.length;
      cnt += this.habitSelected.length;
      cnt += this.customSelected.length;

      return cnt;
    },
  },
  methods: {
    onSelectComplete() {
      this.$store.commit("setQuestList", [
        ...this.skinshipSelected,
        ...this.habitSelected,
        ...this.customSelected,
      ]);

      this.$router.push({ path: "/mom/quest/create/select-success-count" });
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  margin-top: rem(77px);
}

.btn-select {
  margin-bottom: rem(54px);
  margin-top: rem(54px);
}

.quest-list-wrap {
  margin-top: rem(10px);

  .quest-type-label {
    font-size: rem(26px);
    line-height: rem(26px);
    margin-top: rem(36px);

    &:first-child {
      margin-top: 0;
    }

    .cnt {
      width: rem(24px);
      height: rem(24px);
      border-radius: 100%;
      background: #497ff5;
      color: #fff;
      font-size: rem(14px);
      display: inline-block;
      text-align: center;
      line-height: rem(24px);
      position: relative;
      bottom: rem(6px);
    }
  }
}
</style>

<style lang="scss">
#select-quest {
  .tab-content {
    display: block;
    height: calc(100vh - 16rem);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .nav {
    .nav-item {
      width: 25%;

      a {
        text-align: center;
        color: #aaa;

        &.active {
          color: #000;
          background: none;
          border-bottom: 2px solid #000;
          border-radius: 0;
        }
      }
    }
  }
}
</style>
