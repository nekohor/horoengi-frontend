### 前端安装

.npmrc 文件复制到前端文件夹的根目录

```shell
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
registry=https://registry.npm.taobao.org
```

安装并启动调试

```shell
# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

### 后端安装

```shell
# virtual env build
mkvirtualenv horoengi
workon horoengi

# pip install packages
pip install django==2.2
pip install djangorestframework


# start proj and apps
django-admin startproject backend
cd backend
pytohn manage.py qos

```

### 配置 restframework

```shell
# 在proj的settings.py中增加相关设置

INSTALLED_APPS = [
    ...
    'rest_framework',
]

REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ]
}

```

### 配置 jwt

安装 simplejwt

```
pip install djangorestframework_simplejwt
```

setup jwt in settings.py

```pytho
REST_FRAMEWORK = {
	'DEFAULT_AUTHENTICATION_CLASSES': [
		'rest_framework_simplejwt.authentication.JWTAuthentication',
	],
}

# 默认鉴权用户，可更改
AUTH_USER_MODEL = "auth_user"
```

add url routers

```python
from django.contrib import admin
from django.urls import path

from rest_framework_simplejwt import views as JWTAuthenticationViews

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/token', JWTAuthenticationViews.TokenObtainPairView.as_view(),
         name='get_token'),
    path('api/token/refresh',
         JWTAuthenticationViews.TokenRefreshView.as_view(), name='refresh_token'),

]
```

### 设置自己的 JWT 处理函数

### 数据库迁移和新用户设置

```
python manage.py migrate

python manage.py createsuperuser
```

### 出现编码错误

出现类似`UnicodeDecodeError: ‘gbk’ codec can’t decode byte 0xa6 in position 9737`这样的错误，需要对虚拟环境中的`\Lib\site-packages\django\views\debug.py`文件进行修改。属于平台上的问题。

如下所示：

```python
with Path(CURRENT_DIR, 'templates', 'technical_500.html').open() as fh:
```

改为

```python
 with Path(CURRENT_DIR, 'templates', 'technical_500.html').open(encoding='utf-8') as fh:
```

进行编码设置 ，然后再重新启动 runserver，出错信息即可正常显示在页面显示。

### 测试 api 接口

在需要挂代理的机子上，必须在 firefox 的 restclient 里测试

Content-Type 必须为 application/json

```
{
    "username": "nekohor",
    "password": "11235813"
}
```

### 前端 mock 和真实数据并行开发

```js
devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API + "/user/login"]: {
        target: `http://localhost:8000/api/token`,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API + "/user/login"]: ""
        }
      },
      [process.env.VUE_APP_BASE_API+'/user/info']: {
        target: `http://localhost:${port}/mock`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      },
      [process.env.VUE_APP_BASE_API]:{
        target: process.env.BACKGROUND_APPLICATION_URL,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    after: require('./mock/mock-server.js')
  }
```

需要用 mock 的 api 往前移动

before 改 after

最后后端开发完毕后直接注释或删除 proxy 和 after（before）。

### 前端 request.js 中请求的验证头修改

```js
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["Authorization"] = "Bearer " + getToken();
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);
```

`config.headers["Authorization"]`设为请求头类型加 token

### 前端 request.js 中相应的错误码修改

```js
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000
      });

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning"
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  error => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);
```

若相应 json 中暂时没有错误码则可以先把其中的 if 条件判断注释掉。注意包括`return Promise.reject(new Error(res.message || "Error"));`也要注释掉。

## 精简初始的前端项目

### 修改 router

进入 router/index.js

清空所有的动态 router, 删除所有 import 的子路由

静态路由中 hidden 为 true 的路由为系统级别路由，保持不动，删除 Document 和 Guide 的路由。

affix 代表此路由是否依附在状态栏上，不需要可以设置为 false。

### 修改 layout

修改 navbar. 分隔线使用 divided 进行设置.

在 layout 的 index.vue 中增加 el-footer 相关信息。

### 替换 favicon

在 public 文件夹下替换 favicon.ico
