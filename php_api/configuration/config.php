<?php
header('Access-Control-Allow-Origin: *');
header('Access-control-expose-headers: Authorization');
header('Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
ini_set('memory_limit', '-1');
error_reporting(E_ALL);
// SQL Server
$mssql_host    =    "WIN-O1ENO9N1SAK"; // ชื่อโฮส SQL
$mssql_user    =    "sa"; // ชื่อยูสเซอร์ SQL
$mssql_pass    =    "P@ssw0rd"; // รหัสผ่าน SQL
$mssql_db_user    =    "CIADB"; // ชื่อฐานข้อมูลที่ใช้เก็บ User
$mssql_db_info    =    "ciadb"; // ชื่อฐานข้อมูลที่ใช้เก็บข้อมูลอื่นๆ

// TABLE
$tbl["census"] = '[ciadb].[dbo].[CENSUS]';
$tbl["carall"] = "[ciadb].[dbo].[CARWHOLE_CLEAN]";
$tbl["customer"] = "[ciadb].[dbo].[CUSTOMERDATA]";
$tbl["SSDB"] = "[ciadb].[dbo].[SSDB]";
$tbl['company'] = '[ciadb].[dbo].[Company]';
$tbl['carclean'] = '[ciadb].[dbo].[CarWhole_clean]';
$tbl['bikeall'] = '[CIABike].[dbo].[BikeAll]';

///////////////////// ห้ามแก้ไข //////////////////
#คำสั่งเชื่อมต่อฐานข้อมูล
date_default_timezone_set('Asia/Bangkok');
$sql = new PDO("sqlsrv:server=" . $mssql_host . ";Database=" . $mssql_db_user, $mssql_user, $mssql_pass);
include_once("function.php");
$api = new API(true);
$datetimes = date("Y-m-d H:i:s");


// print_r($_SERVER);exit();
if (strpos($_SERVER['PHP_SELF'], 'userLogin.php')) {
    if ($api->updateAuthorization($_GET['email']) === false) {
        $return = array(
            'id' => $memberId,
            'code' => 500,
            'status' => "Error",
            'text' => "Error: Can't Access Site."
        );
        echo json_encode($return);
        exit();
    }
} else {
    $headers = apache_request_headers();
    // print_r( $headers);
    // exit();
    if ($headers['Authorization']) {
        $tokenEncrypt = base64_decode(explode(" ", $headers['Authorization'])[1]);
        $getToken = explode(":", $tokenEncrypt)[1];
        $token = $api->authorization($getToken);
        if ($token === false) {
            $return = array(
                'id' => $memberId,
                'code' => 500,
                'status' => "Error",
                'text' => "Error: Invalid token. Please Login again."
            );
            echo json_encode($return);
            exit();
        } else if ($token === 'expire') {
            $return = array(
                'id' => $memberId,
                'code' => 500,
                'status' => "Error",
                'text' => "Error: Token expire."
            );
            echo json_encode($return);
            exit();
        } else {
            $api->updateAuthorizationExpire($getToken);
        }
    } else {
        echo "Access Denied.";
        exit();
    }
}
