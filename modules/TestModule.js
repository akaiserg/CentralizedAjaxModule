
 /**
 * TestModule uses AjaxModule to make HTTP request and   it shows  the response inside  a  div.
 *
 * DEPENDENCIES
 * JQUERY
 */

/**
 * Constructor
 * @param ajaxModule    {Module} Module  which handles ajax calls.
 * @param oConfigIdHtml {Object} Object with the  html ids  of  buttons and the div  that displays the response. The attributes are idJsonBtn, idHtmlBtn, id401Btn, id500btn and idDisplayDiv.
 * @param oConfigUrls   {Object} Object with the  urls  to request and the methods  that will be used. The attributes are urlJson:{url:,method:}, urlHtml:{url:,method:} and url401:{url:, method:}, url500:{url:,method:}.
 * @constructor
 */
var TestModule= function (ajaxModule,oConfigIdHtml,oConfigUrls){

    /**
     * Module  which handles ajax calls.
     * @property __ajaxModule
     * @type {Module}
     * @private
     */
    var __ajaxModule=null;

    /**
     * This method  sets  up  the parameters  passed through  the constructor.
     * @method  __setUpModule
     * @param ajaxModule    {Module} AjaxModule.
     * @param oConfigIdHtml {Object} Object with the ids.
     * @param oConfigUrls   {Object} Object with the urls.
     * @private
     */
    var __setUpModule= function(ajaxModule,oConfigIdHtml,oConfigUrls){

        __ajaxModule=ajaxModule;
        __loadAction(oConfigIdHtml,oConfigUrls);

    };

    /**
     * Sets the actions of each button.
     * @method  __loadAction
     * @param oConfigIdHtml {Object} Object with the ids.
     * @param oConfigUrls   {Object} Object with the urls.
     * @private
     */
    var __loadAction=function(oConfigIdHtml,oConfigUrls){

        // The function __showRequest is passed as a parameter.
        $("#"+oConfigIdHtml.idJsonBtn).click(function(){
            __executeCall(__showRequest,oConfigIdHtml.idDisplayDiv,oConfigUrls.urlJson);
        });

        $("#"+oConfigIdHtml.idHtmlBtn).click(function(){
            __executeCall(__showRequest,oConfigIdHtml.idDisplayDiv,oConfigUrls.urlHtml);
        });

        $("#"+oConfigIdHtml.id401Btn).click(function(){
            __executeCall(__showRequest,oConfigIdHtml.idDisplayDiv,oConfigUrls.url401);
        });

        $("#"+oConfigIdHtml.id500btn).click(function(){
            __executeCall(__showRequest,oConfigIdHtml.idDisplayDiv,oConfigUrls.url500);
        });

    };


    /**
     *  This method utilizes the AjaxModule to  make the  request.
     * @method  __executeCall
     * @param showFunction {Function} function   that will show the response.
     * @param idDivDisplay {String} Id of the div  where the response will be shown.
     * @param oRequest     {Object} This object has one of the sub-objects of the parameter passed through the constructor. Format {url:,method:}.
     * @private
     */
    var __executeCall= function(showFunction, idDivDisplay,oRequest ){

        var promise= __ajaxModule[oRequest.method](oRequest.url,oRequest.data);
        showFunction("Requesting data....",idDivDisplay);
        promise.then(function(data) {
            console.info(data);
            showFunction(JSON.stringify(data),idDivDisplay);

        });

    };


    /**
     * Shows data on a specific div.
     * @method  __showRequest
     * @param dataToShow   {String} Data to show.
     * @param idDivDisplay {String} Div's id where the data will be displayed.
     * @private
     */
    var __showRequest= function(dataToShow,idDivDisplay){

        var divDisplay=$("#"+idDivDisplay);
        divDisplay.removeClass("hide");
        divDisplay.html("<b>Response:</b> "+dataToShow);

    };

    /**
     * This method is executed after the  constructor  was called and  initializes the setup.
     */
    __setUpModule(ajaxModule,oConfigIdHtml,oConfigUrls);

};
