(1)通过 git clone 项目连接把项目考到本地;
(2)在每个目录下执行 npm install 下载依赖包;
(3)在 scratch-gui 目录下执行 npm link ../scratch-blocks ../scratch-vm ../scratch-l10n 连接两个文件;
(4)在scratch-l10n目录下执行npm run build;
(5)在scratch-blocks目录下执行npm run prepublish;
(6)在 scratch-gui 目录下执行 npm run start 打开项目;
注意: 如果npm run start报错, 可能是添加了新的依赖  ,可以尝试npm install重新下载依赖后执行(3)(4)(5)(6);        