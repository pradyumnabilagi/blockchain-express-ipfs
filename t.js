var fs=require("fs");
const readline=require("readline");
var i=90.8879;

async function t()
{
    const readable = fs.createReadStream("./res/protime.txt");
  const reader = readline.createInterface({ input: readable });
  
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
  time=time/(i-1);
  reader.close();
  readable.close();



}


t();
