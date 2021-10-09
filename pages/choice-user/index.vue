<template>
  <div class="login">
    <h1 class="title">
      안녕하세요.<br />
      당신은 누구십니까?
    </h1>

    <div class="text-center">
      <b-button
        type=""
        class="w-100 btn-icon"
        variant="white"
        @click.prevent="$router.push({path:'/mom/create-nickname'})"
      >
        <b-row>
          <b-col class="text-left">
            <img src="/images/icon-mom-face.svg" />
          </b-col>
          <b-col class="text-right">
            <span>엄마</span>
          </b-col>
        </b-row>
      </b-button>
      <b-button
        type=""
        class="w-100 mt-2 btn-icon"
        variant="white"
        @click.prevent="$router.push({path:'/baby/create-nickname'})"
      >
        <b-row>
          <b-col class="text-left">
            <img
              class="mt-1"
              src="/images/icon-baby-face.svg"
            />
          </b-col>
          <b-col class="text-right">
            <span>자녀</span>
          </b-col>
        </b-row>
      </b-button>
      <!-- <b-button @click="$router.push({path:'/mom/create-nickname'})">
            </b-button> -->
      <!-- <a class="mom-group" href="#" @click.prevent="$router.push({path:'/mom/create-nickname'})">
                <p class="mom"><img src="/images/icon_mom.png" /></p>
                <p class="tit">
                    엄마
                </p>
            </a>
            <a class="baby-group" href="#" @click.prevent="$router.push({path:'/baby/create-nickname'})">
                <p class="baby"><img src="/images/icon_baby.png" /></p>
                <p class="tit">
                    자녀
                </p>
            </a> -->
    </div>
  </div>
</template> 

<script type="text/javascript">
import Top from "@/components/top";

export default {
  components: {
    top: Top,
  },
  computed: {
    socialId() {
      return this.$store.getters["socialId"];
    },
  },
  mounted() {
    if (!this.socialId) {
      this.$router.push({ path: "/" });
    }
  },
};
</script>

<style lang="scss" scoped>
.btn-icon {
  height: 80px;
}
</style>
