/**
 * AjaxModule  can handle  all the ajax calls  that  are made on a webpage.
 * As it has a function   as  a constructor, this module can be instanced many times
 * every time  a  request  is made the module returns a promise  that will  be resolved after  analysing  the response  gotten  from  the server called.
 *
 * DEPENDENCIES
 * JQUERY
 */
var AjaxModule=(function (){


    /**
     * has all the  requests   and responses done on the system.
     * @property  __dataHistoryRequest
     * @type {Array}
     * @private
     */
    var __dataHistoryRequest=Array();


    /**
     *  This method registers every request.
     * @method  __registerInfoRequest
     * @param urlRequest {String} URL  of te  request.
     * @param dataToSend  {String}  Data which be sent through the request.
     * @returns           {number} Unique id to identify the request.
     * @private
     */
    var __registerInfoRequest=function(urlRequest,dataToSend){

        __dataHistoryRequest.push(
            {
                id:__dataHistoryRequest.length, // Unique id. The first one is 0
                url:urlRequest,                 // URL
                dataSent:dataToSend,            // Data to send
                responseStatus: null,           // null for now, until the response is gotten
                responseData:null,              // null for now, until the response is gotten
                responseCode:null               // null for now, until the response is gotten
            }
        )
        return (__dataHistoryRequest.length -1);// it has  -1 because  __dataHistoryRequest  already has data

    };

    /**
     * This method is called once the response was analized.
     * @method  __registerInfoRequest
     * @param idUniqueRequest {Integer} Unique id of the request.
     * @param responseObject  {Object}  The object which was made with the data.
     * @private
     */
    var __registerInfoResponse=function(idUniqueRequest,responseObject){

        __dataHistoryRequest[idUniqueRequest].responseStatus=responseObject.status;
        __dataHistoryRequest[idUniqueRequest].responseData=responseObject.data;
        __dataHistoryRequest[idUniqueRequest].responseCode=responseObject.code;
        //console.info(__dataHistoryRequest);

    };


    /**
     *  Returns the deferred.
     * @returns {$.Deferred} Jquery's deferred.
     * @private
     */
    var __newDeferred= function(){

        return  new $.Deferred();

    };


    /**
     * Handles the ajax can send data to the server.
     * Call with Jquery's implementation.
     * @method __ajaxCallWithData
     * @param url         {String} Url to request.
     * @param typeRequest {String} It can be POST,PUT,DELETE,GET.
     * @param dataToSend  {Object} data to send.
     * @returns           {Object} the promise
     * @private
     */
    var  __ajaxCallWithData= function(url,typeRequest,dataToSend){

        var deferred= __newDeferred();
        $.ajax({
            url         : url,
            async       : true,
            type        : typeRequest,
            contentType : "application/json",
            data        : JSON.stringify(dataToSend),
            success     : deferred.resolve, // Promise's resolve
            error       : deferred.resolve  // Promise's resolve
        });
        return deferred.promise();

    };


    /**
     * Handles the ajax without sending data to the server.
     * Call with Jquery's implementation.
     * @method __ajaxCallWithData
     * @param url         {String} Url to request.
     * @param typeRequest {String} It can be POST,PUT,DELETE,GET.
     * @returns           {Object} the promise
     * @private
     */
    var  __ajaxCallWithoutData= function(url,typeRequest){

        var deferred= __newDeferred();
        $.ajax({
            url         : url,
            async       : true,
            type        : typeRequest,
            contentType : "application/json",
            success     : deferred.resolve,
            error       : deferred.resolve
        });
        return deferred.promise();

    };


    /**
     * This method defines which Ajax method should be called(request  which  send data in the request  or  doesn't).
     * Besides it returns a promise which will be delivered to  the  module  that  made the request.
     * @param urlRequest        {String} Url to request.
     * @param dataToSend        {Object}  Data, if it exists, which will be sent   with the request.
     * @param uniqueIdRequest   {Integer} Unique id of the request.
     * @param callMethod Method {String} GET, PUT, DELETE, POST
     * @returns                 {Object} A promise
     * @private
     */
    var __requestMethod= function(urlRequest,dataToSend,uniqueIdRequest,callMethod){

        var promise= null;
        if(dataToSend!= null){
            promise= __ajaxCallWithData(urlRequest,callMethod,dataToSend);
        }else{
            promise= __ajaxCallWithoutData(urlRequest,callMethod);
        }
        return promise.then(function(dataResponse,textStatusResponse,rawResponse) {
            var internalStatusCode=__analizeStatusResponse(dataResponse,rawResponse);
            return __setResponse(internalStatusCode,dataResponse,uniqueIdRequest);
        });

    };


    /**
     * Sets up the response gotten from the server and makes  the  object which  will be returned.
     * @param internalStatusCode {String}  Code of each possibility status code.
     * @param rawResponseData    {Object} Raw data  gotten from the server.
     * @param idUniqueRequest    {Integer} Unique id of the request.
     * @returns                  {Object} data to be delivered.
     * @private
     */
    var __setResponse=function(internalStatusCode,rawResponseData,idUniqueRequest){

        var oReturn={};
        oReturn.idRequest=idUniqueRequest;
        switch(internalStatusCode){
            case '500_error':
                oReturn.status=-1;
                oReturn.data=null;
                oReturn.code=500;
                break;
            case '401_error':
                oReturn.status=-1;
                oReturn.data=null;
                oReturn.code=401;
                break;
            case '200_json':
                oReturn.status=1;
                oReturn.data=rawResponseData;
                oReturn.code=200;
                break;
            case '200_noJson':
                oReturn.status=0;
                oReturn.data=null;
                oReturn.code=200;
                break;
            case '0_error':
                oReturn.status=-1;
                oReturn.data=null;
                oReturn.code=0;
                break;
        }
        __registerInfoResponse(idUniqueRequest,oReturn);
        return oReturn;

    };


    /**
     * This method analyzes  the status  of  the response. The status is taken from the  raw data when
     *  the status is ok and  from the data response when  occurred an error.
     * @param dataResponse    {Object} Data response that was gotten form the server.
     * @param rawDataResponse {Object} Raw data that was gotten form the server.
     * @returns               {String}  an internal status.
     * @private
     */
    var __analizeStatusResponse=function(dataResponse,rawDataResponse){

        var status=null;
        if (typeof(rawDataResponse.status) !== 'undefined'){
            status= rawDataResponse.status;
        }else{
            status= dataResponse.status;
        }
        switch(status){
            case 500:
                return "500_error";
                break;
            case 401:
                return "401_error";
                break;
            case 200:
                return __analizeResponseText(rawDataResponse.responseText);
                break;
            default :
                return "0_error";
                break;
        }

    };

    /**
     * Takes the response and  checks if it is a JSON object then makes a status code for a 200 status.
     * @param responseText {String} Data  from the server.
     * @returns            {string} The status of  the data  which was gotten.
     * @private
     */
     var __analizeResponseText=function(responseText){

         if(__isJsonString(responseText)){
             return "200_json";
         }else{
             return "200_noJson";
         }

     };

    /**
     * Checks if the String is a  JSON  well made.
     * @param text {String} String to check.
     * @returns    {boolean}
     * @private
     */
    var __isJsonString=function (text) {
        try {
            JSON.parse(text);
        } catch (e) {
            return false;
        }
        return true;
    };


    /**
     * Constructor of the module.  This  function is returns every time  the module is called   whit  the new operator.
     * @constructor
      */
      function  constructor(){

        /**
         * Handles the POST request.
         * @param urlRequest {String} Url to request.
         * @param dataToSend {Object} Data, if it exists, which will be sent   with the request.
         * @returns {Object} A promise
         */
        this.post= function(urlRequest,dataToSend){

            urlRequest=urlRequest || null;
            dataToSend=dataToSend  || null;
            var uniqueIdRequest=__registerInfoRequest(urlRequest,dataToSend);
            return __requestMethod(urlRequest,dataToSend,uniqueIdRequest,"POST");

        };

        /**
         * Handles the GET request.
         * @param urlRequest {String} Url to request.
         * @param dataToSend {Object} Data, if it exists, which will be sent   with the request.
         * @returns {Object} A promise
         */
        this.get= function(urlRequest,dataToSend){

            urlRequest=urlRequest || null;
            dataToSend=dataToSend  || null;
            var uniqueIdRequest=__registerInfoRequest(urlRequest,dataToSend);
            return __requestMethod(urlRequest,dataToSend,uniqueIdRequest,"GET");

        };

        /**
         * Handles the PUT request.
         * @param urlRequest {String} Url to request.
         * @param dataToSend {Object} Data, if it exists, which will be sent   with the request.
         * @returns {Object} A promise
         */
        this.put= function(urlRequest,dataToSend){

            urlRequest=urlRequest || null;
            dataToSend=dataToSend  || null;
            var uniqueIdRequest=__registerInfoRequest(urlRequest,dataToSend);
            return __requestMethod(urlRequest,dataToSend,uniqueIdRequest,"PUT");

        };

        /**
         * Handles the DELETE request.
         * @param urlRequest {String} Url to request.
         * @param dataToSend {Object} Data, if it exists, which will be sent   with the request.
         * @returns {Object} A promise
         */
        this.delete= function(urlRequest,dataToSend){

            urlRequest=urlRequest || null;
            dataToSend=dataToSend  || null;
            var uniqueIdRequest=__registerInfoRequest(urlRequest,dataToSend);
            return __requestMethod(urlRequest,dataToSend,uniqueIdRequest,"DELETE");

        };

      }
      //Returns the constructor
      return  constructor;

    })();