<?php
session_start();
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        // Redirects to HOME, not Lab
        header("Location: index.php"); 
        exit;
    } else {
        $error = "Invalid username or password.";
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
            <h2>Access Terminal</h2>
            <?php if(isset($error)) echo "<p style='color:#e84118'>$error</p>"; ?>
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
            <p>New User? <a href="register.php">Sign Up</a></p>
        </form>
    </div>
</body>
</html>