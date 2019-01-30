/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const bookingRouter = {
  path: '/booking',
  component: Layout,
  redirect: '/booking/list',
  name: 'Booking',
  meta: {
    roles: ['tms.booking'],
    title: 'booking',
    icon: 'example'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/booking/list'),
      name: 'List',
      meta: {
        roles: ['tms.booking.manage'],
        title: 'bookingList'
      }
    }
  ]
}
export default bookingRouter
