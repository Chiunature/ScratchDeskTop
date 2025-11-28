(1)通过 git clone 项目连接把项目考到本地;
(2)在每个目录下执行 npm install 下载依赖包;
(3)在 scratch-gui 目录下执行 npm link ../scratch-blocks ../scratch-vm ../scratch-l10n 连接两个文件;
(4)在 scratch-l10n 目录下执行 npm run build;
(5)在 scratch-blocks 目录下执行 npm run prepublish;
(6)在 scratch-gui 目录下执行 npm run start 打开项目;
注意: 如果 npm run start 报错, 可能是添加了新的依赖 ,可以尝试 npm install 重新下载依赖后执行(3)(4)(5)(6);

## 固件资源版本信息

### 当前固件版本

- **固件版本**: v305 (LB_FWLIB/version/Version.txt)
- **配置版本**: v1.3.1 (hotVersion.json)
- **ATC 版本**: v179
- **LB 版本**: v227

### 固件资源组件

- **LB_FWLIB**: 固件库 (v305)
  - 包含各种传感器和执行器固件
  - 位置: `scratch-gui/resources/LB_FWLIB/`
- **ByteCode**: 字节码工具
  - 位置: `scratch-gui/resources/ByteCode/`
- **gcc-arm-none-eabi**: 交叉编译工具链 (v10.3.1)
  - 位置: `scratch-gui/resources/gcc-arm-none-eabi/`
- **zadig**: USB 驱动工具 (v2.8)
  - 位置: `scratch-gui/resources/zadig.exe`
- **Description**: 说明文档
  - 位置: `scratch-gui/resources/Description/`

### 版本更新说明

- 固件资源通过 `package.json` 的 `extraResources` 配置打包
- 版本信息存储在 `scratch-gui/src/config/json/LB_FWLIB.json`
- 热更新版本信息存储在 `scratch-gui/resources/scripts/hotVersion.json`

因为目前不清楚 gitignore 忽略的哪些文件是本地项目跑起来必须的，所以目前资源以本地的为主，git 只存储基础代码（不涉及到不清楚的，算了还是先不上传吧）更新固件版本一次
