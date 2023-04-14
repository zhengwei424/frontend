<template>
  <div class="pod-console">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="Pod信息" name="first">
        <div>
          <div class="pod-info-title">Pod信息</div>
          <table cellspacing="0">
            <tr>
              <td class="pod-info-key">Created</td>
              <td style="width: 50px" />
              <td class="pod-info-value">{{ podInfo.created }}</td>
            </tr>
            <tr>
              <td class="pod-info-key">Name</td>
              <td style="width: 50px" />
              <td class="pod-info-value">{{ podInfo.name }}</td>
            </tr>
            <tr>
              <td class="pod-info-key">Namespace</td>
              <td style="width: 50px" />
              <td class="pod-info-value">{{ podInfo.namespace }}</td>
            </tr>
            <!--            <tr>-->
            <!--              <td class="pod-info-key">Annotations</td>-->
            <!--              <td style="width: 50px" />-->
            <!--              <td class="pod-info-value">-->
            <!--                <div v-for="(v, k, i) in podInfo.annotations" :key="i">{{ k }}={{ v }}</div>-->
            <!--              </td>-->
            <!--            </tr>-->
            <tr>
              <td class="pod-info-key">Conditions</td>
              <td style="width: 50px" />
              <td class="pod-info-value">
                <div v-for="(v, k) in podInfo.conditions" :key="k">{{ v.type }}: {{ v.status }}</div>
              </td>
            </tr>
            <tr>
              <td class="pod-info-key">Status</td>
              <td style="width: 50px" />
              <td class="pod-info-value">
                <div
                  v-if="podInfo.status === 'Running'"
                  class="status"
                  style="color: #57bd54;"
                >{{ podInfo.status }}
                </div>
                <div
                  v-else
                  class="status"
                  style="color: red;"
                >{{ podInfo.status }}
                </div>
              </td>
            </tr>
            <tr>
              <td class="pod-info-key">PriorityClass</td>
              <td style="width: 50px" />
              <td class="pod-info-value">{{ podInfo.priorityClass }}</td>
            </tr>
            <tr>
              <td class="pod-info-key">Priority</td>
              <td style="width: 50px" />
              <td class="pod-info-value">{{ podInfo.priority }}</td>
            </tr>
            <tr>
              <td class="pod-info-key">Node</td>
              <td style="width: 50px" />
              <td class="pod-info-value">{{ podInfo.nodeIP }}</td>
            </tr>
            <tr>
              <td class="pod-info-key">Pod IP</td>
              <td style="width: 50px" />
              <td class="pod-info-value">{{ podInfo.podIP }}</td>
            </tr>
            <tr>
              <td class="pod-info-key">QoS Class</td>
              <td style="width: 50px" />
              <td class="pod-info-value">{{ podInfo.qos }}</td>
            </tr>
            <tr>
              <td class="pod-info-key">Tolerations</td>
              <td style="width: 50px" />
              <td v-if="podInfo.tolerations" class="pod-info-value">
                <el-table :data="podInfo.tolerations">
                  <el-table-column
                    prop="key"
                    label="Key"
                    sortable
                  />
                  <el-table-column
                    prop="operator"
                    label="Operator"
                    sortable
                  />
                  <el-table-column
                    prop="effect"
                    label="Effect"
                    sortable
                  />
                  <el-table-column
                    prop="tolerationSeconds"
                    label="TolerationSeconds"
                    sortable
                  />
                </el-table>
              </td>
              <td v-else class="pod-info-value">None</td>
            </tr>
          </table>
          <div class="pod-info-title">Containers信息</div>
          <div v-for=" (item, index) in podInfo.containers" :key="containersKey[index]">
            <div style="margin-top: 20px;margin-bottom: 50px">
              <div class="container" :style="{'background': getContainerStateColor(item)}" />
              <span style="margin-left: 10px">{{ item.name }}</span>
            </div>
            <table cellspacing="0">
              <tr>
                <td class="container-info-key">Status</td>
                <td style="width: 50px" />
                <td class="container-info-value">{{ item.state }}</td>
              </tr>
              <tr>
                <td class="container-info-key">Last TerminationState</td>
                <td style="width: 50px" />
                <td class="container-info-value">
                  <div v-for="(v, k) in sortLastTerminationState(item.lastTerminationState)" :key="k">{{ k }}: {{
                    v
                  }}
                  </div>
                </td>
              </tr>
              <tr>
                <td class="container-info-key">Name</td>
                <td style="width: 50px" />
                <td class="container-info-value">{{ item.name }}</td>
              </tr>
              <tr>
                <td class="container-info-key">ContainerID</td>
                <td style="width: 50px" />
                <td class="container-info-value">{{ item.containerID }}</td>
              </tr>
              <tr>
                <td class="container-info-key">Image</td>
                <td style="width: 50px" />
                <td class="container-info-value">{{ item.image }}</td>
              </tr>
              <tr>
                <td class="container-info-key">Resquests</td>
                <td style="width: 50px" />
                <td class="container-info-value">
                  <div v-for="(v, k) in item.requests" :key="k">{{ k }}:{{ v }}</div>
                </td>
              </tr>
              <tr>
                <td class="container-info-key">Limits</td>
                <td style="width: 50px" />
                <td class="container-info-value">
                  <div v-for="(v, k) in item.limits" :key="k">{{ k }}:{{ v }}</div>
                </td>
              </tr>
              <tr>
                <td class="container-info-key">RestartCount</td>
                <td style="width: 50px" />
                <td class="container-info-value">{{ item.restartCount }}</td>
              </tr>
              <tr>
                <td class="container-info-key">StartedAt</td>
                <td style="width: 50px" />
                <td class="container-info-value">{{ item.startedAt }}</td>
              </tr>
            </table>
          </div>
          <div class="pod-info-title">events信息</div>
          <div v-for="(item, index) in podEvent" :key="podEvent[index]">
            <div class="event-message">{{ item.message }}</div>
            <table cellspacing="0">
              <tr>
                <td class="event-info-key">Type</td>
                <td style="width: 50px" />
                <td class="event-info-value">{{ item.type }}</td>
              </tr>
              <tr>
                <td class="event-info-key">Age</td>
                <td style="width: 50px" />
                <td class="event-info-value">{{ item.age }}({{ item.fullAge }})</td>
              </tr>
              <tr>
                <td class="event-info-key">Count</td>
                <td style="width: 50px" />
                <td class="event-info-value">{{ item.count }}</td>
              </tr>
              <tr>
                <td class="event-info-key">Source Component</td>
                <td style="width: 50px" />
                <td class="event-info-value">{{ item.source_component }}</td>
              </tr>
              <tr>
                <td class="event-info-key">Source Host</td>
                <td style="width: 50px" />
                <td class="event-info-value">{{ item.source_host }}</td>
              </tr>
            </table>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="查看监控" name="second">查看监控</el-tab-pane>
      <el-tab-pane label="容器日志" name="third">
        <PodLog :namespace="podInfo.namespace" :pod="podInfo.name" :containers-name="containersName" />
      </el-tab-pane>
      <el-tab-pane label="进入容器" name="fourth">
        <PodTerminal :namespace="podInfo.namespace" :pod="podInfo.name" :containers-name="containersName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PodTerminal from './Terminal'
