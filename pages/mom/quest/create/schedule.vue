<template>
  <div>
    <top></top>
    <b-form @submit.stop.prevent="onSubmit">
      <p class="title text-center">
          지금부터,
      </p>
      <b-form-group class="text-center select-schedule-type">
        <b-form-radio-group buttons v-model="form.selectScheduleType">
           <b-form-radio value="day">매일</b-form-radio>
           <b-form-radio value="week">요일</b-form-radio>
        </b-form-radio-group>
      </b-form-group>

      <template v-if="form.selectScheduleType == 'week'">
          <div class="select-week-wrap">
            <b-form-radio-group class="select-week" buttons v-model="form.selectWeek">
                <b-form-radio value="1">월</b-form-radio>
                <b-form-radio value="2">화</b-form-radio>
                <b-form-radio value="3">수</b-form-radio>
                <b-form-radio value="4">목</b-form-radio>
                <b-form-radio value="5">금</b-form-radio>
                <b-form-radio value="6">토</b-form-radio>
                <b-form-radio value="0">일</b-form-radio>
            </b-form-radio-group>
          </div>
      </template>

      <div class="text-center">
        <b-form-select v-model="form.selectDay" class="select-day">
            <b-form-select-option value="0">오전 0시 마다</b-form-select-option>
            <b-form-select-option value="1">오전 1시 마다</b-form-select-option>
            <b-form-select-option value="2">오전 2시 마다</b-form-select-option>
            <b-form-select-option value="3">오전 3시 마다</b-form-select-option>
            <b-form-select-option value="4">오전 4시 마다</b-form-select-option>
            <b-form-select-option value="5">오전 5시 마다</b-form-select-option>
            <b-form-select-option value="6">오전 6시 마다</b-form-select-option>
            <b-form-select-option value="7">오전 7시 마다</b-form-select-option>
            <b-form-select-option value="8">오전 8시 마다</b-form-select-option>
            <b-form-select-option value="9">오전 9시 마다</b-form-select-option>
            <b-form-select-option value="10">오전 10시 마다</b-form-select-option>
            <b-form-select-option value="11">오전 11시 마다</b-form-select-option>
            <b-form-select-option value="12">오전 12시 마다</b-form-select-option>
            <b-form-select-option value="13">오후 1시 마다</b-form-select-option>
            <b-form-select-option value="14">오후 2시 마다</b-form-select-option>
            <b-form-select-option value="15">오후 3시 마다</b-form-select-option>
            <b-form-select-option value="16">오후 4시 마다</b-form-select-option>
            <b-form-select-option value="17">오후 5시 마다</b-form-select-option>
            <b-form-select-option value="18">오후 6시 마다</b-form-select-option>
            <b-form-select-option value="19">오후 7시 마다</b-form-select-option>
            <b-form-select-option value="20">오후 8시 마다</b-form-select-option>
            <b-form-select-option value="21">오후 9시 마다</b-form-select-option>
            <b-form-select-option value="22">오후 10시 마다</b-form-select-option>
            <b-form-select-option value="23">오후 11시 마다</b-form-select-option>
            <b-form-select-option value="24">오후 12시 마다</b-form-select-option>
        </b-form-select>
      </div>

      <div class="text-center">
          <p class="description">
              랜덤으로 퀘스트가 주어집니다.
          </p>
      </div>

      <b-button type="submit" variant="primary" class="btn-submit">퀘스트 생성하기
      </b-button>
    </b-form>
  </div>
</template>

<script type="text/javascript">
    import LoginCheck from '@/mixins/loginCheck.js';
    import Top from '@/components/top';
    export default {
        mixins: [LoginCheck],
        data () {
            return {
                form: {
                  selectScheduleType:'day',
                  selectDay:10,
                  selectWeek:'월',
                }
            }
        },
        components: {
            'top': Top,
        },
        computed: {
          questList () {
            return this.$store.getters['questList']
          },
          successCount () {
            return this.$store.getters['successCount']
          },
          gift () {
            return this.$store.getters['gift']
          },
          selectLink () {
            return this.$store.getters['selectLink']
          },
        },
        methods: {
          onSubmit () {
            let form = {
              linked_id:this.selectLink.id,
              success_count:this.successCount,
              success_gift:this.gift,
              date_type:this.form.selectScheduleType,
              event_time:this.form.selectDay,
              event_week:this.form.selectWeek,
              start_date:moment().format('YYYY-MM-DD'),
            }

            this.$axios.post('/api/selectQuestGroup', form).then(res=>{
              let promises = []
              let startDate = moment()
              let eventDate

              if(this.form.selectScheduleType == 'week') {
                eventDate = startDate.day(this.form.selectWeek).hour(this.form.selectDay).minutes(0).seconds(0)
              }

              _.shuffle(this.questList)
              _.forEach(this.questList, (title, i) => {
                promises.push(new Promise(resolve=>{
                  if(this.form.selectScheduleType == 'day') {
                    eventDate = startDate.add('day', 1).hour(this.form.selectDay).minutes(0).seconds(0)
                  } else {
                    if(i > 0) eventDate = eventDate.add('day', 7)
                  }

                  this.$axios.post('/api/selectQuest', {
                    title:title,
                    group_id:res.data.insertId,
                    start_date:eventDate.format('YYYY-MM-DD HH:mm:ss'),
                  }).then(res=>{
                    resolve(res)
                  })
                }))
              });

              Promise.all(promises).then(resAll=>{
                this.$router.push({path:'/mom/quest/ing'})
              })
            })
          },
        },
    }
</script>

<style lang="scss" scoped>
    @import "~@/assets/scss/common.scss";

    .title {
      font-size:rem(24px);
      line-height: rem(30px);
      margin-top:rem(80px);
    }

    .select-day {
      border:0;
      border-bottom: 2px solid #000;
      border-radius: 0;
      color:#1ec89b;
      width: rem(180px);

      > option {
        width: rem(180px);
      }
    }

    .select-schedule-type {
      margin-top:rem(40px);
      margin-bottom: rem(60px);

      .btn-group-toggle {
        .btn {
          border-radius: 100%;
          width:rem(64px);
          height:rem(64px);
          line-height:rem(57px);
          padding:0;
          margin:0 rem(26px);
          background: #FFF;
          border:2px solid #497ff5;
          color:#497ff5;
          font-size: rem(14px);

          &.active {
            background: #497ff5;
            color:#FFF;
          }
        }
      }
    }

    .description {
      font-size: rem(18px);
      margin-top: 20px;
    }

    .select-week-wrap {
      width: 100%;
      overflow-x: auto;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
      }

      .select-week {
        margin-bottom: rem(30px);

        .btn {
          border-radius: 100% !important;
          width:rem(48px);
          height: rem(48px);
          line-height: rem(44px);
          padding:0;
          margin-right: rem(10px);
          background: #FFF;
          border:1px solid #1ec89b;
          color:#1ec89b;

          &.active {
            background: #1ec89b;
            color:#FFF;
          }

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    .btn-submit {
      position: fixed;
      bottom:rem(40px);
      width: calc(100% - 3rem);
      z-index: 3;
    }
</style>
