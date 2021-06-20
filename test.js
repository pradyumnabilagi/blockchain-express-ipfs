
var Web3=require("web3")
var web3=new Web3("http://localhost:8545");

var contractins=new web3.eth.Contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "hashs",
				"type": "string"
			},
			{
				"name": "names",
				"type": "string"
			},
			{
				"name": "num",
				"type": "uint256"
			},
			{
				"name": "ispublic",
				"type": "bool"
			}
		],
		"name": "addipfshash",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "j",
				"type": "uint256"
			}
		],
		"name": "getipfshash",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "j",
				"type": "uint256"
			}
		],
		"name": "getipfshashname",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "subname",
				"type": "string"
			},
			{
				"name": "maxlen",
				"type": "uint256"
			}
		],
		"name": "getipfshashs",
		"outputs": [
			{
				"name": "Hashs",
				"type": "string"
			},
			{
				"name": "Num",
				"type": "uint256"
			},
			{
				"name": "FileTypes",
				"type": "string"
			},
			{
				"name": "Names",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getipfsnum",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
],"0xc03Ff4c56E3b64A9f4867371c8EeF886E6822EcE")

async function test()
{
    let name="";
    name=name+String.fromCharCode(25)+"benefits-of-pineapple.jpg";
    const coinbase=await web3.eth.getCoinbase().then(res=>res);
	const {Hashs,Num,FileTypes,Names}= await contractins.methods.getipfshashs("pineapple",3).call({"from":coinbase},function(err,res){
		return res;
	});
    console.log(Hashs);

    
}

test();