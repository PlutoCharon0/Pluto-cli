#! /usr/bin/env node
const { program } = require("commander"); // 配置自定义交互式命令
const { version } = require("../package.json"); // 获取版本号

const { createProject, handleGetTemplate } = require("../lib/index.js");

program
    // 定义命令
    .command("create [projectName]")
    // 定义别名
    .alias("创建项目")
    .option("-t --template <template>", "指定模板名称")
    // 定义命令处理方法
    .action(async (projectName, options) => {
        options.templateList = await handleGetTemplate();
        // 该方法接受一个回调函数，回调函数的参数名称就是我们前面定义的参数
        createProject(projectName, options);
    });

// .version() 方法用于设置版本号，当在命令行中执行 --version 或者 -V 时，显示的版本
// .parse() 用于解析命名行参数，默认值为 process.argv * 重要
// process.argv  [nodejs安装路径，当前脚手架js文件执行路径，命令行参数...]
program.version(version).parse();
