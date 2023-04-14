<template>
  <section class="sortable-item">
    <section class="item-preview" :class="{ active: isActive }">
      <div class="text-box mask">
        <a-form-model :model="editContent" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item :label="editContent.label" :required="editContent.required">
            <template v-if="editContent.type === 'select'">
              <a-input :placeholder="editContent.placeholder" disabled>
                <a-tooltip slot="suffix">
                  <a-icon type="up" style="color: rgba(0,0,0,.45)"/>
                </a-tooltip>
              </a-input>
              <a-input class="option-item" :value="item.label" placeholder="请输入选项内容" disabled v-for="(item, index) in editContent.options"
                       :key="index"/>
            </template>
            <template v-else-if="editContent.type === 'checkbox'">
              <a-checkbox-group :options="editContent.options"/>
            </template>
            <template v-else-if="editContent.type === 'radio'">
              <a-radio-group :options="editContent.options"/>
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
                     :placeholder="`请输入${editContent.type === 'select' ? '选择框' : editContent.type === 'checkbox' ? '多选框' : editContent.type === 'radio' ? '单选框' : ''}标题`"
                     :suffix="`${editContent.label.length}/8`" :maxLength="8"/>
          </a-form-model-item>
          <a-form-model-item labelAlign="left" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" label="是否为必填" prop="required">
            <a-switch v-model="editContent.required" size="small"/>
          </a-form-model-item>
          <a-form-model-item label="默认提示文字" prop="placeholder">
            <a-input v-model="editContent.placeholder" placeholder="请输入默认提示文字" :suffix="`${editContent.placeholder.length}/10`"
                     :maxLength="10"/>
          </a-form-model-item>
<!--          <a-form-model-item label="选项内容">-->
<!--            <draggable-->
<!--              v-model="editContent.options"-->
<!--              v-bind="{-->
<!--                forceFallback: true,-->
<!--                animation: 250,-->
<!--                draggable: `.input-item`,-->
<!--                handle: `.ant-input-group-addon`-->
<!--              }">-->
<!--              <section class="input-item" v-for="(item, index) in editContent.options" :key="index">-->
<!--                <a-input v-model="item.label" placeholder="提示：选项内容不能重复" :maxLength="50" @blur="handleBlur(item, index)">-->
<!--                  <a-tooltip slot="suffix" title="删除选项" v-if="editContent.options.length > 2">-->
<!--                    <a-icon type="minus-circle" style="color: red" @click="editContent.options.splice(index, 1)"/>-->
<!--                  </a-tooltip>-->
<!--                  <a-tooltip slot="addonAfter" title="拖动排序" placement="right">-->
<!--                    <a-icon type="ordered-list" style="cursor: move;"/>-->
<!--                  </a-tooltip>-->
<!--                </a-input>-->
<!--              </section>-->
<!--            </draggable>-->
<!--          </a-form-model-item>-->
          <a-button class="add-btn" type="primary" @click="handleAddOption">+ 添加选项</a-button>
        </a-form-model>
      </div>
    </section>
  </section>
</template>

<script>
import draggable from 'vuedraggable'

import { deepClone } from '../formUtil.js'

export default {
  name: 'SelectItem',
  components: {
    draggable
  },
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
        placeholder: '',
        options: []
      },
      rules: {
        label: [{ validator: this.validatorName, required: true, trigger: 'blur' }]
      }
    }
  },
  watch: {
    content: {
      handler (newVal, oldVal) {
        this.editContent = deepClone(newVal)
        // 手动添加value属性
        this.editContent.options.forEach(item => {
          item.value = item.id
        })
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
    // 增加选项 value值自增
    handleAddOption () {
      if (this.editContent.options.some(i => i.label === '')) {
        return this.$message.warning('请补充选项内容')
      }
      let lastValue = this.editContent.options[this.editContent.options.length - 1].id
      lastValue += 1
      this.editContent.options.push({ id: lastValue, label: '', value: lastValue })
    },
    // 失焦检测重复内容
    handleBlur (data, index) {
      if (this.editContent.options.some((item, idx) => idx !== index && item.label === data.label)) {
        this.editContent.options[index].label = ''
        return this.$message.warning('提示：选项内容不能重复')
      }
    },
    // 删除组件
    onConfirm (e) {
      this.$emit('onDelete', this.index)
    },
    validatorName (rule, value, callback) {
      let msg = ''
      switch (this.editContent.type) {
        case 'select':
          msg = '请输入选择框标题'
          break
        case 'checkbox':
          msg = '请输入多选框标题'
          break
        case 'radio':
          msg = '请输入单选框标题'
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

  .option-item {
    color: #666;
  }
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
