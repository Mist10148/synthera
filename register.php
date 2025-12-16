<?php
session_start();
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$username]);
    
    if ($stmt->rowCount() > 0) {
        $error = "Username already taken.";
    } else {
        $hashed = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        if ($stmt->execute([$username, $hashed])) {
            $_SESSION['user_id'] = $pdo->lastInsertId();
            $_SESSION['username'] = $username;
            // Redirects to HOME
            header("Location: index.php");
            exit;
        } else {
            $error = "Registration failed.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Synthera</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        // Apply saved theme immediately on load
        (function() {
            const savedTheme = localStorage.getItem('syntheraTheme');
            if (savedTheme) {
                document.body.className = savedTheme;
                // If we are on the lab page, ensure lab-theme is added too
                if(window.location.pathname.includes('lab.php')) {
                    document.body.classList.add('lab-theme');
                }
            } else {
                // Default behavior if no theme saved
                if(window.location.pathname.includes('lab.php')) {
                    document.body.className = 'lab-theme';
                }
            }
        })();

        // Function called by the dropdown
        function changeTheme(theme) {
            localStorage.setItem('syntheraTheme', theme);
            document.body.className = theme;
            if(window.location.pathname.includes('lab.php')) {
                document.body.classList.add('lab-theme');
            }
        }
    </script>
</head>
<body>
    <nav class="site-nav">
        <div class="logo">Synthera</div>
        <a href="index.php">Back to Home</a>
    </nav>

    <div class="page-container">
        <form class="auth-form" method="POST">
            <h2>Create Account</h2>
            <?php if(isset($error)) echo "<p style='color:#e84118'>$error</p>"; ?>
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Register</button>
            <p>Already have an account? <a href="login.php">Login</a></p>
        </form>
    </div>
</body>
</html>