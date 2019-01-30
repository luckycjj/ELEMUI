/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const settlementCenterRouter = {
  path: '/settlementCenter',
  component: Layout,
  redirect: '/settlementCenter/costlist',
  name: 'settlementCenter',
  meta: {
    roles: ['tms.settlement'],
    title: 'settlementCenter',
    icon: 'example'
  },
  children: [

    {
      path: 'way-bill/:vbillno',
      component: () => import('@/views/operationCenter/edit'),
      name: 'waybillEdit',
      meta: { title: 'waybillCheck', noCache: true },
      hidden: true
    },
    {
      path: 'costlist',
      component: () => import('@/views/settlementCenter/costlist'),
      name: 'costlist',
      meta: {
        roles: ['tms.settlement.collect'],
        title: 'costlist' }
    },
    // 货主应付账单
    {
      path: 'receivablebill',
      component: () => import('@/views/settlementCenter/receivaIndex/index'),
      name: 'receivablebill',
      meta: {
        roles: ['tms.settlement.payhost'],
        title: '应付账单' },
      children: [
        {
          path: 'receivablebill',
          component: () => import('@/views/settlementCenter/receivaIndex/receivablebill'),
          name: 'Receivablebill',
          meta: {
            roles: ['tms.settlement.payhost.reconcilize'],
            title: '应付对账'
          }
        },
        {
          path: 'receivablebill1',
          component: () => import('@/views/settlementCenter/receivaIndex/receivablebill1'),
          name: 'Receivablebill1',
          meta: {
            roles: ['tms.settlement.payhost.bill'],
            title: '应付开票' }
        },
        {
          path: 'receivablebill2',
          component: () => import('@/views/settlementCenter/receivaIndex/receivablebill2'),
          name: 'Receivablebill2',
          meta: {
            roles: ['tms.settlement.payhost.verify'],
            title: '应付核销' }
        }
      ]
    }, {
      path: 'receivablebill',
      component: () => import('@/views/settlementCenter/receivaIndex/index'),
      name: 'receivablebill',
      meta: {
        roles: ['tms.settlement.collect.reconcilize'],
        title: 'receivableBill' },
      children: [
        {
          path: 'receivablebill',
          component: () => import('@/views/settlementCenter/receivaIndex/receivablebill'),
          name: 'Receivablebill',
          meta: {
            roles: ['tms.settlement.collect.reconcilize'],
            title: '应收对账'
          }
        },
        {
          path: 'receivablebill1',
          component: () => import('@/views/settlementCenter/receivaIndex/receivablebill1'),
          name: 'Receivablebill1',
          meta: {
            roles: ['tms.settlement.collect.bill'],
            title: '应收开票' }
        },
        {
          path: 'receivablebill2',
          component: () => import('@/views/settlementCenter/receivaIndex/receivablebill2'),
          name: 'Receivablebill2',
          meta: {
            roles: ['tms.settlement.collect.verify'],
            title: '应收核销' }
        }
      ]
    }, {
      path: 'payablebill',
      component: () => import('@/views/settlementCenter/payIndex/index'),
      name: 'payablebill',
      meta: {
        roles: ['tms.settlement.pay'],
        title: 'payableBill' },
      children: [
        {
          path: 'payablebill',
          component: () => import('@/views/settlementCenter/payIndex/payablebill'),
          name: 'payablebill',
          meta: {
            roles: ['tms.settlement.pay.reconcilize'],
            title: '应付对账' }
        },
        {
          path: 'payablebill1',
          component: () => import('@/views/settlementCenter/payIndex/payablebill1'),
          name: 'payablebill1',
          meta: {
            roles: ['tms.settlement.pay.bill'], title: '应付开票' }
        },
        {
          path: 'payablebill2',
          component: () => import('@/views/settlementCenter/payIndex/payablebill2'),
          name: 'payablebill2',
          meta: {
            roles: ['tms.settlement.pay.verify'], title: '应付核销' }
        }
      ]
    },
    {
      path: 'add-invoice',
      component: () => import('@/views/settlementCenter/createInvoice'),
      name: 'CreateInvoice',
      meta: {
        roles: ['tms.settlement.costlist.ticket', 'tms.settlement.collect.genInvoice', 'tms.settlement.pay.genInvoice'],
        title: 'addinvoice',
        noCache: true
      },
      hidden: true
    }
  ]
}
export default settlementCenterRouter
