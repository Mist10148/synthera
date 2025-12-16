<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Synthera: Home</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <script>
        (function() {
            // Map themes to your uploaded .jpg files
            const backgrounds = {
                'dark': 'dark-mode-bg.jpg',
                'theme-light': 'light-mode-bg.jpg',
                'theme-bahay': 'bahay-kubo-bg.jpg',
                'theme-dost': 'dost-bg.jpg'
            };

            const savedTheme = localStorage.getItem('syntheraTheme') || 'dark';
            
            // 1. Apply the Theme Class (for colors)
            if (savedTheme && savedTheme !== 'dark') {
                document.body.classList.add(savedTheme);
            }

            // 2. Apply the Background Image (Manually)
            const bgFile = backgrounds[savedTheme] || 'dark-mode-bg.jpg';
            document.body.style.backgroundImage = `url('${bgFile}')`;
        })();
    </script>

    <nav class="site-nav">
        <div class="logo">
            <a href="index.php">
                <img src="logo.png" alt="Synthera Logo"> 
            </a>
        </div>
        
        <div class="nav-links">
            <a href="index.php" class="nav-link" style="color:var(--accent);">Home</a>
            <a href="about.php" class="nav-link">About</a>
            
            <select id="theme-select" class="theme-select" onchange="changeTheme(this.value)">
                <option value="dark">Dark Mode (Default)</option>
                <option value="theme-light">Light Mode</option>
                <option value="theme-bahay">Bahay Kubo</option>
                <option value="theme-dost">Modern DOST</option>
            </select>

            <?php if(isset($_SESSION['user_id'])): ?>
                <a href="lab.php" class="btn-primary" style="margin-left: 20px;">Enter Lab</a>
                <a href="logout.php" class="nav-link">Logout</a>
            <?php else: ?>
                <a href="login.php" class="nav-link">Login</a>
                <a href="register.php" class="btn-primary" style="margin-left: 20px;">Sign Up</a>
            <?php endif; ?>
        </div>
    </nav>

    <div class="page-container">
        <h1 class="hero-title">Virtual Science.<br>Real Results.</h1>
        <p class="hero-text">Experience advanced chemistry and physics simulations in a safe, virtual environment. Choose your preferred lab theme above.</p>
        
        <?php if(isset($_SESSION['user_id'])): ?>
            <a href="lab.php" class="btn-primary" style="padding: 15px 40px; font-size: 1.2rem;">Go to Workbench</a>
        <?php else: ?>
            <a href="register.php" class="btn-primary" style="padding: 15px 40px; font-size: 1.2rem;">Get Started</a>
        <?php endif; ?>
    </div>

    <script>
        const currentTheme = localStorage.getItem('syntheraTheme') || 'dark';
        document.getElementById('theme-select').value = currentTheme;

        function changeTheme(themeName) {
            // Update Classes
            document.body.classList.remove('theme-light', 'theme-bahay', 'theme-dost');
            if (themeName !== 'dark') {
                document.body.classList.add(themeName);
            }
            
            // Update Background Image Immediately
            const backgrounds = {
                'dark': 'dark-mode-bg.jpg',
                'theme-light': 'light-mode-bg.jpg',
                'theme-bahay': 'bahay-kubo-bg.jpg',
                'theme-dost': 'dost-bg.jpg'
            };
            const bgFile = backgrounds[themeName] || 'dark-mode-bg.jpg';
            document.body.style.backgroundImage = `url('${bgFile}')`;

            // Save
            localStorage.setItem('syntheraTheme', themeName);
        }
    </script>
</body>
</html>