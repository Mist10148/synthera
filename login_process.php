<?php
session_start();
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // 1. Check if user exists in the database
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    // 2. Verify the password
    // (We use password_verify because we used password_hash during registration)
    if ($user && password_verify($password, $user['password_hash'])) {
        
        // Success! Save user info in the session
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['full_name'] = $user['full_name'];

        // Redirect to the dashboard/home page
        header("Location: index.php");
        exit();
    } else {
        // Failed login
        echo "Invalid username or password. <a href='login.php'>Try again</a>";
    }
}
?>