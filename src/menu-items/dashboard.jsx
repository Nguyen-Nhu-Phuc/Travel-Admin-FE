import {
  IconBuildingSkyscraper,
  IconDropletPin,
  IconNavigationPin,
  IconChefHat,
  IconCalendarTime
} from '@tabler/icons-react'

const icons = {
  IconBuildingSkyscraper,
  IconDropletPin,
  IconNavigationPin,
  IconChefHat,
  IconCalendarTime
}

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'destination',
      title: 'Destination',
      type: 'item',
      url: '/destination',
      icon: icons.IconNavigationPin,
      breadcrumbs: false
    },
    {
      id: 'hotel',
      title: 'Hotel',
      type: 'item',
      url: '/hotel',
      icon: icons.IconBuildingSkyscraper,
      breadcrumbs: false
    },
    {
      id: 'restaurant',
      title: 'Restaurant',
      type: 'item',
      url: '/restaurant',
      icon: icons.IconChefHat,
      breadcrumbs: false
    },
    {
      id: 'place',
      title: 'Place',
      type: 'item',
      url: '/place',
      icon: icons.IconDropletPin,
      breadcrumbs: false
    },
    {
      id: 'schedule',
      title: 'Schedule',
      type: 'item',
      url: '/schedule',
      icon: icons.IconCalendarTime,
      breadcrumbs: false
    }
  ]
}

export default dashboard