import PodLog from './PodLog'
import shortid from 'shortid'

export default {
  name: 'PodConsole',
  components: { PodLog, PodTerminal },
  props: {
    podInfo: {
      type: Object,
      required: true,
      default: () => {
      }
    },
    podEvent: {
      type: Array,
      required: true,
      default: () => {
      }
    }
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  computed: {
    containersName() {
      const names = []
      if (this.podInfo) {
        const containers = this.podInfo.containers
        for (let i = 0; i < containers.length; i++) {
          names.push(containers[i].name)
        }
      }
      return names
    },
    containersKey() {
      return this.podInfo.containers.map(value => shortid.generate())
    },
    eventsKey() {
      return this.podEvent.map(value => shortid.generate())
    }
  },
  methods: {
    getContainerStateColor(containerInfo) {
      if (containerInfo.state === 'Running') {
        return '#57bd54'
      } else {
        return 'orange'
      }
    },
    sortLastTerminationState(lastTerminationState) {
      return {
        'reason': lastTerminationState.reason,
        'message': lastTerminationState.message,
        'containerID': lastTerminationState.containerID,
        'startedAt': lastTerminationState.startedAt,
        'finishedAt': lastTerminationState.finishedAt
      }
    }
  }
}
</script>

<style scoped>
.pod-info-title {
  background-color: #2e95d5;
  color: white;
  height: 30px;
  line-height: 30px;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 12pt;
  padding-left: 5px;
  margin-top: 10px;
  width: 800px;
}

.pod-info-key, .container-info-key, .event-info-key, .event-message {
  font-family: 微软雅黑, sans-serif;
  font-size: 14px;
  color: #2b2f3a;
  font-weight: bold;
}

.container-info-key {
  width: 160px;
}

.event-message {
  color: red;
  margin: 20px 0;
}

table {
  width: 800px;
}

tr {
  height: 30px;
}

td {
  padding: 1px 0px;
  border-bottom: solid 1px #bfcbd9;
}

.container {
  height: 8px;
  width: 8px;
  border-radius: 2px;
  display: inline-block;
}
</style>
