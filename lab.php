<?php
session_start();
// Optional: Redirect if not logged in
// if (!isset($_SESSION['user_id'])) { header("Location: login.php"); exit; }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Synthera: Lab</title>
    <link rel="stylesheet" href="style.css?v=7">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
        <script>
        (function() {
            const savedTheme = localStorage.getItem('syntheraTheme');
            const classes = savedTheme && savedTheme !== 'dark'
            ? 'lab-page ' + savedTheme
            : 'lab-page';

            // ✅ wait for body to exist
            document.addEventListener("DOMContentLoaded", () => {
            document.body.className = classes;
            });
        })();
        </script>


</head>
<body class="lab-page">

    <div id="mission-overlay" class="overlay-container hidden">
        <div class="mission-dossier">
            <div class="dossier-header">
                <h2>Laboratory Protocol</h2>
                <button class="close-btn" onclick="toggleMissionOverlay()">×</button>
            </div>
            <div class="dossier-body">
                <h1 id="briefing-title">Loading...</h1>
                <p id="briefing-desc">Initializing...</p>
                <div class="objectives-box">
                    <strong>Procedure:</strong>
                    <ul id="briefing-steps"></ul>
                </div>
            </div>
            <div class="dossier-footer">
                <button class="modal-btn accept-btn" onclick="startMission()" id="start-mission-btn">Begin</button>
            </div>
        </div>
    </div>

    <div id="mission-select-modal" class="overlay-container hidden">
        <div class="mission-dossier">
            <div class="dossier-header">
                <h2>Select Protocol</h2>
                <button class="close-btn" onclick="closeMissionSelect()">×</button>
            </div>
            <div class="dossier-body">
                <p>Choose an experiment:</p>
                <div class="mission-grid" id="mission-grid"></div>
            </div>
        </div>
    </div>

    <div id="error-modal" class="overlay-container hidden">
        <div class="error-card">
            <i class="fa-solid fa-triangle-exclamation error-icon"></i>
            <h1>PROTOCOL FAILED</h1>
            <p id="error-message">Unknown Error.</p>
            <button class="modal-btn retry-btn" onclick="startMission()">RESET WORKBENCH</button>
        </div>
    </div>

    <div id="success-modal" class="overlay-container hidden">
        <div class="success-card">
            <div class="rank-badge" id="rank-badge">A</div>
            <h1>SUCCESS</h1>
            <div class="stats-grid">
                <div class="stat-box"><span>Result</span><strong id="final-product">-</strong></div>
            </div>
            <div style="display:flex; gap:10px; margin-top:20px;">
                <button class="modal-btn" style="background:#555; flex:1;" onclick="stayInSandbox()">Stay</button>
                <button class="modal-btn next-level-btn" style="flex:2;" onclick="loadNextMission()">NEXT MISSION</button>
            </div>
        </div>
    </div>

    <div id="lab-interface" class="interface-blur">
        <nav class="site-nav">
            <div class="logo">
                <a href="index.php" class="logo">
                    <img src="logo.png" alt="Synthera Logo">
                    <span class="logo-text">Synthera.</span>
                </a>
            </div>
            
            <div class="nav-controls">
                <select id="theme-selector" class="theme-select" onchange="setTheme(this.value)">
                    <option value="dark">Dark Mode (Default)</option>
                    <option value="theme-light">Light Mode</option>
                    <option value="theme-bahay">Bahay Kubo</option>
                </select>

                <a href="index.php" style="text-decoration:none;">
                    <button class="control-btn"><i class="fa-solid fa-house"></i> Home</button>
                </a>
                <button class="control-btn btn-protocol" onclick="toggleMissionOverlay()">
                    <i class="fa-solid fa-clipboard-list"></i> Info
                </button>
                <button class="control-btn" onclick="openMissionSelect()">Protocols</button>
                <button class="control-btn" onclick="restartMission()">Replay</button>
                <a href="logout.php" style="text-decoration:none;">
                    <button class="control-btn btn-logout">Logout</button>
                </a>
            </div>
        </nav>

        <div class="main-layout">
            <div class="sidebar">
                <div class="category"><h3>Glassware</h3><div id="list-glassware" class="tool-grid"></div></div>
                <div class="category"><h3>Hardware</h3><div id="list-hardware" class="tool-grid"></div></div>
                <div class="category"><h3>Chemicals</h3><div id="list-chemicals" class="tool-grid"></div></div>
                <div class="category"><h3>Solids</h3><div id="list-solids" class="tool-grid"></div></div>
            </div>

            <div class="workbench-container">
                <div class="workbench" id="bench" ondrop="drop(event)" ondragover="allowDrop(event)">
                    <div class="bench-label">BENCH 01</div>
                    <div class="trash-zone"><i class="fa-solid fa-trash-can"></i></div>
                </div>
            </div>

            

            <div class="sidebar-right">
                <div class="report-header">Live Report</div>
                <div id="live-log"></div>
                <button class="control-btn btn-end" onclick="endExperiment()">End Experiment</button>
            </div>
        </div>
    </div>

            <!-- 🆕 Floating draggable orb -->
        <div id="float-orb" class="float-orb" title="Assistant">
        <i class="fa-solid fa-comment-dots"></i>
        </div>

        <!-- 🆕 AI Chatbox Overlay (keep it under body so animation math is correct) -->
        <div id="ai-chat-overlay" class="ai-chat-overlay hidden">
        <div id="ai-chatbox" class="ai-chatbox">
            <div class="ai-topbar">
            <div class="ai-top-left">
                <div class="ai-avatar"></div>
                <div class="ai-title-wrap">
                <div class="ai-title">Chat with us!</div>
                <div class="ai-status"><span class="ai-dot"></span>We’re online!</div>
                </div>
            </div>

            <div class="ai-top-actions">
                <button class="ai-icon-btn" title="Menu">⋮</button>
                <button class="ai-icon-btn" title="Close" onclick="closeAIChat()">×</button>
            </div>
            </div>

                <div class="ai-body">
                <div class="ai-card-media"></div>

                <!-- ✅ New messages list container -->
                <div id="ai-chat-messages" class="ai-messages">
                    <div class="ai-bubble bot">
                    Hello! This lab protocol can be started now. What do you want to do?
                    </div>

                    <div class="ai-quick">
                    <button class="ai-chip">Protocol 1</button>
                    <button class="ai-chip">Protocol 2</button>
                    <button class="ai-chip">Help</button>
                    </div>
                </div>
                </div>


            <div class="ai-footer">
                <input id="ai-chat-input" class="ai-textbox" type="text" placeholder="Enter your message..." />
                <button id="ai-chat-send" class="ai-send" aria-label="Send" type="button">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>


            <div class="ai-powered">POWERED BY <strong>Synthera</strong></div>
        </div>
        </div>


    <script src="script.js"></script>

    <script>
        const currentTheme = localStorage.getItem('syntheraTheme') || 'dark';
        document.getElementById('theme-selector').value = currentTheme;
    </script>
</body>
</html>