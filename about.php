<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Synthera: About</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <script>
        (function() {
            const backgrounds = {
                'dark': 'dark-mode-bg.jpg',
                'theme-light': 'light-mode-bg.jpg',
                'theme-bahay': 'bahay-kubo-bg.jpg',
                'theme-dost': 'dost-bg.jpg'
            };
            const savedTheme = localStorage.getItem('syntheraTheme') || 'dark';
            
            if (savedTheme && savedTheme !== 'dark') {
                document.body.classList.add(savedTheme);
            }
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
            <a href="index.php" class="nav-link">Home</a>
            <a href="about.php" class="nav-link" style="color:var(--accent);">About</a>
            
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
        <div class="about-box">
            <h1 style="color: var(--accent);">Cultural Science Archive</h1>
            <p>Integrating Philippine Heritage with Modern Science.</p>
            
            <div class="archive-grid">
                <div class="archive-card">
                    <i class="fa-solid fa-water archive-icon"></i>
                    <h3>Banaue Rice Terraces</h3>
                    <p>Ancient hydraulic engineering demonstrating mastery of irrigation and soil conservation.</p>
                </div>
                <div class="archive-card">
                    <i class="fa-solid fa-leaf archive-icon"></i>
                    <h3>Herbal Medicine</h3>
                    <p>Traditional use of Lagundi and Sambong, now recognized by science.</p>
                </div>
                <div class="archive-card">
                    <i class="fa-solid fa-ship archive-icon"></i>
                    <h3>The Bangka</h3>
                    <p>Outrigger canoes evolved for stability in the rough Philippine seas.</p>
                </div>
                <div class="archive-card">
                    <i class="fa-solid fa-user-doctor archive-icon"></i>
                    <h3>Fe del Mundo</h3>
                    <p>National Scientist who invented the makeshift bamboo incubator.</p>
                </div>
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
                'theme-bahay': 'bahay-kubo-bg.jpg',
                'theme-dost': 'dost-bg.jpg'
            };
            const bgFile = backgrounds[themeName] || 'dark-mode-bg.jpg';
            document.body.style.backgroundImage = `url('${bgFile}')`;

            localStorage.setItem('syntheraTheme', themeName);
        }
    </script>
</body>
</html>