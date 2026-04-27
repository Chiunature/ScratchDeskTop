# pika-bytecode-gen-napi

SparkAI 使用的 PikaScript 字节码生成 N-API 扩展包。

这个包把 `pikaByteCodeGen` 的 C 源码直接编进 Node 原生模块，对外提供 JS API：

```js
const pikaBytecodeGen = require("pika-bytecode-gen-napi");

const result = pikaBytecodeGen.compile("input.py", "input.py.o");
```

返回值：

- `0`：编译成功
- 非 `0`：编译失败

## 使用方式

不要手动把 `.node` 文件复制到 `node_modules`。

SparkAI 通过本地 npm 依赖引用这个包：

```json
"pika-bytecode-gen-napi": "file:native/pika-bytecode-gen-napi"
```

在 `scratch-gui` 目录执行：

```powershell
npm install --legacy-peer-deps
```

安装时会通过 `node-gyp` 构建：

```text
node_modules/pika-bytecode-gen-napi/build/Release/pika_bytecode_gen.node
```

## 构建环境

Windows 下需要：

- Node.js / npm
- Python（供 `node-gyp` 使用）
- Visual Studio Build Tools，包含 C++ 桌面开发工具链
- 可用的 MSVC 编译器

如果 `npm install` 构建失败，优先检查：

- `python` 是否可用
- Visual Studio Build Tools 是否安装了 C++ workload
- 当前 Electron / Node 版本是否变更后需要重新 rebuild

## Electron 打包注意

原生 `.node` 模块不能直接从 `app.asar` 内加载。

`scratch-gui/package.json` 已配置：

```json
"asarUnpack": [
  "node_modules/pika-bytecode-gen-napi/build/Release/*.node"
]
```

不要删除这段配置，否则打包后的应用可能无法加载 `pika_bytecode_gen.node`。

## 源码同步注意

本包内 vendored 了一份瘦身后的 `pikascript` 源码，只保留 N-API 编译需要的目录：

```text
pikascript/pikascript-core
pikascript/pikascript-api
pikascript/pikascript-lib/PikaStdLib
```

这些文件不参与编译，不需要放进本包：

```text
pikascript/pikaPackage.exe
pikascript/main.py
pikascript/requestment.txt
*.o / *.a / *.obj / *.exe / __pycache__
```

如果桌面上的 `pikaByteCodeGen` 项目更新了 PikaScript 版本，需要同步更新这里：

```text
native/pika-bytecode-gen-napi/pikascript
native/pika-bytecode-gen-napi/pika_config.h
```

推荐同步步骤：

1. 在原始 `pikaByteCodeGen` 项目里完成 `pikaPackage.exe` 或其他生成步骤。
2. 只复制下面三个目录到本包的 `pikascript` 目录：

```text
C:\Users\Administrator\Desktop\pikaByteCodeGen\pikascript\pikascript-core
C:\Users\Administrator\Desktop\pikaByteCodeGen\pikascript\pikascript-api
C:\Users\Administrator\Desktop\pikaByteCodeGen\pikascript\pikascript-lib\PikaStdLib
```

3. 同步 `pika_config.h`：

```text
C:\Users\Administrator\Desktop\pikaByteCodeGen\pika_config.h
  -> native/pika-bytecode-gen-napi/pika_config.h
```

4. 检查 `binding.gyp`。如果上游新增了必须编译的 `.c` 文件，要把它加到 `sources`。

5. 回到 `scratch-gui` 重新安装/构建：

```powershell
npm install --legacy-peer-deps
```

或单独进入本包目录重建：

```powershell
npm install
npm run build
```

6. 做一次最小验证：

```powershell
node -e "const fs=require('fs');const path=require('path');const m=require('pika-bytecode-gen-napi');const d=path.join(process.cwd(),'resources','ByteCode');fs.mkdirSync(d,{recursive:true});const i=path.join(d,'smoke.py');const o=path.join(d,'smoke.py.o');fs.writeFileSync(i,\"print('ok')\n\");console.log(m.compile(i,o),fs.existsSync(o),fs.statSync(o).size)"
```

## SparkAI 调用链路

当前调用链路是：

```text
handleUploadPython
  -> window.myAPI.commendMake
  -> preload.js
  -> pika-bytecode-gen-napi.compile(input.py, input.py.o)
```

也就是说，SparkAI 上传 Python 代码时会先把 `.py` 写入 `ByteCode` 目录，再通过这个扩展包生成 `.py.o`，最后继续走原来的下发流程。

## 不要做的事

- 不要手动修改 `node_modules/pika-bytecode-gen-napi`，重新安装依赖会覆盖它。
- 不要只提交构建后的 `.node`，源码和 `binding.gyp` 必须保留。
- 不要把 `.node` 放进 `resources/ByteCode` 当成普通资源使用。
- 不要删除 `asarUnpack` 配置。
