<template>
  <div style="display: flex;flex-direction: row;justify-content: flex-end">
    <div class="time-range" style="position: relative;width: 360px">
      <el-input
        ref="picker"
        v-model="timeRangeText"
        placeholder="datetime range"
        :suffix-icon="icon"
        @focus="inputFocus"
      />
      <div class="time-picker" :class="[focus ? 'is-active' : '']">
        <div style="width: 60%;height: 100%">
          <div>Absolute time range</div>
          <div>From</div>
          <div>
            <el-date-picker
              v-model="startDatetime"
              type="datetime"
              size="mini"
              placeholder="select start datetime"
            />
          </div>

          <div>To</div>
          <div>
            <el-date-picker
              v-model="endDatetime"
              type="datetime"
              size="mini"
              placeholder="select end datetime"
            />
          </div>
          <span ref="tips" style="color: #f56c6c;font-size: 10px" /><br>
          <el-button size="mini" :disabled="isDisabled" @click="handleTimeRangeText('absoluteRange')">Apply time range
          </el-button>
        </div>
        <div style="width: 40%;height: 100%">
          <!--            v-model="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"-->
          <el-input
            v-model="search"
            placeholder="Search quick range"
            prefix-icon="el-icon-search"
            size="mini"
          />
          <el-button
            v-for="(item, index) in pickerOptions.filter(data => !search || data.text.toLowerCase().includes(search.toLowerCase()))"
            :key="index"
            style="margin-left: 0;width: 100%;text-align: left;border-width: 0"
            @click="handleTimeRangeText('quickRange',item)"
          >{{ item.text }}
          </el-button>
        </div>
      </div>
    </div>
    <div>
      <el-select v-model="refresh" style="width: 80px" placeholder="Interval">
        <el-option
          v-for="(item, index) in refreshOptions"
          :key="index"
          :label="item.label"
          :value="item.label"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GrafanaTimePicker',
  data() {
    return {
      icon: 'el-icon-arrow-down',
      focus: false,
      search: '',
      isDisabled: true,
      timer: '',
      timeRangeText: '',
      startDatetime: '',
      startTimestamp: '',
      endDatetime: '',
      endTimestamp: '',
      pickerOptions: [
        {
          text: 'Last 5 minutes',
          value: (new Date()).getTime() - 5 * 60 * 1000
        },
        {
          text: 'Last 15 minutes',
          value: (new Date()).getTime() - 15 * 60 * 1000
        },
        {
          text: 'Last 30 minutes',
          value: (new Date()).getTime() - 30 * 60 * 1000
        },
        {
          text: 'Last 1 hour',
          value: (new Date()).getTime() - 3600 * 1000
        },
        {
          text: 'Last 3 hours',
          value: (new Date()).getTime() - 3 * 3600 * 1000
        },
        {
          text: 'Last 6 hours',
          value: (new Date()).getTime() - 6 * 3600 * 1000
        },
        {
          text: 'Last 12 hours',
          value: (new Date()).getTime() - 12 * 3600 * 1000
        },
        {
          text: 'Last 24 hours',
          value: (new Date()).getTime() - 24 * 3600 * 1000
        },
        {
          text: 'Last 2 days',
          value: (new Date()).getTime() - 2 * 24 * 3600 * 1000
        },
        {
          text: 'Last 7 days',
          value: (new Date()).getTime() - 7 * 24 * 3600 * 1000
        },
        {
          text: 'Last 30 days',
          value: (new Date()).getTime() - 30 * 24 * 3600 * 1000
        }
      ],
      refresh: '5m',
      refreshOptions: [
        {
          value: 0,
          label: 'off'
        },
        {
          value: 300000,
          label: '5m'
        },
        {
          value: 900000,
          label: '15m'
        },
        {
          value: 1800000,
          label: '30m'
        }
      ]
    }
  },
  watch: {
    startTimestamp: {
      handler() {
        if (this.endTimestamp < this.startTimestamp) {
          this.$refs.tips.innerHTML = '截止时间应大于等于起始时间'
          this.isDisabled = true
        } else {
          this.$refs.tips.innerHTML = ''
          this.isDisabled = false
        }
      }
    },
    endTimestamp: {
      handler() {
        if (this.endTimestamp < this.startTimestamp) {
          this.$refs.tips.innerHTML = '截止时间应大于等于起始时间'
          this.isDisabled = true
        } else {
          this.$refs.tips.innerHTML = ''
          this.isDisabled = false
        }
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.closeTimePicker)
    this.handleTimeRangeText('quickRange', this.pickerOptions[0])
  },
  beforeDestroy() {
    clearInterval(this.timer)
    document.removeEventListener('click', this.closeTimePicker)
  },
  methods: {
    inputFocus() {
      this.focus = true
      this.icon = 'el-icon-arrow-up'
      this.timeRangeText = ''
    },
    handleTimeRangeText(event, item) {
      const refreshms = this.refreshOptions.filter(data => data.label === this.refresh)[0].value
      this.focus = false
      this.icon = 'el-icon-arrow-down'
      switch (event) {
        case 'absoluteRange':
          this.timeRangeText = this.datetimeFormat(this.startDatetime, '-') + ' to ' + this.datetimeFormat(this.endDatetime, '-')
          this.startTimestamp = this.startDatetime.getTime()
          this.endTimestamp = this.endDatetime.getTime()
          this.commitValue()
          if (refreshms > 0) {
            this.timer = setInterval(() => {
              this.commitValue()
            }, refreshms)
          }
          break
        case 'quickRange':
          this.endTimestamp = (new Date()).getTime()
          this.startTimestamp = item.value
          this.timeRangeText = item.text
          this.commitValue()
          if (refreshms > 0) {
            this.timer = setInterval(() => {
              this.endTimestamp = (new Date()).getTime()
              this.startTimestamp = item.value
              this.timeRangeText = item.text
              this.commitValue()
            }, refreshms)
          }
          break
      }
    },
    datetimeFormat(dateObj, split) {
      const year = dateObj.getFullYear()
      let month = dateObj.getMonth() + 1
      let day = dateObj.getDate()
      let hour = dateObj.getHours()
      let minute = dateObj.getMinutes()
      let second = dateObj.getSeconds()
      if (day < 10) {
        day = '0' + day
      }
      if (month < 10) {
        month = '0' + month
      }
      if (hour < 10) {
        hour = '0' + hour
      }
      if (minute < 10) {
        minute = '0' + minute
      }
      if (second < 10) {
        second = '0' + second
      }
      return [year, month, day].join(split) + ' ' + [hour, minute, second].join(':')
    },
    commitValue() {
      this.$emit('getValues', {
        startTimestamp: this.startTimestamp,
        endTimestamp: this.endTimestamp,
        refresh: this.refresh
      })
    },
    closeTimePicker(e) {
      const menu = document.getElementsByClassName('time-range')[0]
      if (menu) {
        if (!menu.contains(e.target) && this.focus) {
          this.focus = false
        }
      }
    }
  }
}
</script>

<style scoped>
.time-picker {
  display: none;
}

.time-picker.is-active {
  display: flex;
  flex-direction: row;
  position: absolute;
  height: 260px;
  width: 460px;
  top: 50px;
  right: 0;
  overflow: auto;
  border-width: 1px;
  border-style: solid;
  border-color: #bfcbd9;
  padding: 10px 10px;
}

div {
  color: #909399;
  margin: 5px 0;
}
</style>
