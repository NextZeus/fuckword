/**
 * Created by lixd on 16/8/22.
 */
var fuckwordModel = require('../model/fuckword');

var isIllegal = fuckwordModel.checkNameIllegal('毛泽东');
if(isIllegal){
    console.error('fuck word is illegal');
} else {
    console.log('this word is legal');
}

var content = fuckwordModel.transferChatContent('fuck you !!!',"*");
console.log(content);