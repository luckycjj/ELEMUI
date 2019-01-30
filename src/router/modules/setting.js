import Layout from '@/views/layout/Layout'

const setting = {
  path: '/settingBox',
  component: Layout,
  name: 'settingBox',
  meta: {
    // roles: ['tms.order'],
    title: '设置中心',
    icon: 'example'
  },
  children: [
    {
      path: '/basicDataCarrier',
      component: () => import('@/views/setting/basicDataCarrier'),
      name: 'basicDataCarrier',
      meta: {
        // roles: ['tms.order'],
        title: '基础数据(承运商)'
      }
    },
    {
      path: '/basicDataOwner',
      component: () => import('@/views/setting/basicDataOwner'),
      name: 'basicDataOwner',
      meta: {
        // roles: ['tms.order'],
        title: '基础数据(货主)'
      }
    },
    {
      path: 'carinfo-details/:carCode',
      component: () => import('@/views/setting/basicDataCarrier/components/carInfoDetails'),
      name: 'CarInfoDetails',
      meta: {
        title: '车辆详情',
        noCache: true
      },
      hidden: true
    },
    {
      path: 'add-details/:pk_address',
      component: () => import('@/views/setting/basicDataOwner/components/AddDetails'),
      name: 'AddDetails',
      meta: {
        title: '地址详情',
        noCache: true
      },
      hidden: true
    },
    {
      path: '/lookDriverMessage/:driverCode',
      component: () => import('@/views/setting/components/AccountStatement'),
      name: 'lookDriverMessage',
      meta: {
        // roles: ['tms.order'],
        title: '司机资料'
      },
      hidden: true
    },
    {
      path: 'add-carinfo',
      component: () => import('@/views/setting/basicDataCarrier/createCarinfo'),
      name: 'CreateCarinfo',
      meta: {
        title: '新建车辆',
        noCache: true
      },
      hidden: true
    },
    {
      path: '/lookDriverMessage/new',
      component: () => import('@/views/setting/components/AccountStatement'),
      name: 'lookDriverMessage',
      meta: {
        // roles: ['tms.order'],
        title: '司机资料'
      },
      hidden: true
    },
    {
      path: 'edit-carinfo/:carInfo',
      component: () => import('@/views/setting/basicDataCarrier/editCarinfo'),
      name: 'EditCarinfo',
      meta: {
        title: '编辑车辆',
        noCache: true
      },
      hidden: true
    },
    {
      path: '/lookCustMessage/:custCode',
      component: () => import('@/views/setting/components/lookCust'),
      name: 'lookCustMessage',
      meta: {
        // roles: ['tms.order'],
        title: '客户资料'
      },
      hidden: true
    },
    {
      path: 'add-addinfo',
      component: () => import('@/views/setting/basicDataOwner/CreateAddinfo'),
      name: 'CreateAddinfo',
      meta: {
        title: '新建地址',
        noCache: true
      },
      hidden: true
    },
    {
      path: 'edit-addinfo',
      component: () => import('@/views/setting/basicDataOwner/EditAddinfo'),
      name: 'EditAddinfo',
      meta: {
        title: '编辑地址',
        noCache: true
      },
      hidden: true
    },
    {
      path: '/lookCustMessage/new',
      component: () => import('@/views/setting/components/lookCust'),
      name: 'lookCustMessage',
      meta: {
        // roles: ['tms.order'],
        title: '客户资料'
      },
      hidden: true
    }
  ]
}
export default setting
