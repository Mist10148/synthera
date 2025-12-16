<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Synthera: Register</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="with-bg">
    <script>
        (function() {
            const savedTheme = localStorage.getItem('syntheraTheme');
            if (savedTheme && savedTheme !== 'dark') {
                document.body.classList.add(savedTheme);
            }
        })();
    </script>

    <nav class="site-nav">
        <div class="logo">
            <a href="index.php" class="logo">
                <img src="logo.png" alt="Synthera Logo"> 
                <span class="logo-text">Synthera.</span>
            </a>
        </div>
        <div class="nav-links">
            <a href="index.php" class="nav-link">Home</a>
            <select id="theme-select" class="theme-select" onchange="changeTheme(this.value)">
                <option value="dark">Dark Mode (Default)</option>
                <option value="theme-light">Light Mode</option>
                <option value="theme-bahay">Bahay Kubo</option>
            </select>
        </div>
    </nav>

    <div class="auth-wrapper">
        <div class="auth-card">
            <div class="auth-header">
                <h2>Join Synthera</h2>
                <p>Create your virtual lab pass</p>
            </div>
            
            <form action="register_process.php" method="POST">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullname" placeholder="John Doe" required>
                </div>

                <div class="form-group">
                    <label>Username</label>
                    <input type="text" name="username" placeholder="Choose a username" required>
                </div>
                
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Create a strong password" required>
                </div>
                
                <button type="submit" class="btn-primary btn-block">Initialize Account</button>
            </form>
            
            <div class="auth-footer">
                <p>Already have an ID? <a href="login.php">Login Here</a></p>
            </div>
        </div>
    </div>

    <script>
        const currentTheme = localStorage.getItem('syntheraTheme') || 'dark';
        document.getElementById('theme-select').value = currentTheme;

        function changeTheme(themeName) {
            document.body.classList.remove('theme-light', 'theme-bahay', 'theme-dost');
            if (themeName !== 'dark') {
                document.body.classList.add(themeName);
            }
            
            const backgrounds = {
                'dark': 'dark-mode-bg.jpg',
                'theme-light': 'light-mode-bg.jpg',
                'theme-bahay': 'bahay-kubo-bg.jpg'
            };
            const bgFile = backgrounds[themeName] || 'dark-mode-bg.jpg';
            document.body.style.backgroundImage = `url('${bgFile}')`;

            localStorage.setItem('syntheraTheme', themeName);
        }
    </script>
</body>
</html>