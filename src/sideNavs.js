export default [
    {
      title: '发布系统',
      index: '/publishSys',
      icon: 'el-icon-s-promotion',
      children: [
        {
          name: '文章列表',
          index: '/publishSys/articleList'
        },
        {
          name: '科室列表',
          index: '/departmentSys/departmentList'
        },
        {
          name: '图片列表',
          index: '/imgSys/imgList'
        },
        {
          name: '医生列表',
          index: '/doctorSys/doctorList'
        },
        {
          name: '医生排班',
          index: '/doctorTime/doctorTimeList'
        },
        {
          name: '友情链接',
          index: '/friendLink/friendLinkList'
        }
      ]
    },
    {
      title: '用户系统',
      index: '3',
      icon: 'el-icon-s-custom',
      children: [
        {
          name: '用户列表',
          index: '/userSys/userList'
        }
      ]
    }
  ]