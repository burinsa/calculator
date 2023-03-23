<?php
// Файлы phpmailer

require '/wp-includes/PHPMailer/PHPMailer.php';
require '/wp-includes/PHPMailer/SMTP.php';
require '/wp-includes/PHPMailer/Exception.php';

// Переменные, которые отправляет пользователь
$name = $_POST['name'];
// $email = $_POST['email'];
$text = $_POST["comment"];
// $file = $_FILES['myfile'];
$tel = $_POST["tel"];
$nameRoyal = $_POST["piano_name"];
$addressFrom = $_POST["from"];
$floorFrom = $_POST["floor-from"];
$elevatorFrom = "Нет";
$houseFrom = "Нет";

if (isset($_POST["elevator-from"])) {
  $elevatorFrom = "Да";
}

if (isset($_POST["house-from"])) {
  $houseFrom = "Да";
}


$apartFrom = $_POST["apart-1"];
$entranceFrom = $_POST["entr-1"];
$domofonFrom = $_POST["domofon-1"];

$addressTo = $_POST["to"];
$floorTo = $_POST["floor-to"];
$elevatorTo = "Нет";
$houseTo = "Нет";

if (isset($_POST["elevator-to"])) {
  $elevatorTo = 'Да';
}

if (isset($_POST["house-to"])) {
  $houseTo = "Да";
}

$apartTo = $_POST["apart-2"];
$entranceTo = $_POST["entr-2"];
$domofonTo = $_POST["domofon-2"];

$date = $_POST["data"];
$time1 = $_POST["time-1"];
$time2 = $_POST["time-2"];

$totalSum = $_POST["total_sum"];



// Формирование самого письма
$title = $_POST["forte_type"];
$body = "
<h2> $title </h2>
<b>Имя:</b> $name<br>
<b>Телефон:</b> $tel<br><br>
<b>Имя рояля:</b> $nameRoyal<br>
<b>Забрать от сюда:</b> $addressFrom <br>
<b>Этаж:</b> $floorFrom<br>
<b>Квартира:</b> $apartFrom<br>
<b>Подъезд:</b> $entranceFrom<br>
<b>Домофон:</b> $domofonFrom<br>
<b>Лифт:</b> $elevatorFrom<br>
<b>Частный дом:</b> $houseFrom<br><br>

<b>Везём сюда:</b> $addressTo <br>
<b>Этаж:</b> $floorTo<br>
<b>Квартира:</b> $apartTo<br>
<b>Подъезд:</b> $entranceTo<br>
<b>Домофон:</b> $domofonTo<br>
<b>Лифт:</b> $elevatorTo<br>
<b>Частный дом:</b> $houseTo<br>

<b>Дата доставки:</b> $date<br>
<b>Время с:</b> $time1<br>
<b>Время по:</b> $time2<br><br>

<b>Cумма предварительного расчёта:</b> $totalSum<br><br>

<b>Коментарии:</b><br>$text <br>
";

// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer();
try {
    $mail->isSMTP();   
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth   = true;
    // $mail->SMTPDebug = 2;
    $mail->Debugoutput = function($str, $level) {$GLOBALS['status'][] = $str;};

    // Настройки вашей почты
    $mail->Host       = 'smtp.yandex.ru'; // SMTP сервера вашей почты
    $mail->Username   = 'burinsa'; // Логин на почте
    $mail->Password   = 'setapjukdliuteas'; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;
    $mail->setFrom('burinsa@yandex.ru', 'Имя отправителя'); // Адрес самой почты и имя отправителя

    // Получатель письма
    $mail->addAddress('burinsa@yandex.ru');  
    // $mail->addAddress('youremail@gmail.com'); // Ещё один, если нужен

    // Прикрипление файлов к письму
// if (!empty($file['name'][0])) {
//     for ($ct = 0; $ct < count($file['tmp_name']); $ct++) {
//         $uploadfile = tempnam(sys_get_temp_dir(), sha1($file['name'][$ct]));
//         $filename = $file['name'][$ct];
//         if (move_uploaded_file($file['tmp_name'][$ct], $uploadfile)) {
//             $mail->addAttachment($uploadfile, $filename);
//             $rfile[] = "Файл $filename прикреплён";
//         } else {
//             $rfile[] = "Не удалось прикрепить файл $filename";
//         }
//     }   
// }
// Отправка сообщения
$mail->isHTML(true);
$mail->Subject = $title;
$mail->Body = $body;    

// Проверяем отравленность сообщения
if ($mail->send()) {$result = "success";} 
else {$result = "error";}

} catch (Exception $e) {
    $result = "error";
    $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}

// Отображение результата
echo json_encode(["result" => $result, "resultfile" => $rfile, "status" => $status]);

var_dump($_POST);

