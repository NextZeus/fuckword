# fuckword

### method

### check name contains fuck word

```javascript

var fuckword = require('fuckword');
var name = 'fuck';
var isIllegal = fuckword.checkNameIllegal(name);
if(isIllegal){
    console.log('name contains fuck word');
}

```

### transfer content` word which contains fuck word  to *
```javascript

var fuckword = require('fuckword');
var name = 'fuck you !!!!';
var transferedContent = fuckword.transferChatContent(name,"*");

console.log('transferedContent is :',transferedContent);
//the result is -->>>transferedContent is :***k you !!!
```
