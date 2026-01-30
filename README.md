(1)通过 git clone 项目连接把项目考到本地;
(2)在每个目录下执行 npm install 下载依赖包;
(3)在 scratch-gui 目录下执行 npm link ../scratch-blocks ../scratch-vm ../scratch-l10n 连接两个文件;
(4)在 scratch-l10n 目录下执行 npm run build;
(5)在 scratch-blocks 目录下执行 npm run prepublish;
(6)在 scratch-gui 目录下执行 npm run start 打开项目;
注意: 如果 npm run start 报错, 可能是添加了新的依赖 ,可以尝试 npm install 重新下载依赖后执行(3)(4)(5)(6);

## 固件资源版本信息

### 当前固件版本

-   **固件版本**: v102 (LB_FWLIB/version/Version.txt)

### 固件资源组件

-   **LB_FWLIB**: 固件库 (v102)

因为目前不清楚 gitignore 忽略的哪些文件是本地项目跑起来必须的，所 A 以目前资源以本地的为主，git 只存储基础代码（不涉及到不清楚的，算了还是先不上传吧）更新固件版本一次
