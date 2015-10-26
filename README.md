# Centralized Ajax Module


By having all the ajax requests handled in one place, you can achieve a standard way to communicate with your services. Besides you can inform to the  modules, which  are using   this AjaxModule,  when a  request failed because  it returned  a 500 or a 401 code.




AjaxModule can deal with :

* JSON response(code 200):  When a json response is detected the general status will be <b>1</b>.
* HTML response(code 200): When a html response is detected the general status will be <b>0</b>.
* Unauthorized(code 401): When the code of the response is 401 it means that a possible  error occurred response, so the general status will be <b>-1</b>.
* Internal Server Error(code 500): When the code of the response is 500 it means that an error occurred, so the general status will be <b>-1</b>.

The general status 0 is important when  you're working, for instance, behind  a CMS. 
A normal CMS  redirects  you  to the login  when the session is gone or shows you  a page which explains you don't have enough privileges. In this case  you can get the response(code 200), but this response is not a json, so you have analyze each response in order to know  which are  json responses. To know if a response  is a json  or  an html, this module analyzes each response which  has  code 200.


```javascript
 var ajaxModule=new AjaxModule();
 var url="server/server.php?tr=rJson";
 var promise=ajaxModule.get(url);
 promise.then(function(data) {
            console.info(data);            
            //Object {idRequest: 1, status: 1, data: Object, code: 200}
            //Object {idRequest: 2, status: 0, data: null, code: 200}
            //Object {idRequest: 3, status: -1, data: null, code: 401}
            //Object {idRequest: 4, status: -1, data: null, code: 500}
        });
 
```

Because this module has a global part,  all the requests  and responses are  saved into a single array. By having this  array, it can be implemented a kind of cache in order to improve   the time response.

<b>Next feature:</b> cache handling.
