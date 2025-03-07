import { lazy } from 'react'

// project imports
import Loadable from 'components/Loadable'
import DashboardLayout from 'layout/Dashboard'

// render- Dashboard
// const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')))

// render - color

const Hotel = Loadable(lazy(() => import('pages/hotel/hotel')))
const Destination = Loadable(lazy(() => import('pages/destination/destination')))
const Schedule = Loadable(lazy(() => import('pages/schedule/schedule')))
const Restaurant = Loadable(lazy(() => import('pages/restaurant/restaurant')))
const Place = Loadable(lazy(() => import('pages/place/place')))

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')))

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    // {
    //   path: '/',
    //   element: <DashboardDefault />
    // },
    // {
    //   path: 'dashboard',
    //   children: [
    //     {
    //       path: 'default',
    //       element: <DashboardDefault />
    //     }
    //   ]
    // },

    {
      path: 'hotel',
      element: <Hotel />
    },
    {
      path: 'place',
      element: <Place />
    },
    {
      path: 'restaurant',
      element: <Restaurant />
    },
    {
      path: 'destination',
      element: <Destination />
    },
    {
      path: 'schedule',
      element: <Schedule />
    }
  ]
}

export default MainRoutes
