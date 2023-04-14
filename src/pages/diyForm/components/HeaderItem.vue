<template>
  <section class="sortable-item sortable-item-head">
    <div class="item-preview" :class="{ active: isActive }">
      <div class="phone-header">
        <div class="title">{{ editContent.label }}</div>
      </div>
    </div>
    <section class="item-config" v-show="isActive">
      <div class="design-editor-item-common editor-wrap">
        <a-form-model ref="Form" :model="editContent" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="表单名称" prop="label">
            <a-input v-model="editContent.label" placeholder="请输入表单名称" :suffix="`${editContent.label.length}/8`" :maxLength="8"/>
          </a-form-model-item>
        </a-form-model>
      </div>
    </section>
  </section>
</template>

<script>
import { deepClone } from '../formUtil.js'

export default {
  name: 'HeaderItem',
  props: {
    content: {
      type: Object,
      default: () => {}
    },
    isActive: {
      type: Boolean,
      default: true
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      editContent: {
        label: ''
      },
      rules: {
        label: [{ required: true, message: '请输入表单名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    // 初始化
    content: {
      handler (newVal, oldVal) {
        this.editContent = deepClone(newVal)
      },
      immediate: true,
      deep: true
    },
    // 编辑组件数据
    editContent: {
      handler (newVal, oldVal) {
        this.$emit('onUpdate', newVal, this.index)
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../common.scss';

.phone-header {
  width: 373px;
  height: 65px;
  padding-top: 30px;
  background: red;
  background-size: contain;

  .title {
    padding: 0 50px 0 40px;
    width: 100%;
    height: 28px;
    font-size: 18px;
    color: #353535;
    line-height: 28px;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-weight: bold;
  }
}
</style>
