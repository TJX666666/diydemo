<template>
  <section class="sortable-item">
    <section class="item-preview" :class="{ active: isActive }">
      <div class="text-box mask">
        <a-form-model :model="editContent" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item :label="editContent.label" :required="editContent.required">
            <template v-if="editContent.type === 'textarea'">
              <a-textarea :placeholder="editContent.placeholder" :auto-size="{ minRows: 3, maxRows: 6 }" disabled/>
            </template>
            <template v-else-if="editContent.type === 'number'">
              <a-input-number :placeholder="editContent.placeholder" disabled/>
            </template>
            <template v-else>
              <a-input :placeholder="editContent.placeholder" disabled/>
            </template>
          </a-form-model-item>
        </a-form-model>
      </div>
<!--      <a-popconfirm title="确定删除？" ok-text="确定" cancel-text="取消" @confirm.stop="onConfirm">-->
<!--        <a-icon type="close-circle" theme="filled" v-show="isActive" @click.stop/>-->
<!--      </a-popconfirm>-->
    </section>
    <section class="item-config" v-if="isActive">
      <div class="design-editor-item-common editor-wrap">
        <a-form-model :model="editContent" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="标题" prop="label">
            <a-input v-model="editContent.label"
                     :placeholder="`请输入${editContent.type === 'input' ? '输入框' : editContent.type === 'textarea' ? '文本框' : editContent.type === 'number' ? '数字输入框' : ''}标题`"
                     :suffix="`${editContent.label.length}/8`" :maxLength="8"/>
          </a-form-model-item>
          <a-form-model-item labelAlign="left" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" label="是否为必填" prop="required">
            <a-switch v-model="editContent.required" size="small"/>
          </a-form-model-item>
          <a-form-model-item label="默认提示文字" prop="placeholder">
            <a-input v-model="editContent.placeholder" placeholder="请输入默认提示文字" :suffix="`${editContent.placeholder.length}/10`"
                     :maxLength="10"/>
          </a-form-model-item>
        </a-form-model>
      </div>
    </section>
  </section>
</template>

<script>
import { deepClone } from '../formUtil'

export default {
  name: 'TextItem',
  props: {
    content: {
      type: Object,
      default: () => {}
    },
    isActive: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      editContent: {
        label: '',
        required: false,
        placeholder: ''
      },
      rules: {
        label: [{ validator: this.validatorName, required: true, trigger: 'blur' }]
      }
    }
  },
  created(){
    console.log('传入的text子组件的sourceData:',this.content)
  },
  watch: {
    content: {
      handler (newVal, oldVal) {
        this.editContent = deepClone(newVal)
      },
      immediate: true,
      deep: true
    },
    editContent: {
      handler (newVal, oldVal) {
        this.$emit('onUpdate', newVal, this.index)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 删除组件
    onConfirm (e) {
      this.$emit('onDelete', this.index)
    },
    validatorName (rule, value, callback) {
      let msg = ''
      switch (this.editContent.type) {
        case 'input':
          msg = '请输入输入框标题'
          break
        case 'textarea':
          msg = '请输入文本框标题'
          break
        case 'number':
          msg = '请输入数字输入框标题'
          break
        default:
          msg = '请输入标题'
      }
      value === '' ? callback(new Error(msg)) : callback()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../common.scss";

.text-box {
  padding: 0 12px 10px;
  box-sizing: border-box;
}

.mask {
  position: relative;

  &:after {
    width: 100%;
    height: 100%;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    background: rgba(255, 255, 255, 0.1);
  }
}

</style>
