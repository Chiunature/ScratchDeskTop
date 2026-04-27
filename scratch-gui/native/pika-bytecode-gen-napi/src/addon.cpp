#include <napi.h>

extern "C" {
#include "PikaCompiler.h"
}

namespace {

Napi::Value Compile(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 2 || !info[0].IsString() || !info[1].IsString()) {
        Napi::TypeError::New(
            env,
            "Expected arguments: (inputPyPath: string, outputFilePath: string)")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string inputPyPath = info[0].As<Napi::String>().Utf8Value();
    std::string outputFilePath = info[1].As<Napi::String>().Utf8Value();

    PIKA_RES result = pikaCompileFileWithOutputName(
        const_cast<char*>(outputFilePath.c_str()),
        const_cast<char*>(inputPyPath.c_str()));

    return Napi::Number::New(env, static_cast<double>(result));
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("compile", Napi::Function::New(env, Compile));
    return exports;
}

}  // namespace

NODE_API_MODULE(pika_bytecode_gen, Init)
