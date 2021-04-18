export default {
    computed: {

    },
    mounted () {

    },
    methods: {
      getWeekName (weekNum) {
        let weekName = ''
        switch (weekNum) {
          case 0:
            weekName = '일'
            break;
          case 1:
            weekName = '월'
            break;
          case 2:
            weekName = '화'
            break;
          case 3:
            weekName = '수'
            break;
          case 4:
            weekName = '목'
            break;
          case 5:
            weekName = '금'
            break;
          case 6:
            weekName = '토'
            break;
        }

        return weekName
      },
      goBack() {
        this.$router.go(-1);
      },
    }
}
