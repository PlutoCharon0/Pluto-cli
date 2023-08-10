const inquirer = require("inquirer"); // 处理用户在命令行的输入
const ora = require("ora"); // 加载过渡效果
const downloadGitRepo = require("download-git-repo"); // 拉去远程模板
const path = require("path");
const fs = require("fs-extra"); // fs模块的拓展模块
const { getGitReposList } = require("../utils/index.js");
const chalk = require('chalk') // 控制命令行字体高亮色
async function createProject(project_name, options) {
    const { template: templateName, templateList } = options; // 获取用户指定的模板名称
    let projectTemplate;
    if (templateName) {
        // 根据模板名称查找模板链接
        let findResult = template.find((item) => item.name === templateName);
        projectTemplate = findResult ? findResult.value : undefined;
    }
    // 如果用户在创建指令中 指定了项目名称 则不进行相应询问
    if (!project_name) {
        let { projectName } = await inquirer.prompt({
            type: "input", // 定义问题类型
            name: "projectName", // 定义答案的key 用以获取对应配置选择 进行对应处理
            message: "请输入项目名称：", // 问题内容
        });
        project_name = projectName;
    }
    // 如果用户在创建指令中 指定了项目模板类型 则不进行相应询问
    if (!projectTemplate) {
        let { templateName } = await inquirer.prompt({
            type: "list",
            name: "templateName",
            message: "请选择模块：",
            choices: templateList,
        });
        projectTemplate = templateName;
    }
    // 目标文件夹 = 用户命令行所在目录 + 项目名称 
    // process.cwd()——当前命令执行所在的目录
    const dest = path.join(process.cwd(), project_name);
    if (fs.existsSync(dest)) {
        const { toCoverage } = await inquirer.prompt({
            type: "confirm",
            name: "toCoverage",
            message: "当前目录已存在，是否覆盖",
        });
        // 如果用户确认覆盖 则删除对应文件夹 反之退出进程
        toCoverage ? fs.removeSync(dest) : process.exit(1);
    }

    const loading = ora(`模板加载中...`).start();
    // downloadGitRepo(项目远程地址 github/gitee/gitlab仓库地址, 模板文件存放地址，回调函数)
    downloadGitRepo(projectTemplate, dest, (err) => {
        if (err) return loading.fail("创建模板失败：" + err.message);
        loading.succeed(`模板创建成功！`);
        console.log(chalk.greenBright(`\n1. cd ${project_name}\n`));
        console.log(chalk.greenBright(`2. npm i \n`));
        console.log(chalk.greenBright(`3. 执行启动命令 \n`));
    });
}

async function handleGetTemplate() {
    const loading = ora("获取模板列表中...\n");
    loading.start();
    const templateList = await getGitReposList("PlutoCharon0");
    loading.succeed('模板列表获取成功！')
    // ✨
    return templateList
}

module.exports = {
    createProject,
    handleGetTemplate
};
