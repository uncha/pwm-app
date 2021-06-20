<template>
  <div id="quest-group-list">
    <b-form-group>
      <!-- <template #label>
              <b-form-checkbox
                v-model="allSelected"
                @change="toggleAll"
              >
                <span>{{ allSelected ? '전체 선택 해제' : '전체 선택' }}</span>
              </b-form-checkbox>
            </template> -->

      <template v-slot="{ ariaDescribedby }">
        <b-form-checkbox-group
          v-model="selected"
          :options="flavours"
          aria-label="Individual flavours"
          stacked
        ></b-form-checkbox-group>
      </template>

      <div>
        Selected: <strong>{{ selected }}</strong><br>
        All Selected: <strong>{{ allSelected }}</strong><br>
        Indeterminate: <strong>{{ indeterminate }}</strong>
      </div>
    </b-form-group>
  </div>
</template>

<script>
export default {
  props: ["value"],
  data() {
    return {
      flavours: [
        "엄마를 뒤에서 안아주세요.",
        "엄마의 손을 잡아주세요.",
        "엄마의 볼에 뽀뽀해주세요.",
        "엄마의 어깨를 주물러주세요.",
        "엄마의 등을 쓰담쓰담 해주세요.",
      ],
      selected: [],
      allSelected: false,
      indeterminate: false,
    };
  },
  methods: {
    toggleAll(checked) {
      this.selected = checked ? this.flavours.slice() : [];
    },
  },
  watch: {
    selected(newValue, oldValue) {
      // Handle changes in individual flavour checkboxes
      if (newValue.length === 0) {
        this.indeterminate = false;
        this.allSelected = false;
      } else if (newValue.length === this.flavours.length) {
        this.indeterminate = false;
        this.allSelected = true;
      } else {
        this.indeterminate = true;
        this.allSelected = false;
      }

      this.$emit("input", this.selected);
    },
  },
};
</script>

<style lang="scss">
#quest-group-list {
  .col-form-label {
    padding-bottom: 0;
  }

  .custom-checkbox {
    margin-bottom: rem(20px);
  }

  .custom-control-label {
    > span {
      margin-left: rem(15px);
      top: rem(3px);
      position: relative;
      color: #aaa;
    }
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
    border-radius: rem(7px);
  }

  .custom-control-label::before,
  .custom-file-label,
  .custom-select {
    @extend %checkbox;
    width: rem(25px);
    border: 1px solid $primary;
  }

  .custom-control-input:checked ~ .custom-control-label::before {
    @extend %checkbox;
    content: url("/images/icon-check.svg");
    color: #fff;
    width: rem(25px);
    background: $primary;
  }

  .custom-control-input:checked ~ .custom-control-label::after {
    display: none;
  }
}
</style>
