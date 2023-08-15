const axios = require("axios").default;
const chalk = require("chalk");
const templateRexg = /--template/g
async function getGitReposList(username) {
    return new Promise(async (resolve, reject) => {
        try {
            let { data } = await axios.get(
                `https://api.github.com/users/${username}/repos`
            );
            data = data
                .filter((item) => templateRexg.test(item.name))
                .map((item) => ({
                    name: item.name,
                    value: `https://github.com:${username}/${item.name}`,
                }));
            resolve(data);
        } catch (error) {
            console.log(chalk.red(`模板列表获取失败 ${error.message}`));
            process.exit(1);
        }
    });
}

module.exports = {
    getGitReposList,
};
