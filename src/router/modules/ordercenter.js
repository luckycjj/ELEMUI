/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const orderCenterRouter = {
  path: '/orderCenter',
  component: Layout,
  redirect: '/orderCenter/addorder',
  name: 'OrderCenter',
  meta: {
    roles: ['tms.order'],
    title: 'orderCenter',
    icon: 'example'
  },
  children: [
    {
      path: 'add-order',
      component: () => import('@/views/ordercenter/create'),
      name: 'CreateForm',
      meta: {
        roles: ['tms.order.create'],
        title: 'addorder',
        noCache: true
      }
    },
    {
      path: 'orderlist',
      component: () => import('@/views/ordercenter/orderlist'),
      name: 'OrderList',
      meta: {
        roles: ['tms.order.manage'],
        title: 'orderlist'
      }
    },
    {
      path: 'edit-order/:vbillno',
      component: () => import('@/views/ordercenter/edit'),
      name: 'EditForm',
      meta: {
        roles: ['tms.order.edit'],
        title: 'editorder',
        noCache: true
      },
      hidden: true
    },
    {
      path: 'order-details/:vbillno',
      component: () => import('@/views/ordercenter/components/OrderDetails'),
      name: 'OrderDetails',
      meta: {
        roles: ['tms.order.detail'],
        title: 'orderDetails',
        noCache: true
      },
      hidden: true
    },
    {
      path: 'track/:entrustVbillno',
      component: () => import('@/views/operationCenter/track'),
      name: 'Track',
      meta: { title: 'edientrustTrack', noCache: true },
      hidden: true
    }
  ]
}
export default orderCenterRouter
