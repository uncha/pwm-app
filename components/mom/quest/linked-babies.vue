<template>
  <div id="linked">
    <div
      class="linked-babies text-center"
      v-if="links.length > 0"
    >
      <b-button
        class="btn-link d-block w-100"
        v-for="(link, i) in list"
        @click="onSelect(link)"
        :class="{
          'on':link.id == selectLink.id,
          'bg-white':link.status==0,
          'bg0':link.status==1 && i==0,
          'bg1':link.status==1 && i==1,
        }"
      >

        <div class="face float-left">
          <div :style="{'background':`url(${getProfileImageURL(link.profile_image)})`}">
          </div>
        </div>

        <div class="float-left">
          <template v-if="link.status == 0">
            <p class="mb-0 text-left nick-name">{{link.baby_nick_names}}</p>
            <p class="mb-0 status">연결중...</p>
          </template>
          <template v-else>
            <p class="mb-0 text-left nick-name">{{link.baby_nick_names}}</p>
            <p class="mb-0 status">연결되었습니다.</p>
          </template>
        </div>
      </b-button>
    </div>
    <div
      class="linked-babies not-linked text-center"
      v-else
    >
      <b-button
        class="btn-link"
        variant="white"
        @click="$router.push({path:'/mom/search-baby'})"
      >
        <img
          src="/images/group_34.png"
          class="face2"
        /> 자녀를 연결해 주세요.
      </b-button>
      <p class="exclamation">
        <img src="/images/icon_warning.png" />
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    links: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      nickName: "",
      selectLink: "",
    };
  },
  computed: {
    list() {
      return this.links.slice(0, 2);
    },
  },
  watch: {
    links() {
      this.nickName = this.list[0].baby_nick_name;

      this.$emit("selectLink", this.list[0]);
      this.selectLink = this.list[0];

      _.forEach(this.list, async (item, i) => {
        let baby = await this.loadBaby(item);
        this.$set(item, "profile_image", baby[0].profile_image);
      });
    },
  },
  mounted() {},
  methods: {
    onSelect(link) {
      this.$emit("selectLink", link);
      this.selectLink = link;
    },
    loadBaby(baby) {
      return new Promise((resolve) => {
        this.$axios.get(`/api/user/${baby.baby_nick_names}`).then((res) => {
          resolve(res.data);
        });
      });
    },
    getProfileImageURL(url) {
      if (window.location.host == "localhost:3000") {
        return `http://localhost:9102${url}`;
      } else {
        return url;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#linked {
  // width:calc(100% - 3rem);
  // position: fixed;
  // bottom:rem(60px);
}

.nick-name {
  font-size: rem(16px);
}

.linked-babies {
  .btn-link {
    border: 0;
    border-radius: rem(100px);
    padding: rem(2px) rem(15px) rem(2px) rem(2px);
    font-size: rem(14px);
    color: #000;
    text-decoration: none;
    margin-right: rem(12px);
    position: relative;
    margin-bottom: rem(30px);

    &.bg0 {
      background: #fff;
    }

    &.bg1 {
      background: #fff;
    }

    &.on:after {
      content: url("/images/icon-link-checked.svg");
      float: right;
      top: rem(10px);
      position: relative;
    }
  }

  &.not-linked {
    .exclamation {
      position: relative;
      top: -50px;
      right: -75px;

      img {
        width: rem(24px);
      }
    }
  }
}

.face {
  width: rem(44px);
  height: rem(44px);
  margin-right: rem(6px);

  > div {
    background-size: cover !important;
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
}

.face2 {
  width: rem(36px);
  height: rem(32px);
  margin-right: rem(6px);
}

.status {
  color: $primary;
  font-size: 14px;
}
</style>
