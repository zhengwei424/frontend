import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * 当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * hidden: true // (默认 false)

 * 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * redirect: 'noRedirect'

 * 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 * 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 * 若你想不管路由下面的 children 声明的个数都显示你的根路由
 * 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * alwaysShow: true

 * name: 'router-name' // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta: {
 * roles: ['admin', 'editor'] // 设置该路由进入的权限，支持多个权限叠加
 * title: 'title' // 设置该路由在侧边栏和面包屑中展示的名字
 * icon: 'svg-name' // 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
 * noCache: true // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
 * breadcrumb: false //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
 * affix: true // 如果设置为true，它则会固定在tags-view中(默认 false)

 * 当路由设置了该属性，则会高亮相对应的侧边栏。
 * 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
 * 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
 * activeMenu: '/article/list'
 */

/**
 * 这里的路由分为两种，constantRoutes 和 asyncRoutes。
 * constantRoutes： 代表那些不需要动态判断权限的路由，所有roles都能被访问，如登录页、404、等通用页面。
 * asyncRoutes： 代表那些需求动态判断权限并通过 addRoutes 动态添加的页面。具体的会在"权限验证页面"介绍
 * https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/permission.html
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/cluster'
  },
  {
    path: '/cluster',
    component: () => import('@/views/clusterManagement/index'),
    hidden: true
  },
  // 集群dashboard
  {
    path: '/clusterDashboard',
    component: Layout,
    children: [{
      path: 'cluster',
      name: 'Cluster',
      component: () => import('@/views/clusterDashboard/index'),
      meta: { title: 'Cluster' }
    }]
  },
  // node
  {
    path: '/nodes',
    // 路由都加载Layout是为了让用户可以根据需求切换不同的layout
    component: Layout,
    children: [
      {
        path: 'nodes',
        name: 'Nodes',
        component: () => import('@/views/kubernetes/node/Node'),
        meta: { title: 'Nodes' }
      }
    ]
  },
  // namespace
  {
    path: '/namespaces',
    component: Layout,
    children: [
      {
        path: 'namespaces',
        name: 'Namespaces',
        component: () => import('@/views/kubernetes/namespace/Namespace'),
        meta: { title: 'Namespaces' }
      }
    ]
  },
  // 工作负载
  {
    path: '/workload',
    // 路由都加载Layout是为了让用户可以根据需求切换不同的layout
    component: Layout,
    redirect: '/workload/pods',
    name: 'WorkLoad',
    meta: { title: 'WorkLoad' },
    children: [
      {
        path: 'cronJobs',
        name: 'CronJobs',
        component: () => import('@/views/kubernetes/workload/cronJob/CronJob'),
        meta: { title: 'CronJobs' }
      },
      {
        path: 'jobs',
        name: 'Jobs',
        component: () => import('@/views/kubernetes/workload/job/Job'),
        meta: { title: 'Jobs' }
      },
      {
        path: 'replicationControllers',
        name: 'ReplicationControllers',
        component: () => import('@/views/kubernetes/workload/replicationController/ReplicationController'),
        meta: { title: 'ReplicationControllers' }
      },
      {
        path: 'deployments',
        name: 'Deployments',
        component: () => import('@/views/kubernetes/workload/deployment/Deployment'),
        meta: { title: 'Deployments' }
      },
      {
        path: 'replicaSets',
        name: 'ReplicaSets',
        component: () => import('@/views/kubernetes/workload/replicaSet/ReplicaSet'),
        meta: { title: 'ReplicaSets' }
      },
      {
        path: 'pods',
        name: 'Pods',
        component: () => import('@/views/kubernetes/workload/pod/Pod'),
        meta: { title: 'Pods' }
      },
      {
        path: 'daemonSets',
        name: 'DaemonSets',
        component: () => import('@/views/kubernetes/workload/daemonSet/DaemonSet'),
        meta: { title: 'DaemonSets' }
      },
      {
        path: 'statefulSets',
        name: 'StatefulSets',
        component: () => import('@/views/kubernetes/workload/statefulSet/StatefulSet'),
        meta: { title: 'StatefulSets' }
      }
    ]
  },

  // 配置
  {
    path: '/config',
    // 路由都加载Layout是为了让用户可以根据需求切换不同的layout
    component: Layout,
    name: 'Config',
    redirect: '/config/configMaps',
    meta: { title: 'Config' },
    children: [
      {
        path: 'configMaps',
        name: 'ConfigMaps',
        component: () => import('@/views/kubernetes/config/configMap/ConfigMap'),
        meta: { title: 'ConfigMaps' }
      },
      {
        path: 'secrets',
        name: 'Secrets',
        component: () => import('@/views/kubernetes/config/secret/Secret'),
        meta: { title: 'Secrets' }
      }
    ]
  },

  // 基于角色的访问控制
  {
    path: '/rbac',
    // 路由都加载Layout是为了让用户可以根据需求切换不同空的layout
    component: Layout,
    name: 'RBAC',
    redirect: '/rbac/clusterRoles',
    meta: { title: 'RBAC' },
    children: [
      {
        path: 'clusterRoles',
        name: 'ClusterRoles',
        component: () => import('@/views/kubernetes/RBAC/clusterRole/ClusterRole'),
        meta: { title: 'ClusterRoles' }
      },
      {
        path: 'clusterRoleBindings',
        name: 'ClusterRoleBindings',
        component: () => import('@/views/kubernetes/RBAC/clusterRoleBinding/ClusterRoleBinding'),
        meta: { title: 'ClusterRoleBindings' }
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/kubernetes/RBAC/role/Role'),
        meta: { title: 'Roles' }
      },
      {
        path: 'roleBindings',
        name: 'RoleBindings',
        component: () => import('@/views/kubernetes/RBAC/roleBinding/RoleBinding'),
        meta: { title: 'RoleBindings' }
      },
      {
        path: 'serviceAccounts',
        name: 'ServiceAccounts',
        component: () => import('@/views/kubernetes/RBAC/serviceAccount/ServiceAccount'),
        meta: { title: 'ServiceAccounts' }
      }
    ]
  },

  // 存储
  {
    path: '/storage',
    // 路由都加载Layout是为了让用户可以根据需求切换不同的layout
    component: Layout,
    redirect: '/storage/persistentVolumes',
    name: 'Storage',
    meta: { title: 'Storage' },
    children: [
      {
        path: 'persistentVolumes',
        name: 'PersistentVolumes',
        component: () => import('@/views/kubernetes/storage/persistentVolume/PersistentVolume'),
        meta: { title: 'PersistentVolumes' }
      },
      {
        path: 'persistentVolumeClaims',
        name: 'PersistentVolumeClaims',
        component: () => import('@/views/kubernetes/storage/persistentVolumeClaim/PersistentVolumeClaim'),
        meta: { title: 'PersistentVolumeClaims' }
      },
      {
        path: 'storageClasses',
        name: 'StorageClasses',
        component: () => import('@/views/kubernetes/storage/storageClass/StorageClass'),
        meta: { title: 'StorageClasses' }
      }
    ]
  },

  // 服务
  {
    path: '/svc',
    // 路由都加载Layout是为了让用户可以根据需求切换不同的layout
    component: Layout,
    redirect: '/svc/services',
    name: 'SVC',
    meta: { title: 'SVC' },
    children: [
      {
        path: 'ingresses',
        name: 'Ingresses',
        component: () => import('@/views/kubernetes/SVC/ingress/Ingress'),
        meta: { title: 'Ingresses' }
      },
      {
        path: 'networkPolicies',
        name: 'NetworkPolicies',
        component: () => import('@/views/kubernetes/SVC/networkPolicy/NetworkPolicy'),
        meta: { title: 'NetworkPolicies' }
      },
      {
        path: 'services',
        name: 'Services',
        component: () => import('@/views/kubernetes/SVC/service/Service'),
        meta: { title: 'Services' }
      },
      {
        path: 'endpoints',
        name: 'endpoints',
        component: () => import('@/views/kubernetes/SVC/endpoint/Endpoint'),
        meta: { title: 'Endpoints' }
      }
    ]
  },

  // 其他
  {
    path: '/other',
    // 路由都加载Layout是为了让用户可以根据需求切换不同的layout
    component: Layout,
    redirect: '/other/events',
    name: 'Other',
    meta: { title: 'Other' },
    children: [
      {
        path: 'events',
        name: 'Events',
        component: () => import('@/views/kubernetes/other/event/Event'),
        meta: { title: 'Events' }
      }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
