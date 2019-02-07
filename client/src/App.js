import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import ipfsAPI from "ipfs-api";

import "./App.css";

const ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'});

let saveImageOnIpfs = (reader) => {
	return new Promise(function (resolve, reject) {
		const buffer = Buffer.from(reader.result);
		ipfs.add(buffer).then((response) => {
			console.log(response);
			resolve(response[0].hash);
		}).catch((err) => {
			console.error(err);
			reject(err);
		})
	})
}

class App extends Component {
	state = {
		web3: null,
		accounts: null,
		contract: null,
		hash: "",
		writeOK: false,
		response: "",
	};

	componentDidMount = async () => {
		try {
			const web3 = await getWeb3();
			const accounts = await web3.eth.getAccounts();
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = SimpleStorageContract.networks[networkId];
			const instance = new web3.eth.Contract(
				SimpleStorageContract.abi,
				deployedNetwork && deployedNetwork.address,
			);
			this.setState({ web3, accounts, contract: instance });
		} catch (error) {
			alert(
				`Failed to load web3, accounts, or contract. Check console for details.`,
			);
			console.error(error);
		}
	};

	upload = async (info) => {
		console.log("info", info)
		let reader = new FileReader()
		reader.readAsArrayBuffer(info)
		console.log("reader", reader)
		console.log("reader.result", reader.result) //null
		reader.onloadend = () => {
			console.log("reader", reader)
			console.log("reader.result", reader.result)
			saveImageOnIpfs(reader).then((hash) => {
				console.log("hash", hash)
				this.setState({hash})
			})
		}
	};

	saveHashToEth = async () => {
		let {contract, hash, accounts} = this.state;
		try {
    			await contract.methods.set(hash).send({from: accounts[0]});
			console.log('writeOK:', true)
			this.setState({writeOK: true})
		}
		catch(e) {
			console.log(e)
			this.setState({writeOK: false})
			console.log('writeOK :', false)
		}
	}

	getHashFromEth = async () => {
		let {contract} = this.state
		try {
			let response = await contract.methods.get().call();
			console.log('response:', response)
			this.setState({response})
		}
		catch (e) {
			console.log(e)
		}
	}

	render() {
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		let {hash, writeOK, response} = this.state
		return (
			<div>
				<h2>请上传图片</h2>
				<div>
					<input type='file' ref="fileid"/>
					<button onClick={() => this.upload(this.refs.fileid.files[0])}>点击我上传到ipfs
					</button>
					{
						hash && <h2>图片已经上传到ipfs: {hash}</h2>
					}
					{
						hash && <button onClick={() => this.saveHashToEth()}>点击我上传到以太坊</button>
					}
					{
						writeOK && <button onClick={() => this.getHashFromEth()}>点击我获取图片</button>
					}
					{
						response &&
						<div>
							浏览器访问结果:{"http://localhost:8080/ipfs/" + response}
							<img src={"http://localhost:8080/ipfs/" + response}/>
						</div>
					}
				</div>
			</div>
		);
	}
}

export default App;
