var fs=require("fs");
var ipfsClient= require("ipfs-http-client")
var Web3=require("web3")
var web3=new Web3("http://localhost:8545");
var ipfs = ipfsClient.create("http://localhost:5001");
var express= require("express");
var upload=require("express-fileupload");
var app=express();
var path=require("path");
const { strict } = require("assert");
const { off } = require("process");
const {performance}=require("perf_hooks");
app.use(express.static('client'))
app.use(express.static('static'))
const readline = require("readline");
var contractins=new web3.eth.Contract([
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
	}
],"0xe774bc1544ec42567DdB2F468984D3cB23D2d0B5")


app.use(express.json());
app.use(upload());


app.get("/",(req,res)=>{
	res.sendFile(path.join(__dirname,'index.html'));
})


app.post("/",async (req,res)=>{
	if(req.files)
	{
		let name;
		let names="";
		let hashs="";
		let fileadded;
		let i=0;
		if(req.files.fileUpload.length==undefined)
		{
			req.files.fileUpload=[req.files.fileUpload];
		}
		for( i=0;i<req.files.fileUpload.length;i++)
		{
			name=req.files.fileUpload[i].name;
			console.log(name);
			if(!(name.endsWith(".jpg") || name.endsWith(".mp4") || name.endsWith(".mkv") || name.endsWith(".mp3") || name.endsWith(".png") || name.endsWith(".pdf")))
				break;
			names=names+String.fromCharCode(name.length)+name;
		}
		
		if(i==req.files.fileUpload.length)
		{
			for(i=0;i<req.files.fileUpload.length;i++)	
			{
				fileadded = await ipfs.add({path: req.files.fileUpload[i].name, content: req.files.fileUpload[i].data});
				console.log(fileadded);
				hashs=hashs+fileadded.cid.toString();
			}
			console.log(hashs);
			const coinbase=await web3.eth.getCoinbase().then(res=>res);
		
			try
			{
			await contractins.methods.addipfshash(hashs,names,req.files.fileUpload.length,req.body.public=="on").send({from: coinbase,gas:4172387 }).then(function(res){
				console.log(res);
			});
			}catch(error)
			{
				console.log(error);
			}
		}
	}
	

   res.redirect("/");
})


app.get("/searchfiles",(req,res)=>{
	res.sendFile(path.join(__dirname,'filesview.html'));
})


app.get("/getfiles", async (req,res)=>{
	let time=0,protime=0;
	const {substring,max}= req.query;
	if(substring.length=="" || max<=0)
	{
		res.status(200).json({"links":[]});
	}
	else
	{	
		var t0=performance.now();
		const coinbase=await web3.eth.getCoinbase().then(res=>res);
		const {Hashs,Num,FileTypes,Names}= await contractins.methods.getipfshashs(substring,max).call({"from":coinbase},function(err,res){
			return res;
		});
		var t1=performance.now();
		protime+=(t1-t0);
		let hash;
		let filetype;
		let chunks=[];
		let retlist=[];
		let retname=[];
		let name;
		let offset=0;
		const directory = 'static';
		let filesize=0;
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
			offset+=Names.charCodeAt(offset)+1;	
			filetype=FileTypes.substr(i*4,4);
			hash=Hashs.substr(i*46,46);
			chunks=[];
			t0=performance.now();
			for await (chunk of ipfs.cat(hash))
			{
				chunks.push(chunk);
			}
			t1=performance.now();
			time+=(t1-t0);
			chunks=Buffer.concat(chunks);
			filesize+=chunks.length
			fs.writeFile('./static/'+hash+filetype,chunks, function (err) {
				if (err) return console.log(err);
			});
			retlist.push(hash+filetype);
			retname.push(name+filetype);
		}
		
		fs.appendFile("./res/protime.txt",protime+"\n",function (err) {
			if (err) return console.log(err);
		});
		fs.appendFile("./res/time.txt",time+"\n",function (err) {
			if (err) return console.log(err);
		});
		fs.writeFile("./res/size.txt",filesize+"\n",function (err) {
			if (err) return console.log(err);
		});
		console.log(protime,time);
		res.status(200).json({"links":retlist,"names":retname});
	}
})



app.get("/results",async (req,res)=>{
	let readable = fs.createReadStream("./res/protime.txt");
	let reader = readline.createInterface({ input: readable });
	
	  let i=0;
	  let protime=0,time=0;
	for await( line of reader )
	{
	  if(i>0)
	  {
		  protime+=parseFloat(line);
	  }
	  i++;
	}
	protime=protime/(i-1);
	reader.close();
	readable.close();
  
	 readable = fs.createReadStream("./res/time.txt");
	 reader = readline.createInterface({ input: readable });
	
	  i=0;
	for await( line of reader )
	{
	  if(i>0)
	  {
		  time+=parseFloat(line);
	  }
	  i++;
	}
	console.log(time,i);
	time=time/(i-1);
	reader.close();
	readable.close();
  
	let filesize;
	readable = fs.createReadStream("./res/size.txt");
	 reader = readline.createInterface({ input: readable });
	
	  i=0;
	for await( line of reader )
	{
		filesize=parseFloat(line);
	}
	reader.close();
	readable.close();
  
	res.status(200).json({protime,time,filesize});


})



app.listen(3000,(e)=>{
    console.log("listinening at port 3000!!!");
})


