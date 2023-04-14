<template>
  <section class="config-wrap">
    <div class="config-content">
      <template v-for="(component, index) in componnetList">
        <div class="title-part">
          <div class="text">{{ component.groupTitle }}</div>
        </div>
        <div class="component-list clearfix">
          <draggable
            v-model="component.lists"
            v-bind="{
              forceFallback: true,
              animation: 250,
              sort: false,
              group: {
                name: 'component',
                pull: 'clone',
                put: false
              },
              draggable: `.component-item`,
              handle: `.component-item`
          }">
            <div class="component-item flex flex-center" v-for="(item, idx) in component.lists" :key="idx"
                 @click="handleSelectCompnent(item)">
              <span>{{ item.label }}</span>
            </div>
          </draggable>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
import draggable from 'vuedraggable'
import _DATA from '../data/componentData.json'

export default {
  name: 'ConfigWrap',
  components: {
    draggable,
  },
  data () {
    return {
      componnetList: _DATA.componnetList
    }
  },
  methods: {
    handleSelectCompnent (data) {
      console.log('传递数据到mid组件。。。')
      this.$emit('onSelectComponent', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.config-wrap {
  margin-right: 20px;
  position: relative;
  float: left;
  width: 270px;
  height: 812px;
  font-size: 14px;
  color: #333;
  border: 1px solid #e5e5e5;
  border-radius: 2px;
  background-color: #f9f9f9;

  .config-header {
    width: 236px;
    height: 81px;
    margin: 0 auto;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #EBEBEB;

    .config-header-item {
      width: 88px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      border: 1px solid #ccc;
      color: #333;
      cursor: pointer;
      background-color: #fff;
    }

    .active {
      border-right: 1px solid #1472FF;
      border-color: #1472FF;
      color: #1472FF;
    }
  }

  .config-content {
    padding-top: 24px;

    .title-part {
      margin: 24px 0 16px;
      padding: 0 16px;

      &:first-child {
        margin-top: 0;
      }

      .text {
        height: 20px;
        line-height: 20px;
        font-weight: 700;
      }
    }

    .component-list {
      padding: 0 0 0 16px;

      .component-item {
        float: left;
        padding-left: 14px;
        margin: 0 8px 8px 0;
        justify-content: flex-start;
        width: 115px;
        height: 36px;
        background: #fff;
        border: 1px dashed #eee;

        &:hover {
          background: rgba(42, 117, 237, 0.1);
          border: 1px dashed #89b4fa;
          color: #1472FF;
          cursor: pointer;
        }

        i {
          width: 16px;
          height: 16px;
          float: left;
          font-size: unset;
          font-family: "font_family" !important;
        }

        span {
          float: left;
          margin-left: 6px;
          user-select: none;
        }
      }
    }
  }
}
</style>
