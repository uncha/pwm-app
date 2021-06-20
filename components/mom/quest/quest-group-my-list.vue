<template>
  <div id="quest-group-my-list">
    <b-input v-model="newLabel"></b-input>
    <div class="text-right">
      <b-button
        class="btn-plus"
        variant="primary"
        @click="addOption"
      >
        추가
      </b-button>
      <b-button
        class="btn-cancel"
        variant="light"
        @click="newLabel=''"
      >
        취소
      </b-button>
    </div>
    <ul>
      <li
        v-for="(label, i) in selected"
        class="my-list"
      >
        <a
          href="#"
          class="mr-1"
          @click.prevent="removeOption(i)"
        ><img src="/images/btn-minus.svg" /></a>
        {{label}}
      </li>
    </ul>
    <div class="text-right">
      <!-- <b-button size="sm" variant="danger" class="btn-delete" @click="removeOption(option)">삭제</b-button> -->

    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {},
  },
  data() {
    return {
      newLabel: "",
      selected: [], // Must be an array reference!
    };
  },
  methods: {
    addOption() {
      if (this.newLabel == "") return;
      this.selected.push(this.newLabel);
      this.$emit("input", this.selected);
      this.newLabel = "";
    },
    removeOption(labelIndex) {
      this.selected.splice(labelIndex, 1);
      this.$emit("input", this.selected);
      this.newLabel = "";
    },
  },
};
</script>

<style lang="scss">
#quest-group-my-list {
  .col-form-label {
    padding-bottom: 0;
  }

  .custom-checkbox {
    margin-bottom: rem(20px);
  }

  .quest-group-my-list {
    margin-top: rem(45px);

    &:first-child {
      margin-top: 0;
    }
  }

  .custom-control-label {
    > span {
      margin-left: rem(30px);
      top: rem(3px);
      position: relative;
      color: #aaa;
    }
  }

  .custom-control-input {
    bottom: rem(-35px);
    width: 3rem;
  }

  %label {
    display: inline-block;
  }

  .custom-control-label::before,
  .custom-file-label {
    @extend %label;
    color: #aaaaaa;
  }

  .custom-control-input:checked ~ .custom-control-label {
    @extend %label;

    > span {
      color: #497ff5;
    }
  }

  %checkbox {
    font-size: rem(18px);
    height: rem(24px);
    line-height: rem(22px);
    text-align: center;
    font-size: rem(14px);
    border-radius: rem(24px);
  }

  .custom-control-label::before,
  .custom-file-label,
  .custom-select {
    @extend %checkbox;
    content: "선택";
    width: rem(44px);
    border: 1px solid #dddddd;
  }

  .custom-control-input:checked ~ .custom-control-label::before {
    @extend %checkbox;
    content: "선택";
    color: #fff;
    width: rem(44px);
    background: #497ff5;
  }

  .custom-control-label::before,
  #quest-group-my-list .custom-file-label,
  #quest-group-my-list .custom-select {
    top: rem(110px);
    right: 0 !important;
  }

  .custom-control-input:checked ~ .custom-control-label::after {
    display: none;
  }

  .input {
    left: -1.5rem;
    position: relative;
    width: calc(100vw - 3rem) !important;
    border: 1px solid #dddddd;
    border-radius: rem(3px);
    margin-top: rem(10px);
  }

  .custom-control-input:checked ~ .custom-control-label .input {
    border: 1px solid #497ff5;
  }

  .btn-delete {
    margin-left: rem(24px);
    font-size: rem(18px);
    width: rem(44px);
    height: rem(22px);
    line-height: rem(8px);
    padding: 0;
    top: 2px;
    position: relative;
    text-align: center;
    font-size: rem(14px);
    border-radius: rem(24px);
  }

  %btn {
    padding: 0;
    width: rem(54px);
    border-radius: rem(12px) !important;
    font-size: rem(14px);
    padding: rem(10px) rem(10px);
    line-height: rem(36px);
    margin-top: rem(15px);
  }

  .btn-cancel {
    @extend %btn;
    padding: 0;
    width: rem(54px);
  }

  .btn-plus {
    @extend %btn;
    padding: 0;
    width: rem(54px);
  }

  .my-list {
    margin-top: rem(24px);
  }
}
</style>
