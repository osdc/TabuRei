document.getElementById("elem").addEventListener("click" , getelement);

function getelement(){
        let s = document.getElementById("importform").value;
        let groups = s.split("\n\n")
        var numofgroup = groups.length;
        for(i = 0; i < numofgroup; i++){

        var group = groups[i].split("\n");
        var grouplength = group.length; 
        var grouplist = [];
                for(j = 0; j < grouplength; j++){
        
                var temp  = group[j].split("|");
                grouplist.push({url:temp[0], title:temp[1]})
                };       
                console.log(grouplist);
                storeTabs(grouplist, [])
        };

}




