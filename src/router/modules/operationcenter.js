/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const operationCenterRouter = {
  path: '/operationCenter',
  component: Layout,
  redirect: '/operationCenter/dispatch',
  name: 'OperationCenter',
  meta: {
    roles: ['tms.waybill'],
    title: 'operationCenter',
    icon: 'example'
  },
  children: [
    {
      path: 'dispatch',
      component: () => import('@/views/operationCenter/dispatch'),
      name: 'Dispatch',
      meta: {
        roles: ['tms.waybill.dispatch'],
        title: 'dispatch'
      }
    }, {
      path: 'transport',
      component: () => import('@/views/operationCenter/transport'),
      name: 'Transport',
      meta: {
        roles: ['tms.waybill.manage'],
        title: 'transport'
      }
    }, {
      path: 'location',
      component: () => import('@/views/operationCenter/location'),
      name: 'Location',
      meta: {
        // roles: ['tms.waybill.location'],
        title: 'location'
      }
    },
    {
      path: 'way-bill/:vbillno',
      component: () => import('@/views/operationCenter/edit'),
      name: 'waybillEdit',
      meta: { title: 'waybillCheck', noCache: true },
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
export default operationCenterRouter
