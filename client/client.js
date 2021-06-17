var axios=require("axios");


var substring=document.getElementById("substring");
var maxfiles=document.getElementById("max");
var linklist=document.getElementById("links");
document.getElementById("search").addEventListener("click",async ()=>{
    if(max.value==0)
        max.value=0;
    const result = await axios.get("/getfiles?substring="+substring.value+"&max="+maxfiles.value).then(res=>res);
    
    while( linklist.firstChild ){
        linklist.removeChild( linklist.firstChild );
    }
    for(let i=0;i<result.data.links.length;i++)
    {
        let li=document.createElement("li");
        let a=document.createElement("a");
        a.appendChild(document.createTextNode(result.data.names[i]));
        a.href="/"+result.data.links[i];
        li.appendChild(a);
        linklist.appendChild(li);
    }
})  