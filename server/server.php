<?php
// Getting the  body of the request
$requestBody=file_get_contents('php://input');
// Getting the  method of the request
$requestMethod=$_SERVER["REQUEST_METHOD"];
// Checks what kind of response will be sent
if(isset($_GET["tr"])){
    // delay of  2 seconds
    sleep(2);
    switch($_GET["tr"]){
        // Returns Json
        case 'rJson':
        {
            $aReturnData= array();
            $aReturnData["method"]=$requestMethod;
            $aReturnData["body"]  =$requestBody;
            $aReturnData["status"]="ok";
            $data=array();
            for($iCont=0;$iCont<5;$iCont++){
                $data[$iCont]="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1";
            }
            $aReturnData["data"]=$data;
            header('Content-Type: application/json');
            echo  json_encode($aReturnData);
        }
        break;
        // Returns HTML
        case 'rHtml':
        {
            echo "<html><body>login</body></html>";
        }
        break;
        // Returns 500 Error
        case 'r500':
        {
            header("HTTP/1.1 500 Internal Server Error");
        }
        break;
        // Returns 401 Error
        case 'r401':
        {
            header ( "HTTP/1.0 401 Unauthorized" );
        }
        break;
        default:
        {
            $aReturnData= array();
            $aReturnData["method"]=$requestMethod;
            $aReturnData["body"]  =$requestBody;
            $aReturnData["status"]="error";
            $aReturnData["msj"]="The value of tr was not defined correctly.";
            header('Content-Type: application/json');
            echo  json_encode($aReturnData);
        }

    }
// Returns a message when it was not used the parameter tr on the URL
}else{
    $aReturnData= array();
    $aReturnData["method"]=$requestMethod;
    $aReturnData["body"]  =$requestBody;
    $aReturnData["status"]="error";
    $aReturnData["msj"]="Parameter tr was not defined.";
    header('Content-Type: application/json');
    echo  json_encode($aReturnData);
}
exit();