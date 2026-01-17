import sys
import subprocess
import os
import asyncio

venv_name = "myvenv"
# python_path = sys.executable

venv_folder_path = f"{os.getcwd()}\\{os.path.join(venv_name)}" 
exe_folder_path = f"{os.getcwd()}\\Spark-AI.exe"
resources_path = f"{os.getcwd()}\\resources"
tasks = []
path_list = [venv_folder_path, exe_folder_path, resources_path]

async def check_folder_attr(folder_path):
    if os.path.exists(folder_path):
        if os.path.isdir(folder_path):
            attributes = os.stat(folder_path).st_file_attributes
        else:
            attributes = os.stat(folder_path).st_file_attributes
        is_hidden = bool(attributes & 2)
        if not is_hidden:
            process = await asyncio.create_subprocess_exec('attrib', '+h', folder_path)
            await process.wait()

async def run_check():
    for i in path_list:
        tasks.append(asyncio.create_task(check_folder_attr(i)))
    await asyncio.wait(tasks)

if __name__ == '__main__':
    asyncio.run(run_check())

    # 获取虚拟环境激活脚本路径
    activate_script = os.path.join(venv_name, "Scripts", "activate")
    deactivate_script = os.path.join(venv_name, "Scripts", "deactivate.bat")

    # 检查虚拟环境是否存在
    if not os.path.exists(activate_script):
        print("环境不存在，请先创建环境！")
        # 创建虚拟环境
        # subprocess.run([python_path, "-m", "venv", venv_name])
        sys.exit(1)

    activate_process = subprocess.Popen(["cmd", "/k", f"call {activate_script}"], creationflags=subprocess.CREATE_NO_WINDOW)


    # 在虚拟环境中执行
    target = os.path.join("Spark-AI.exe")
    sub_process = subprocess.Popen(target)
    # 等待 Spark-AI.exe 进程完成
    sub_process.wait()

    activate_process.kill()
    # 退出虚拟环境
    deactivate_process = subprocess.Popen(["cmd", "/k", f"call {deactivate_script}"], creationflags=subprocess.CREATE_NO_WINDOW)
    deactivate_process.kill()
    
    sys.exit()
