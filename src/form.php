<?

function send_message($name, $email, $message) {
	$to  = "trepven@yandex.ru";
	$subject = "Вениамин, с тобой хотят связаться"; 
	$message = '
		<p>Имя: <strong>' . $name . '</strong></p>
		<p>Email: <strong>' . $email . '</strong></p>
		<p>Сообщение: <strong>' . $message . '</strong></p>
	';

	$headers  = "Content-type: text/html; charset=utf-8 \r\n"; 
	$headers .= "From: Benjamin Trepachko <trepven@yandex.ru>\r\n";
	$headers .= "Reply-To: " . $email . "\r\n"; 

	mail($to, $subject, $message, $headers); 
}

send_message($_POST['name'], $_POST['email'], $_POST['message']);

?>