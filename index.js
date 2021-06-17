var fs=require("fs");
var ipfsClient= require("ipfs-http-client")
var Web3=require("web3")
var web3=new Web3("http://localhost:8546");
var ipfs = ipfsClient.create("http://localhost:5001");
var express= require("express");
var upload=require("express-fileupload");
var app=express();
var path=require("path");
const { strict } = require("assert");
const { off } = require("process");

app.use(express.static('client'))
app.use(express.static('static'))

var contractins=new web3.eth.Contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "hash",
				"type": "string"
			},
			{
				"name": "name",
				"type": "string"
			}
		],
		"name": "addipfshash",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "hash",
				"type": "string"
			},
			{
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "addOwner",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "hash",
				"type": "string"
			}
		],
		"name": "removeSelf",
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
	},
	{
		"constant": true,
		"inputs": [],
		"name": "test",
		"outputs": [
			{
				"name": "",
				"type": "bytes"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
],"0x952120f2c81f19c67131fB4e1ab059E5A365758C")



app.use(express.json());
app.use(upload());


app.get("/",(req,res)=>{
	res.sendFile(path.join(__dirname,'index.html'));
})


app.post("/",async (req,res)=>{
   if(req.files)
   {    
       try{
       const name=req.files.fileUpload.name;
       const coinbase=await web3.eth.getCoinbase().then(res=>res);
       const content=req.files.fileUpload.data;
       if(name.endsWith(".jpg") || name.endsWith(".mp4") || name.endsWith(".mkv") || name.endsWith(".mp3") || name.endsWith(".png") || name.endsWith(".pdf"))
        {
            const fileadded =await ipfs.add({path: name,content: content});
			console.log(fileadded);
                await contractins.methods.addipfshash(fileadded.cid.toString(),name).send({from: coinbase,gas: 900000}).then(function(res){
                    console.log(res);
                });
        }
    }catch(error){
        console.log(error);
        res.redirect("/");
    }
    }
   res.redirect("/");
})


app.get("/searchfiles",(req,res)=>{
	res.sendFile(path.join(__dirname,'filesview.html'));
})


app.get("/getfiles", async (req,res)=>{

	const {substring,max}= req.query;
	if(substring.length=="" || max<=0)
	{
		res.status(200).json({"links":[]});
	}
	else
	{	const coinbase=await web3.eth.getCoinbase().then(res=>res);
		const {Hashs,Num,FileTypes,Names}= await contractins.methods.getipfshashs(substring,max).call({"from":coinbase},function(err,res){
			return res;
		});
		let hash;
		let filetype;
		let chunks=[];
		let retlist=[];
		let retname=[];
		let name;
		let offset=0;
		const directory = 'static';

		fs.readdir(directory, (err, files) => {
			if (err) throw err;

			for (const file of files) {
				fs.unlink(path.join(directory, file), err => {
				if (err) throw err;
				});
			}
		});

		for(let i=0;i<Num;i++)
		{
			name=Names.substr(offset+1,Names.charCodeAt(offset));
			offset+=Names.charCodeAt(offset);	
			filetype=FileTypes.substr(i*4,4);
			hash=Hashs.substr(i*46,46);
			chunks=[];
			for await (chunk of ipfs.cat(hash))
			{
				chunks.push(chunk);
			}
			chunks=Buffer.concat(chunks);
			fs.writeFile('./static/'+hash+filetype,chunks, function (err) {
				if (err) return console.log(err);
			});
			retlist.push(hash+filetype);
			retname.push(name+filetype);
		}

		res.status(200).json({"links":retlist,"names":retname});
	}
})




app.listen(3000,(e)=>{
    console.log("listinening at port 3000!!!");
})


