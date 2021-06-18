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

    function addipfshash(string hashs,string names,uint num) public{
        bytes memory Names=bytes(names);
        bytes memory Hashs=bytes(hashs);
        require(Hashs.length==num*46 && Names.length>0);
        
        uint i=0;
        uint offset=0;
        uint size=0;
        string memory hash;
        string memory name;
        string memory filetype;
        
        for(i=0;i<num;i++)
        {
            size=uint(Names[offset]);
            require(offset+1+size<=Names.length);
            hash=string(getsubstr(Hashs,i*46,46));
            name=string(getsubstr(Names,offset+1,size-4));
            filetype=string(getsubstr(Names,offset+size-3,4));
            var owners=owner[hash];
            if(owners.length==0)
                owners.push(msg.sender);
            ipfshash.push(hashName(hash,name,filetype));
            offset+=size+1;
        }
    }
    
    function getsubstr(bytes str,uint offset,uint size) pure public returns (bytes){
        bytes memory ret=new bytes(size);
        uint i=0;
        for(i=0;i<size;i++)
        {
            ret[i]=str[offset+i];
        }
        return ret;
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
            offset+=vars.temp.length+1;
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
    
    

    
}