## 悦芯科技后台管理系统标准模板 使用说明

### 建议开发环境
* node版本：16.18.0
* npm版本：8.19.2
##### 不一定要和上述版本一样，只要你本地环境能正常运行即可，[node下载地址](https://nodejs.org/zh-cn)

### 启动说明
1. 设置淘宝镜像源：`npm config set registry=https://registry.npmmirror.com`
2. 安装yarn：`npm install yarn -g`
3. 安装依赖：`yarn install`
4. 启动项目：`npm run serve`
5. 打包项目：`npm run build`

### 关于打包
1. 如果只执行`npm run build`命令，后面不加任何参数，则默认使用.env.production文件下的配置
2. 执行`npm run build`命令的时候，后面可以加上若干自定义参数，加了自定义参数后会覆盖.env.production文件下的配置，例如执行`npm run build -- --isSSOEnable=1 --SERVER_URL=61.164.49.122:64239`，表示打包成生成环境，并指定了两个自定义参数，将.env.production文件中的`VUE_APP_isSSOEnable`设置为`1`，`VUE_APP_SERVER_URL`设置为`61.164.49.122:64239`
3. 自定义参数只能是.env.production文件中已经定义的环境变量，例如`VUE_APP_isSM2Encrypt`对应的自定义参数名为`isSM2Encrypt`

### 重点文件及目录介绍
* .env.development 开发环境下的环境变量配置
* .env.production 生产环境下的环境变量配置
* .eslintrc.js 代码规范校验配置
* /src/api 用于专门存放请求接口的方法
* /src/assets 用于专门存放静态资源类文件
* /src/components 用于专门存放非业务类组件或框架类组件
* /src/config 框架功能配置或系统业务配置开关
