{
  "targets": [
    {
      "target_name": "pika_bytecode_gen",
      "sources": [
        "src/addon.cpp",
        "pikascript/pikascript-core/BaseObj.c",
        "pikascript/pikascript-core/PikaCompiler.c",
        "pikascript/pikascript-core/PikaObj.c",
        "pikascript/pikascript-core/PikaParser.c",
        "pikascript/pikascript-core/PikaPlatform.c",
        "pikascript/pikascript-core/PikaVM.c",
        "pikascript/pikascript-core/TinyObj.c",
        "pikascript/pikascript-core/dataArg.c",
        "pikascript/pikascript-core/dataArgs.c",
        "pikascript/pikascript-core/dataLink.c",
        "pikascript/pikascript-core/dataLinkNode.c",
        "pikascript/pikascript-core/dataMemory.c",
        "pikascript/pikascript-core/dataQueue.c",
        "pikascript/pikascript-core/dataQueueObj.c",
        "pikascript/pikascript-core/dataStack.c",
        "pikascript/pikascript-core/dataString.c",
        "pikascript/pikascript-core/dataStrs.c",
        "pikascript/pikascript-api/__asset_pikaModules_py_a.c",
        "pikascript/pikascript-api/__pikaBinding.c",
        "pikascript/pikascript-api/pikaScript.c",
        "pikascript/pikascript-lib/PikaStdLib/PikaDebuger_Debuger.c",
        "pikascript/pikascript-lib/PikaStdLib/PikaStdData_ByteArray.c",
        "pikascript/pikascript-lib/PikaStdLib/PikaStdData_Dict.c",
        "pikascript/pikascript-lib/PikaStdLib/PikaStdData_FILEIO.c",
        "pikascript/pikascript-lib/PikaStdLib/PikaStdData_List.c",
        "pikascript/pikascript-lib/PikaStdLib/PikaStdData_String.c",
        "pikascript/pikascript-lib/PikaStdLib/PikaStdData_Tuple.c",
        "pikascript/pikascript-lib/PikaStdLib/PikaStdData_Utils.c",
        "pikascript/pikascript-lib/PikaStdLib/PikaStdLib_MemChecker.c",
        "pikascript/pikascript-lib/PikaStdLib/PikaStdLib_RangeObj.c",
        "pikascript/pikascript-lib/PikaStdLib/PikaStdLib_StringObj.c",
        "pikascript/pikascript-lib/PikaStdLib/PikaStdLib_SysObj.c",
        "pikascript/pikascript-lib/PikaStdLib/PikaStdTask_Task.c"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        ".",
        "pikascript/pikascript-core",
        "pikascript/pikascript-api",
        "pikascript/pikascript-lib/PikaStdLib"
      ],
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS",
        "PIKA_CONFIG_ENABLE",
        "CROSS_BUILD"
      ],
      "conditions": [
        [
          "OS=='win'",
          {
            "libraries": [
              "-lws2_32",
              "-lbcrypt",
              "-luser32",
              "-luserenv"
            ]
          }
        ]
      ],
      "msvs_settings": {
        "VCCLCompilerTool": {
          "ExceptionHandling": 0
        }
      },
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"]
    }
  ]
}
