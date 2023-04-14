<template>
  <div ref="tooltip" class="tooltip" @mouseover="changeTooltipPosition(pos)">
    {{ value }}
    <div :class="'tooltip-text ' + 'tooltip-' + pos" :style="'background: ' + bgColor + ';color: ' + fontColor">{{ tipValue }}</div>
  </div>
</template>

<script>
export default {
  name: 'ToolTips',
  props: {
    value: {
      type: String,
      default: ''
    },
    tipValue: {
      type: String,
      default: ''
    },
    pos: {
      type: String,
      default: 'top'
    },
    bgColor: {
      type: String,
      default: '#555555'
    },
    fontColor: {
      type: String,
      default: '#ffffff'
    }
  },
  methods: {
    changeTooltipPosition(pos) {
      // 获取tooltip-text
      const el_span = this.$refs.tooltip.getElementsByClassName('tooltip-text')[0]
      if (pos === 'bottom') {
        el_span.style.top = (this.$refs.tooltip.clientHeight + 10).toString() + 'px'
        el_span.style.right = ((this.$refs.tooltip.clientWidth - el_span.clientWidth) / 2).toString() + 'px'
        el_span.style.setProperty('--color', this.bgColor)
      } else if (pos === 'right') {
        el_span.style.left = (this.$refs.tooltip.clientWidth + 10).toString() + 'px'
        el_span.style.top = ((this.$refs.tooltip.clientHeight - el_span.clientHeight) / 2).toString() + 'px'
        el_span.style.setProperty('--color', this.bgColor)
      } else if (pos === 'left') {
        el_span.style.right = (this.$refs.tooltip.clientWidth + 10).toString() + 'px'
        el_span.style.top = ((this.$refs.tooltip.clientHeight - el_span.clientHeight) / 2).toString() + 'px'
        el_span.style.setProperty('--color', this.bgColor)
      } else {
        el_span.style.bottom = (this.$refs.tooltip.clientHeight + 10).toString() + 'px'
        el_span.style.right = ((this.$refs.tooltip.clientWidth - el_span.clientWidth) / 2).toString() + 'px'
        el_span.style.setProperty('--color', this.bgColor)
      }
    }
  }
}
</script>

<style scoped>
.tooltip {
  /*border-bottom: 1px dashed;*/
  text-decoration: none;
  display: inline-block;
  position: relative;
}

.tooltip .tooltip-text {
  display: none;
  opacity: 0;
  /*自定义属性，用户设置伪元素:after的border-color*/
  --color: #555555
}

.tooltip:hover .tooltip-text {
  /*border: #666 2px dotted;*/
  padding: 5px 0;
  z-index: 2000 !important;
  text-align: center;
  display: block;
  min-width: 260px;
  height: 30px;
  position: absolute;
  text-decoration: none;
  border-radius: 6px;
  opacity: 1; /*取值范围0.0~1.0，0表示完全透明，1表示不透明，0.6表示半透明*/
  transition: opacity .6s;
}

.tooltip-text::after {
  content: "";
  /*它的位置是相对于tooltip-text而言的*/
  position: absolute;
  border-width: 5px;
  border-style: solid;
}

.tooltip-right::after {
  top: 50%;
  right: 100%;
  margin-top: -5px;
  border-color: transparent var(--color) transparent transparent;
}

.tooltip-left::after {
  top: 50%;
  left: 100%;
  margin-top: -5px;
  border-color: transparent transparent transparent var(--color);
}

.tooltip-top::after {
  top: 100%;
  right: 50%;
  margin-right: -5px;
  border-color: var(--color) transparent transparent transparent;
}

.tooltip-bottom::after {
  bottom: 100%;
  right: 50%;
  margin-right: -5px;
  border-color: transparent transparent var(--color) transparent;
}
</style>
