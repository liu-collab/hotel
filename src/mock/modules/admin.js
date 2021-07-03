import Mock from 'mockjs'
//生成随机数据
// Mock响应模板
Mock.mock('http://mock.com:83/Admin/List', 'get', function () {

  return Mock.mock({
    "data|5-10": [{ //随机生成5-10个元素
      'id|+1': 1,//属性值自动加一,从0开始
      loginId: "@word(3,5)",
      name: "@cname",
      phone: "@phone()",
      roleId: "93",
      photo: "@image(100*100)",
    }
    ]
  }).data;
});
