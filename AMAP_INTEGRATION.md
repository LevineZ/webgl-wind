# 高德地图API集成说明

## 如何获取高德API密钥

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册账号并登录
3. 进入控制台，选择"应用管理" -> "我的应用"
4. 点击"创建新应用"
5. 填写应用信息（应用名称、应用类型等）
6. 创建完成后，点击"添加key"
7. 填写key名称，选择服务平台（Web端），即可获得API密钥

## 如何使用API密钥

1. 在 [index.html](file:///e:/ayb/warehouse/wind-field-visualization/demo/index.html) 文件中，将 `您的高德API密钥` 替换为实际的API密钥：
   ```html
   <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.15&key=您申请的实际高德API密钥"></script>
   ```

## 地图功能说明

- 地图使用卫星图层作为背景
- 风场数据叠加在地图上方显示
- 海岸线以半透明白色绘制，与地图背景协调

## 注意事项

- API密钥有调用次数限制，具体限制请参考高德开放平台的定价策略
- 请勿将API密钥泄露给他人
- 高德地图API使用需要网络连接

## 故障排除

如果地图无法正常显示，请检查：

1. API密钥是否正确填写
2. 网络连接是否正常
3. 是否在高德开放平台中正确配置了安全域名（如果需要）