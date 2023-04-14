import router from '../router'
// import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条（主页和url框之间会有一个进度条）
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 白名单，跳转不会被拦截
// const whiteList = ['/login', '/register'] // no redirect whitelist
const whiteList = ['/login', '/register'] // no redirect whitelist

// 全局前置路由守卫
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // 设置网页标签标题
  document.title = getPageTitle(to.meta.title)

  // 获取cookies中存储的token
  const hasToken = getToken()

  if (hasToken) {
    // 有token时
    if (to.path === '/login') {
      // 如果有token，证明已经登录过了，直接跳过login页面，转到主页dashboard页面
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
    }
  } else {
    // 没有token时，在白名单里的路由可以通过，不在白名单内的路由转到login页面
    if (whiteList.indexOf(to.path) !== -1) {
      // 白名单内的路由直接访问
      next()
    } else {
      // 非白名单的路由跳转到登录页面
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
