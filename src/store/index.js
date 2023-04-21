import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import currentNamespace from '@/store/modules/common/currentNamespace'
import namespacesInfo from '@/store/modules/kubernetes/namespace/namespace'
import nodesInfo from '@/store/modules/kubernetes/node/node'
import configMapsInfo from '@/store/modules/kubernetes/config/configMap'
import secretsInfo from '@/store/modules/kubernetes/config/secret'
import eventsInfo from '@/store/modules/kubernetes/other/event'
import clusterRolesInfo from '@/store/modules/kubernetes/RBAC/clusterRole'
import clusterRoleBindingsInfo from '@/store/modules/kubernetes/RBAC/clusterRoleBinding'
import rolesInfo from '@/store/modules/kubernetes/RBAC/role'
import roleBindingsInfo from '@/store/modules/kubernetes/RBAC/roleBinding'
import serviceAccountsInfo from '@/store/modules/kubernetes/RBAC/serviceAccount'
import persistentVolumesInfo from '@/store/modules/kubernetes/storage/persistentVolume'
import persistentVolumeClaimsInfo from '@/store/modules/kubernetes/storage/persistentVolumeClaim'
import storageClassesInfo from '@/store/modules/kubernetes/storage/storageClass'
import ingressesInfo from '@/store/modules/kubernetes/SVC/ingress'
import networkPoliciesInfo from '@/store/modules/kubernetes/SVC/networkPolicy'
import servicesInfo from '@/store/modules/kubernetes/SVC/service'
import endpointsInfo from '@/store/modules/kubernetes/SVC/endpoint'
import podsInfo from '@/store/modules/kubernetes/workload/pod'
import daemonSetsInfo from '@/store/modules/kubernetes/workload/daemonSet'
import deploymentsInfo from '@/store/modules/kubernetes/workload/deployment'
import statefulSetsInfo from '@/store/modules/kubernetes/workload/statefulSet'
import cronJobsInfo from '@/store/modules/kubernetes/workload/cronJob'
import jobsInfo from '@/store/modules/kubernetes/workload/job'
import replicaSetsInfo from '@/store/modules/kubernetes/workload/replicaSet'
import replicationControllersInfo from '@/store/modules/kubernetes/workload/replicationController'
import tabsList from '@/store/modules/common/tabs'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    currentNamespace,
    namespacesInfo,
    nodesInfo,
    configMapsInfo,
    secretsInfo,
    eventsInfo,
    clusterRolesInfo,
    clusterRoleBindingsInfo,
    rolesInfo,
    roleBindingsInfo,
    serviceAccountsInfo,
    endpointsInfo,
    persistentVolumesInfo,
    persistentVolumeClaimsInfo,
    storageClassesInfo,
    ingressesInfo,
    networkPoliciesInfo,
    servicesInfo,
    podsInfo,
    daemonSetsInfo,
    deploymentsInfo,
    statefulSetsInfo,
    cronJobsInfo,
    jobsInfo,
    replicaSetsInfo,
    replicationControllersInfo,
    tabsList
  },
  getters
})

export default store
