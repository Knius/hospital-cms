export default [
    {
      title: '发布系统',
      index: '/publishSys',
      icon: 'el-icon-s-promotion',
      children: [
        {
          name: '文章列表',
          index: '/publishSys/articleList'
        }
      ]
    },
    {
      title: '预约系统',
      index: '2',
      icon: 'el-icon-s-order',
      children: [
        {
          name: '已预约列表',
          index: '2-1'
        },
        {
          name: '确认到列表',
          index: '2-2'
        },
        {
          name: '确认不来列表',
          index: '2-3'
        },
        {
          name: '已到列表',
          index: '2-4'
        },
        {
          name: '未到列表',
          index: '2-5'
        },
        {
          name: '需调整列表',
          index: '2-6'
        }
      ]
    },
    {
      title: '用户系统',
      index: '3',
      icon: 'el-icon-s-custom',
      children: [
        {
          name: '添加用户',
          index: '3-1'
        },
        {
          name: '用户管理',
          index: '3-2'
        },
        {
          name: '个人信息',
          index: '3-3'
        },
        {
          name: '个人密码修改',
          index: '3-4'
        }
      ]
    },
    {
      title: '留言系统',
      index: '/msgSys',
      icon: 'el-icon-s-comment',
      children: [
        {
          name: '留言管理',
          index: '/msgSys/msgManagement'
        }
      ]
    }
  ]