var fs = require('fs');
var fuckwords;
var fuckwordArray;

fs.readFile('../fuckword2016.txt','utf8', function (err,data) {
    //console.log(err,data);
    if(!err && !!data){
        fuckwords = data;
        fuckwordArray = fuckwords.split('、');
        console.log(fuckwordArray[0],fuckwordArray.length);
        fs.writeFileSync('../forbid.json',JSON.stringify(fuckwordArray));
    }
});