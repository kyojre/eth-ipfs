# eth-ipfs
https://blog.csdn.net/kyojre/article/details/86768871

安装
```shell
npm install
# 配置部署网络
vim truffle-config.js
# 编译合约
truffle compile
# 部署合约
truffle migrate --network rospten
cd client
npm install
```
启动项目
```shell
ipfs init
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"
ipfs daemon

cd client
npm run start
```
访问localhost:3000。
