// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.4.18;


contract Greeting {

    struct hashName{
        string hash;
        string name;
        string filetype;
    }

    mapping(string => address[]) owner;   
    hashName[] ipfshash;

    function addipfshash(string hash,string name) public{
        require(bytes(name).length>0);
        bytes memory temp=bytes(name);
        bytes memory filetype=new bytes(4);
        filetype[0]=temp[temp.length-4];
        filetype[1]=temp[temp.length-3];
        filetype[2]=temp[temp.length-2];
        filetype[3]=temp[temp.length-1];
        
        require(bytes(hash).length==46 && owner[hash].length==0  );
        
        bytes memory Name=new bytes(temp.length-4);
        for(uint j=0;j<temp.length-4;j++)
        {
            Name[j]=temp[j];
        }
        
        var owneraddrs= owner[hash];
        owneraddrs.push(msg.sender);
        ipfshash.push(hashName(hash,string(Name),string(filetype)));
    }
    
    function getipfsnum() view public returns (uint256){
        return ipfshash.length;
    }
  
    function isSubstr(string str,string substr) pure private returns (bool){
        bytes memory Str=bytes(str);
        bytes memory SubStr=bytes(substr);
        if(SubStr.length==0)
            return false;
       uint j=0;
       for(uint i=0;i<Str.length-SubStr.length+1;i++)
       {
           
           for( j=0;j<SubStr.length;j++)
           {
                if(Str[i+j]!=SubStr[j])
                    break;
           }
           if(j==SubStr.length)
                return true;
       }
        return false;
    }
    
    function getipfshash(uint j) view public returns (string){
        return ipfshash[j].hash;
    } 
    
    function getipfshashname(uint j) view public returns (string){
        return ipfshash[j].name;
    } 
  
    struct funcvars{
        uint[]  selindices;
        bytes hashs;
        bytes filetypes;
        bytes temp1;
        bytes temp;
        uint num;
        uint namelen;
    }
    
    
    function getipfshashs(string subname,uint maxlen) view public returns (string Hashs,uint Num,string FileTypes ,string Names){
        string memory tdata="";
        funcvars memory  vars= funcvars(new uint[](maxlen),new bytes(maxlen*46),new bytes(maxlen*4),bytes(tdata),bytes(tdata),0,0);
        uint i=0;
        uint j=0;
        while(i<ipfshash.length && vars.num<maxlen )
        {
            
            if(isSubstr(ipfshash[i].name,subname))
            {
                j=0;
                var owners=owner[ipfshash[i].hash];
                while(j<owners.length)
                {
                    if(owners[j]==msg.sender)
                        break;
                    j++;
                }
                if(j<owners.length)
                {
                    vars.namelen+=bytes(ipfshash[i].name).length;
                    vars.temp1=bytes(ipfshash[i].hash);
                    vars.temp=bytes(ipfshash[i].filetype);
                    vars.selindices[vars.num]=i;
                    for(uint k=0;k<46;k++)
                    {
                        vars.hashs[vars.num*46+k]=vars.temp1[k];
                    }
                    for(k=0;k<4;k++)
                    {
                        vars.filetypes[vars.num*4+k]=vars.temp[k];
                    }
                    vars.num++;
                }
            }
            i++;
        }
        
        bytes memory names=new bytes(vars.namelen+vars.num);
        uint offset=0;
        
        for(i=0;i<vars.num;i++)
        {
            vars.temp=bytes(ipfshash[vars.selindices[i]].name);
            names[offset]=byte(vars.temp.length);
            for(j=0;j<vars.temp.length;j++)
            {
                names[offset+j+1]=vars.temp[j];
            }
            offset+=vars.temp.length;
        }
        
        
        return (string(vars.hashs),vars.num,string(vars.filetypes),string(names));
    }
    
    
   function addOwner(string hash,address newOwner) public {
       uint i=0;
       var owners=owner[hash];
       bool isgood;
       for(i=0;i<owners.length;i++)
       {
           if(owners[i]==msg.sender)
                break;
       }
       isgood=(i<owners.length);
       require(isgood);
       owners.push(newOwner);
   }
  
  
    function removeSelf(string hash) public{
        uint i=0;
        var owners=owner[hash];
        bool isgood;
        for(i=0;i<owners.length;i++)
        {
            if(owners[i]==msg.sender)
                break;
        }
        isgood=(i<owners.length);
        require(isgood);
        owners[i]=owners[owners.length-1];
        delete owners[owners.length-1];
    }
    
    
    function test() pure public returns (bytes){
       
        bytes memory t=new bytes(3);
        t[0]=byte(2);
        t[1]=byte(3);
        t[2]=byte(4);
        return t;
    }
    
}