export const ROLES = ['Admin', 'Author', 'Editor', 'Maintainer', 'Subscriber']

export const PLANS = ['Basic', 'Company', 'Enterprise', 'Team']

export const STATUS_OPTIONS = ['active', 'pending', 'inactive']

/** Seed users matching Materio User List Figma */
export const seedUsers = [
  {
    id: '1',
    fullName: 'Jordan Stevenson',
    username: '@jstevenson5o',
    email: 'susanna.lind57@gmail.com',
    role: 'Admin',
    plan: 'Enterprise',
    billing: 'Auto Debit',
    status: 'pending',
    avatar: '/images/avatars/1.png',
    phone: '+1 (234) 567-8901',
    company: 'ThemeSelection',
    country: 'USA',
  },
  {
    id: '2',
    fullName: 'Richard Payne',
    username: '@rpayne4f',
    email: 'estelle.bailey10@gmail.com',
    role: 'Editor',
    plan: 'Team',
    billing: 'Manual Cash',
    status: 'active',
    avatar: '/images/avatars/2.png',
    phone: '+1 (234) 567-8902',
    company: 'Pixinvent',
    country: 'USA',
  },
  {
    id: '3',
    fullName: 'Jennifer Summers',
    username: '@jsummers4l',
    email: 'tony.weber@gmail.com',
    role: 'Author',
    plan: 'Company',
    billing: 'Manual Cash',
    status: 'active',
    avatar: '/images/avatars/3.png',
    phone: '+1 (234) 567-8903',
    company: 'Materio',
    country: 'Canada',
  },
  {
    id: '4',
    fullName: 'Mr. Justin Richardson',
    username: '@mrichardson84',
    email: 'clinton.johan91@yahoo.com',
    role: 'Editor',
    plan: 'Team',
    billing: 'Auto Debit',
    status: 'pending',
    avatar: '/images/avatars/4.png',
    phone: '+1 (234) 567-8904',
    company: 'ThemeSelection',
    country: 'UK',
  },
  {
    id: '5',
    fullName: 'Nicholas Tanner',
    username: '@ntanner4p',
    email: 'bradly.zoe69@yahoo.com',
    role: 'Maintainer',
    plan: 'Company',
    billing: 'Auto Debit',
    status: 'active',
    avatar: '/images/avatars/5.png',
    phone: '+1 (234) 567-8905',
    company: 'Pixinvent',
    country: 'Australia',
  },
  {
    id: '6',
    fullName: 'Crystal Mays',
    username: '@crystal99',
    email: 'norene.bins@yahoo.com',
    role: 'Editor',
    plan: 'Team',
    billing: 'Manual Paypal',
    status: 'pending',
    avatar: '/images/avatars/6.png',
    phone: '+1 (234) 567-8906',
    company: 'Materio',
    country: 'USA',
  },
  {
    id: '7',
    fullName: 'Mary Garcia',
    username: '@marygarcia4',
    email: 'emmitt.walker14@hotmail.com',
    role: 'Maintainer',
    plan: 'Basic',
    billing: 'Auto Debit',
    status: 'inactive',
    avatar: '/images/avatars/7.png',
    phone: '+1 (234) 567-8907',
    company: 'ThemeSelection',
    country: 'Spain',
  },
  {
    id: '8',
    fullName: 'Megan Roberts',
    username: '@megan78',
    email: 'patrick.howe73@gmail.com',
    role: 'Subscriber',
    plan: 'Basic',
    billing: 'Manual Cash',
    status: 'active',
    avatar: '/images/avatars/8.png',
    phone: '+1 (234) 567-8908',
    company: 'Pixinvent',
    country: 'France',
  },
]

export const statusLabel = {
  active: 'Active',
  pending: 'Pending',
  inactive: 'Inactive',
}

export const statusColor = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary',
}

export const roleMeta = {
  Admin: { color: '#8C57FF', icon: 'shield' },
  Author: { color: '#FFB400', icon: 'edit' },
  Editor: { color: '#16B1FF', icon: 'pencil' },
  Maintainer: { color: '#56CA00', icon: 'cog' },
  Subscriber: { color: '#8A8D93', icon: 'account' },
}

export const userStats = [
  { title: 'Total Users', stats: '21,459', trend: '+29%', trendDir: 'up', color: '#8C57FF', subtitle: 'Total Users' },
  { title: 'Paid Users', stats: '4,567', trend: '+18%', trendDir: 'up', color: '#FF4C51', subtitle: 'Last week analytics' },
  { title: 'Active Users', stats: '19,860', trend: '-14%', trendDir: 'down', color: '#56CA00', subtitle: 'Last week analytics' },
  { title: 'Pending Users', stats: '237', trend: '+42%', trendDir: 'up', color: '#FFB400', subtitle: 'Last week analytics' },
]
