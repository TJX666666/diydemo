<template>
  <section id="phonePreview" class="pre-container" :style="{ 'padding-right': wrapPadRight + 'px' }">
    <section class="sortable-list">
      <draggable
        style="margin-bottom: 15px; min-height: 812px;"
        v-model="groupLists"
        v-bind="{
          disabled: isPreview,
          forceFallback: true,
          animation: 250,
          group: {
            name: 'component',
            pull: false,
            put: true
          },
          draggable: `.content-box`,
          handle: `.item-preview`,
          move: (e) => e.relatedContext.index !== 0
        }"
        @end="onEnd">
        <section :class="index ? 'content-box' : ''" v-for="(content, index) in groupLists" :key="`${index}`">
          <header-item
            :content="content"
            :index="index"
            :isActive="selectedIndex === index"
            @click.native="selectedIndex = index"
            @onUpdate="onUpdate"
            v-if="content && content.type === 'header'"
          />
          <text-item
            :content="content"
            :index="index"
            :isActive="selectedIndex === index"
            @click.native="selectedIndex = index"
            @onUpdate="onUpdate"
            @onDelete="onDelete"
            v-else-if="content && ['input', 'textarea', 'number'].includes(content.type)"
          />
          <select-item
            :content="content"
            :index="index"
            :isActive="selectedIndex === index"
            @click.native="selectedIndex = index"
            @onUpdate="onUpdate"
            @onDelete="onDelete"
            v-else-if="content && ['select', 'radio', 'checkbox'].includes(content.type)"
          />
          <date-time-item
            :content="content"
            :index="index"
            :isActive="selectedIndex === index"
            @click.native="selectedIndex = index"
            @onUpdate="onUpdate"
            @onDelete="onDelete"
            v-else-if="content && ['date', 'time'].includes(content.type)"
          />
          <upload-item
            :content="content"
            :index="index"
            :is-active="selectedIndex === index && !content.notDelete"
            @click.native="selectedIndex = index"
            @onUpdate="onUpdate"
            @onDelete="onDelete"
            v-else-if="content && ['upload_files', 'upload_image'].includes(content.type)"
          />
        </section>
      </draggable>
    </section>
  </section>
</template>

<script>
import draggable from 'vuedraggable'
import HeaderItem from './HeaderItem.vue'
import TextItem from './TextItem.vue'
import SelectItem from './SelectItem.vue'

import { deepClone } from '../formUtil'

export default {
  name: 'PhonePreview',
  components: {
    draggable,
    HeaderItem,
    TextItem,
    SelectItem,
  },
  props: {
    isPreview: {
      type: Boolean,
      default: false
    },
    componentList: {
      type: Array,
      default: () => {}
    },
    error: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      selectedIndex: 0,
      wrapPadRight: 375,
      groupLists: []
    }
  },
  watch: {
    componentList: {
      handler (newVal, oldVal) {
        this.groupLists = deepClone(newVal)
      },
      immediate: true,
      deep: true
    },
    // 使error与selectedIndex保持同步
    selectedIndex (newVal, oldVal) {
      this.$emit('update:error', newVal)
    },
    // 监听索引变化 切换到不同组件视图
    error (newVal, oldVal) {
      this.selectedIndex = newVal
    }
  },
  methods: {
    // 拖拽完成时重置为当前选中组件
    onEnd (e) {
      this.selectedIndex = e.newIndex
    },
    // 更新组件数据
    onUpdate (data, index) {
      this.groupLists[index] = deepClone(data)
      this.$emit('onUpdate', data, index)
    },
    // 删除组件
    onDelete (index) {
      this.$emit('onDelete', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.pre-container {
  float: left;
  position: relative;
  width: 375px;
  height: 812px;
  box-sizing: content-box;
  overflow-y: scroll;

  .sortable-list {
    background-color: rgb(255, 255, 255);
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
