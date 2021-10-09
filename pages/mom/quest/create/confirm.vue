<template>
  <div>
    <top></top>
    <div class="confirm-wrap">
      <h1 class="mb-4">
        지금부터, <br />
        매일 퀘스트가 주어집니다.
      </h1>
      <div class="desc">
        하나의 퀘스트가 종료되면 <br />
        다음 퀘스트가 랜덤으로 <br />
        발송되며 진행됩니다.
      </div>
      <div class="text-center mt-5 pt-4">
        <img src="/images/mission-desc.svg" />
      </div>
      <div class="bottom-wrap">
        <b-button
          class="btn-confirm"
          variant="primary"
          @click="onSubmit"
        >
          퀘스트 시작하기
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {};
  },
  computed: {
    questList() {
      return this.$store.getters["questList"];
    },
    successCount() {
      return this.$store.getters["successCount"];
    },
    gift() {
      return this.$store.getters["gift"];
    },
    selectLink() {
      return this.$store.getters["selectLink"];
    },
  },
  methods: {
    onSubmit() {
      let form = {
        linked_id: this.selectLink.id,
        success_count: this.successCount,
        success_gift: this.gift,
        date_type: "day",
        event_time: 0,
        event_week: 0,
        start_date: moment().format("YYYY-MM-DD"),
      };

      this.$axios.post("/api/selectQuestGroup", form).then((res) => {
        let promises = [];
        let startDate = moment();
        let eventDate;

        _.shuffle(this.questList);

        _.forEach(this.questList, (title, i) => {
          promises.push(
            new Promise((resolve) => {
              eventDate = startDate.add("day", 1).hour(0).minutes(0).seconds(0);

              this.$axios
                .post("/api/selectQuest", {
                  title: title,
                  group_id: res.data.insertId,
                  start_date: eventDate.format("YYYY-MM-DD HH:mm:ss"),
                })
                .then((res) => {
                  resolve(res);
                });
            })
          );
        });

        Promise.all(promises).then((resAll) => {
          this.$axios
            .post("/api/executionQuest", {
              title: this.questList[0],
              group_id: res.data.insertId,
              execution_date: moment()
                .hour(0)
                .minutes(0)
                .seconds(0)
                .format("YYYY-MM-DD HH:mm:ss"),
            })
            .then((res) => {
              this.$router.push({ path: "/mom/quest/create/start" });
            });
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.desc {
  color: $primary;
}
</style>
