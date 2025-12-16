<?php
session_start();
require 'db.php'; // Connect to your existing database file

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get data from the form
    $fullname = $_POST['fullname'];
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Basic Validation
    if (empty($fullname) || empty($username) || empty($password)) {
        die("Please fill all fields.");
    }

    // Check if username already exists
    $stmt = $pdo->prepare("SELECT user_id FROM users WHERE username = ?");
    $stmt->execute([$username]);

    if ($stmt->rowCount() > 0) {
        die("Username already taken. Please go back and try another.");
    }

    // Secure the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert into database
    // Note: I am using the column names shown in your previous video (full_name, username, password_hash)
    $sql = "INSERT INTO users (full_name, username, password_hash) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    try {
        if ($stmt->execute([$fullname, $username, $hashed_password])) {
            // Success! Redirect to login page
            header("Location: login.php");
            exit();
        } else {
            echo "Registration failed.";
        }
    } catch (PDOException $e) {
        echo "Database Error: " . $e->getMessage();
    }
}
?>