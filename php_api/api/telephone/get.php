<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
include("../../configuration/config.php");

$phone = @$_GET['phone'];

$return['id'] = '';
$return['code'] = 200;
$return['status'] = "Success";
$return['text'] = "Load Success.";
$back_sql = $sql->prepare("SELECT * FROM ".$mssql_db_user.".dbo.PhoneSearch2DB WHERE Phone = :phone");
$back_sql->BindParam(":phone", $phone);
$back_sql->execute();
$back = $back_sql->fetch(PDO::FETCH_ASSOC);
if($back) {
    $return['value'] = $back;
    $return['comment'] = '';
    echo json_encode($return, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
} else {
    $return = array(
        'id' => '',
        'code' => 500,
        'status' => "Error",
        'text' => "Error: Database Error."
    );
    echo json_encode($return);
    exit();
}
?>