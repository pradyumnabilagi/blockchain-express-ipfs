
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
],"0xBe5ca14819edFC19a34CF36e7Efe2C23435369d6")

async function test()
{
    let name="";
    name=name+String.fromCharCode(5)+"a.jpg";
    const coinbase=await web3.eth.getCoinbase().then(res=>res);
	try{
    await contractins.methods.addipfshash("1234567890123456789012345678901234567890123456",name,1,true).send({from: coinbase,gas:4172387 }).then(function(res){
        console.log(res);
    })
    }catch(error)
    {
        console.log(error);
        console.log("okman");
    }  
    console.log("okman");

    
}

test();