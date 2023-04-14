<template>
  <div>
    <button @click="getContainerLog">getContainerLog</button>
    <button @click="getContainerLogFile">getContainerLogFile</button>
  </div>
</template>

<script>
import axios from 'axios'
import { getToken } from '@/utils/auth'
export default {
  name: 'Dashboard',
  data() {
    return {
    }
  },
  methods: {
    getContainerLog() {
      const namespace = 'kube-system'
      const pod = 'calico-kube-controllers-86cd97ff9c-vg9s6'
      const container = 'calico-kube-controllers'
      const logFilePosition = 'end'
      const referenceTimestamp = 'newest'
      const referenceLineNum = '0'
      const offsetFrom = '1'
      const offsetTo = '2'
      const previous = false

      axios.get(`${process.env.VUE_APP_BASE_API}/workload/log/${namespace}/${pod}/${container}?logFilePosition=${logFilePosition}&referenceTimestamp=${referenceTimestamp}&referenceLineNum=${referenceLineNum}&offsetFrom=${offsetFrom}&offsetTo=${offsetTo}&previous=${previous}`)
        .then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
    },
    getContainerLogFile() {
      const namespace = 'kube-system'
      const pod = 'calico-kube-controllers-86cd97ff9c-vg9s6'
      const container = 'calico-kube-controllers'
      // 不能设置为true，不知道它表示什么，表示故障之前的容器？？？？
      const previous = false

      axios.get(`${process.env.VUE_APP_BASE_API}/workload/logfile/${namespace}/${pod}/${container}?previous=${previous}`, { headers: {
        token: getToken()
      }}).then(res => {
        // Blob是一个不可变的、原始数据的类文件对象，它的数据可以按文本或二进制的格式进行读取，也可以转换成 ReadableStream 来用于数据操作。
        const blob = new Blob([res.data], {
          // pptx的MIME Type, （linux可以通过file -i <filename>查看文件MIME Type）
          type: 'text/plain; charset=utf-8'
        })
        const link = document.createElement('a')
        link.download = res.headers.filename
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
