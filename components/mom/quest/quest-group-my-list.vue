<template>
    <div id="quest-group-my-list">
        <b-form-group>
              <b-form-checkbox-group
                v-model="selected"
                stacked
              >
                  <b-form-checkbox class="quest-group-my-list" :disabled="!option.value" :value="option.value" v-for="(option, i) in options">
                    <b-form-textarea maxlength="50" no-resize rows="3" class="input" v-model="option.value" />
                  </b-form-checkbox>
            </b-form-checkbox-group>
        </b-form-group>
        <div class="text-right">
          <!-- <b-button size="sm" variant="danger" class="btn-delete" @click="removeOption(option)">삭제</b-button> -->
            <b-button variant="white" class="btn-plus" @click="removeOption"><b-icon icon="dash"></b-icon>삭제
            </b-button>
            <b-button variant="white" class="btn-plus" @click="addOption"><b-icon icon="plus"></b-icon>추가
            </b-button>
        </div>
    </div>
</template>

<script>
  export default {
    props: {
        value: {

        }
    },
    data() {
      return {
        cnt:0,
        selected: [], // Must be an array reference!
        options: [
          { key:`key-0`, value: '' },
        ]
      }
    },
    watch: {
        selected () {
            this.$emit('input', this.selected)
        }
    },
    methods: {
        addOption () {
            this.cnt++
            this.options.push({key:`key-${this.cnt}`, value:''})
        },
        removeOption () {
            this.options.pop()
            this.$emit('input', this.selected)
        },
    }
  }
</script>

<style lang="scss">
@import "~@/assets/scss/common.scss";
#quest-group-my-list {
  .col-form-label {
    padding-bottom: 0;
  }

  .custom-checkbox {
    margin-bottom:rem(20px);
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
      color:#aaa;
    }
  }

  .custom-control-input {
    bottom:rem(-35px);
    width: 3rem;
  }

  %label {
    display: inline-block;
  }

  .custom-control-label::before, .custom-file-label {
    @extend %label;
    color:#aaaaaa;
  }

  .custom-control-input:checked ~ .custom-control-label {
    @extend %label;

    >span {
    color:#497ff5;
    }
  }

  %checkbox {
    font-size:rem(18px);
    height: rem(24px);
    line-height: rem(22px);
    text-align: center;
    font-size: rem(14px);
    border-radius: rem(24px);
  }

  .custom-control-label::before, .custom-file-label, .custom-select {
    @extend %checkbox;
    content:'선택';
    width:rem(44px);
    border:1px solid #dddddd;
  }

  .custom-control-input:checked ~ .custom-control-label::before {
    @extend %checkbox;
    content:'선택';
    color:#FFF;
    width:rem(44px);
    background: #497ff5;
  }

  .custom-control-label::before, #quest-group-my-list .custom-file-label, #quest-group-my-list .custom-select {
    top:rem(110px);
    right:0 !important;
  }

  .custom-control-input:checked ~ .custom-control-label::after {
    display: none;
  }

  .input {
    left: -1.5rem;
    position: relative;
    width: calc(100vw - 3rem) !important;
    border:1px solid #dddddd;
    border-radius: rem(3px);
    margin-top:rem(10px);
  }

  .custom-control-input:checked ~ .custom-control-label .input {
    border:1px solid #497ff5;
  }

  .btn-delete {
    margin-left:rem(24px);
    font-size:rem(18px);
    width: rem(44px);
    height: rem(22px);
    line-height: rem(8px);
    padding:0;
    top:2px;
    position: relative;
    text-align: center;
    font-size: rem(14px);
    border-radius: rem(24px);
  }

  .btn-plus {
    padding:0;
    margin-top:rem(-50px);
  }
}
</style>
