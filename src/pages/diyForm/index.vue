<template>
  <section class="container clearfix">
    <config-wrap @onSelectComponent="handleSelectCompnent"></config-wrap>
    <phone-preview :componentList.sync="componentList" :error.sync="selectedIndex" @onUpdate="onUpdate"
                   @onDelete="onDelete"></phone-preview>
    <section class="bottom-btn flex flex-center">
      <a-button type="default" :loading="submitLoading" @click="onClose">取消</a-button>
      <a-button type="primary" :loading="submitLoading" @click="onSubmit">提交</a-button>
    </section>
  </section>
</template>

<script>
import ConfigWrap from './components/ConfigWrap'
import PhonePreview from './components/PhonePreview'

import { deepClone } from './formUtil.js'


export default {
  name: 'DiyFormAdd',
  components: {
    ConfigWrap,
    PhonePreview
  },
  data () {
    return {
      submitLoading: false,
      componentList: [],
      selectedIndex: 0
    }
  },
  created () {
    let component = { required: true, label: 'MID', placeholder: '', type: 'header', icon: '', value: '' }
    this.componentList = [component]
  },
  methods: {
    // 选择组件
    handleSelectCompnent (data) {
      const component = deepClone(data)
      this.componentList.push(component)
    },
    // 更新组件数据
    onUpdate (data, secondParam) {
      if (typeof secondParam === 'boolean') {
        this.componentList = data
        return
      }
      this.componentList[secondParam] = data
    },
    // 删除组件
    onDelete (index) {
      this.componentList.splice(index, 1)
    },
    // 提交
    async onSubmit () {
      await this.validateForm().then(async () => {
        this.submitLoading = true
        try {
          const data = {
            name: this.componentList[0].label,
            diyFormItemForms: this.componentList.slice(1, this.componentList.length)
          }
          console.log('提交的data：',data)
          // await this.$http.postRequest('/wechat/wechat-diyForm/add', data)
          this.$message.success('保存成功')
          this.$emit('close', true)
        } catch ({ message }) {
          this.$message.error(message)
        }
        this.submitLoading = false
      }).catch(e => {
        this.selectedIndex = e.active
        this.$message.error(e.msg)
      })
    },
    validateForm () {
      console.log('result', this.componentList)
      return new Promise((resolve, reject) => {
        let active = null,
          msg = '标题不能为空!'
        const hasEmpty = this.componentList.some((item, index) => {
          active = index
          if ((['select', 'checkbox', 'radio'].includes(item.type) && item.options.some(i => i.label === ''))) {
            msg = '选项内容不能为空!'
          }
          return item.label === '' || (['select', 'checkbox', 'radio'].includes(item.type) && item.options.some(i => i.label === ''))
        })
        hasEmpty ? reject({ msg, active }) : resolve()
      })
    },
    // 关闭
    onClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  background-color: #eee;

  .bottom-btn {
    padding: 0 50px;
    position: absolute;
    bottom: 0px;
    left: 0;
    justify-content: space-between;
    width: 270px;
    height: 60px;
  }
}
</style>
