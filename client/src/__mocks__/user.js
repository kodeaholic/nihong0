/**
 * 模拟请求数据
 * @param {FetchMock} fetchMock 当现有条件不满足时，可以使用fetchMock来进行扩展
 * @param {function} delay 增加延迟时间 ms 例: delay(mockData) 或 delay(mockData, 200)
 * @param {function} mock 使用mock生成数据，例:

   mock({
     'string|1-10': '★' // 生成最少1颗，最多10颗星字符
   })

   // {'string': '★★★★★★'} 

  更多用法参考 http://mockjs.com/examples.html
 */
export default ({fetchMock, delay, mock, toSuccess, toError}) => {
  // 如果现有扩展不满足需求，可以直接使用fetchMock方法
  // fetchMock.mock(/httpbin.org\/post/, {/* response */}, {/* options */});

  return {
    '/api/user/login': (options) => {
      if (options.body) {
        const user = JSON.parse(options.body);
        if (user.userName === 'admin' && user.password === 'admin') {
          return toSuccess(mock({
            'userName': 'admin',                // 用户名
            'name': '@cname',                   // 中文名称
            'age|1-100': 100,                   // 100以内随机整数
            'birthday': '@date("yyyy-MM-dd")',  // 日期
            'city': '@city(true)',              // 中国城市
            'phone': /^1[385][1-9]\d{8}/,       // 手机号
            'token': '@guid'                    // token
          }), 400);
        } else {
          return toError('用户名或密码错误 admin/admin');
        }
      } else {
        return toError('请输入用户名和密码');
      }
    },
    '/api/user/register': options => toSuccess(),
    '/api/user/menu': options => toSuccess([
      {
        name: 'Dashboard',
        icon: 'DashboardOutlined',
        path: '/dashboard',
      },
      {
        name: 'Components',
        icon: 'DesktopOutlined',
        path: '/component',
        children: [
          {
            name: 'Toolbar',
            path: '/toolbar',
          },
          {
            name: 'BaseComponent',
            path: '/baseComponent',
          },
          {
            name: 'Columns',
            path: '/column',
          },
          {
            name: 'Searchbar',
            path: '/searchBar',
          },
          {
            name: 'Datatable',
            path: '/datatable',
          },
          {
            name: 'Forms',
            path: '/form',
          },
          {
            name: 'TransferTree',
            path: '/transferTree',
          },
          {
            name: 'Charts',
            path: '/charts',
            children: [
              {
                name: 'ECharts',
                path: '/charts/ec',
              },
              {
                name: 'G2',
                path: '/charts/g2',
              },
            ]
          },
          {
            name: 'Print',
            path: '/print',
          },
          {
            name: 'Banner',
            path: '/banner',
          },
        ],
      },
      {
        name: 'UI',
        icon: 'ShareAltOutlined',
        path: '/ui',
        children: [
          {
            name: 'Buttons',
            path: '/button',
          },
          {
            name: 'Images',
            path: '/image',
          },
          {
            name: 'Alerts',
            path: '/alerts',
          },
          {
            name: 'Animations',
            path: '/animations',
          },
          {
            name: 'Icons',
            path: '/icons',
          },
          {
            name: 'Editors',
            path: '/editor',
          },
          {
            name: 'Modal',
            path: '/modal',
          },
          {
            name: 'Mask',
            path: '/mask',
          },
        ],
      },
      {
        name: 'Page',
        icon: 'BookOutlined',
        path: '/page',
        children: [
          {
            name: 'Login',
            path: '/sign/login',
          },
          {
            name: 'Register',
            path: '/sign/register',
          },
          {
            name: 'Lock',
            path: '/lock',
          },
          {
            name: 'Gallery',
            path: '/gallery',
          },
          {
            name: 'Blank',
            path: '/blank',
          },
          {
            name: 'Result',
            path: '/result',
          },
          {
            name: 'Coming Soon',
            path: '/coming',
          },
          {
            name: '403',
            path: '/403',
          },
          {
            name: '404',
            path: '/404',
          },
          {
            name: '500',
            path: '/500',
          },
          {
            name: '多级路由',
            path: '/level-route/:sub?',
          },
        ],
      },
      {
        name: 'Business',
        icon: 'BulbOutlined',
        path: '/business',
        children: [
          {
            name: 'CRUD',
            path: '/crud/:detail?',
          }
        ],
      },
    ], 400)
  } 
}