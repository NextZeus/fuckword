/**
 * Created by lixd on 16/8/22.
 */
var fuckwordModel = require('../model/fuckword');

var isIllegal = fuckwordModel.checkNickNameIllegal('fuc');
console.log('isiiiii',isIllegal);
if(isIllegal){
    console.error('fuck word is illegal');
} else {
    console.log('this word is legal');
}