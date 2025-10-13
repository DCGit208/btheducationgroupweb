<?php
// /api/send.php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ---------- Basic Headers ----------
header('Content-Type: application/json; charset=utf-8');
// If your forms live on the same domain you can restrict CORS to that origin
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method Not Allowed']);
  exit;
}

// ---------- Simple honeypot to deter bots ----------
$hp = $_POST['hp_url'] ?? '';
if (!empty($hp)) {
  // Pretend success
  echo json_encode(['ok' => true, 'message' => 'Thanks!']);
  exit;
}

// ---------- Helpers ----------
function clean($v): string { return trim((string)$v); }
function cleanEmail($v): string {
  $v = trim((string)$v);
  return filter_var($v, FILTER_VALIDATE_EMAIL) ? $v : '';
}
function limit($v, $max = 5000): string {
  $v = (string)$v;
  return mb_substr($v, 0, $max, 'UTF-8');
}

// ---------- Normalize fields ----------
$formType = clean($_POST['form_type'] ?? '');          // 'course_contact' | 'support'
$name     = limit(clean($_POST['Name'] ?? $_POST['name'] ?? ''), 200);
$email    = cleanEmail($_POST['Email'] ?? $_POST['email'] ?? '');
$phone    = limit(clean($_POST['Phone'] ?? $_POST['phone'] ?? ''), 50);
$message  = limit(clean($_POST['Message'] ?? $_POST['message'] ?? ''), 5000);

// Course-contact extras
$vendor   = limit(clean($_POST['Vendor'] ?? ''), 120);
$course   = limit(clean($_POST['Course'] ?? ''), 200);
$urgency  = limit(clean($_POST['Urgency'] ?? ''), 120);

// Support extras
$topic    = limit(clean($_POST['Topic'] ?? ''), 120);

// ---------- Validate ----------
$errors = [];
if ($name === '')  { $errors[] = 'Name is required.'; }
if ($email === '') { $errors[] = 'Valid email is required.'; }
if ($formType === 'course_contact') {
  if ($vendor === '') { $errors[] = 'Vendor is required.'; }
  if ($course === '') { $errors[] = 'Course is required.'; }
} elseif ($formType === 'support') {
  if ($topic === '') { $errors[] = 'Topic is required.'; }
} else {
  $errors[] = 'Unknown form type.';
}

if ($errors) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'errors' => $errors]);
  exit;
}

// ---------- Routing ----------
$toEmail = 'coursesupport@btheducationgroup.org';
$subject = 'Support Inquiry';

if ($formType === 'course_contact') {
  $toEmail = 'course_info@btheducationgroup.org';
  $subject = 'Course Inquiry';
}
if ($formType === 'support' && $topic) {
  $subject = "Support: {$topic}";
}
if ($formType === 'course_contact') {
  $v = $vendor ?: 'Vendor';
  $c = $course ?: 'Course';
  $subject = "Course Inquiry: {$v} — {$c}";
}

// ---------- Build message ----------
$rows = [];
$rows[] = "<strong>Name:</strong> " . htmlspecialchars($name);
$rows[] = "<strong>Email:</strong> " . htmlspecialchars($email);
if ($phone)   $rows[] = "<strong>Phone:</strong> " . htmlspecialchars($phone);

if ($formType === 'course_contact') {
  if ($vendor)  $rows[] = "<strong>Vendor:</strong> " . htmlspecialchars($vendor);
  if ($course)  $rows[] = "<strong>Course/Certification:</strong> " . htmlspecialchars($course);
  if ($urgency) $rows[] = "<strong>Urgency:</strong> " . htmlspecialchars($urgency);
}
if ($formType === 'support') {
  if ($topic)   $rows[] = "<strong>Topic:</strong> " . htmlspecialchars($topic);
}

if ($message) {
  $rows[] = "<strong>Message:</strong><br>" . nl2br(htmlspecialchars($message));
}

$bodyHtml = implode('<br>', $rows);
$bodyText = strip_tags(str_replace('<br>', "\n", $bodyHtml));

// ---------- PHPMailer ----------
require __DIR__ . '/phpmailer/Exception.php';
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';

$mail = new PHPMailer(true);

try {
  // SMTP (iPage)
  $mail->isSMTP();
  $mail->Host       = 'smtp.ipage.com';
  $mail->SMTPAuth   = true;
  $mail->Username   = 'info@btheducationgroup.org';
  $mail->Password   = 'ORG@Info33';
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // 'tls'
  $mail->Port       = 587;

  // (Optional) SSL relax for older hosts/certs
  $mail->SMTPOptions = [
    'ssl' => [
      'verify_peer'       => false,
      'verify_peer_name'  => false,
      'allow_self_signed' => true,
    ],
  ];

  // From / To
  $mail->setFrom('info@btheducationgroup.org', 'BTH Education Group');
  $mail->addAddress($toEmail);
  if ($email) {
    $mail->addReplyTo($email, $name ?: $email);
  }

  // Content
  $mail->isHTML(true);
  $mail->Subject = $subject;
  $mail->Body    = $bodyHtml;
  $mail->AltBody = $bodyText;

  // Send
  $mail->send();

  echo json_encode(['ok' => true, 'message' => 'Message sent successfully.']);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Mailer error: ' . $mail->ErrorInfo]);
}