const menuList = [
  {
    title: '欢迎页',
    key: '/home',
    icon: 'home'
  },{
    title: '商品',
    key: '/products',
    icon: 'appstore',
    children:[
      {
        title: '品类管理',
        key: '/category',
        icon: 'folder-open'
      },
      {
        title: '商品管理',
        key: '/product',
        icon: 'filter'
      },
    ]
  },{
    title: '用户管理',
    key: '/user',
    icon: 'user'
  },{
    title: '角色管理',
    key: '/role',
    icon: 'cluster'
  },{
    title: '图表',
    key: '/charts',
    icon: 'appstore',
    children:[
      {
        title: 'bar图',
        key: '/charts/bar',
        icon: 'bar-chart'
      },
      {
        title: '线图',
        key: '/charts/line',
        icon: 'line-chart'
      },{
        title: '饼图',
        key: '/charts/pie',
        icon: 'pie-chart'
      }
    ]
  }
]

export default menuList