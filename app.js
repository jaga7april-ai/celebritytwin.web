/**
 * CelebTwin AI - Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Core Engine Instances
    const analyzer = new window.FaceAnalyzer();
    const sound = window.SoundFX;

    // State Variables
    let currentUserImg = null;
    let cameraStream = null;
    let currentAnalysis = null;
    let hudAnimFrame = null;
    let soundEnabled = true;
    let photoMode = 'real'; // 'real' = photographic celebrity headshots, 'stylized' = vector art

    // DOM Elements
    const uploadInput = document.getElementById('uploadInput');
    const dropzone = document.getElementById('dropzone');
    const selectFileBtn = document.getElementById('selectFileBtn');
    
    // Camera Elements
    const cameraVideo = document.getElementById('cameraVideo');
    const snapBtn = document.getElementById('snapBtn');
    const switchCamBtn = document.getElementById('switchCamBtn');
    const camCountdown = document.getElementById('camCountdown');

    // Samples
    const sampleFacesContainer = document.getElementById('sampleFacesGrid');

    // Filter Controls
    const genderFilter = document.getElementById('genderFilter');
    const categoryFilter = document.getElementById('categoryFilter');

    // Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Scanning Elements
    const scanningSection = document.getElementById('scanningSection');
    const scanUserImg = document.getElementById('scanUserImg');
    const scanHudCanvas = document.getElementById('scanHudCanvas');
    const scanProgressBar = document.getElementById('scanProgressBar');
    const scanStatusText = document.getElementById('scanStatusText');
    const hudGenderIndicator = document.getElementById('hudGenderIndicator');
    const scanSteps = document.querySelectorAll('.scan-steps-list li');

    // Results Elements
    const resultsSection = document.getElementById('resultsSection');
    const matchHeroImg = document.getElementById('matchHeroImg');
    const matchUserImg = document.getElementById('matchUserImg');
    const comparisonOverlay = document.getElementById('comparisonOverlay');
    const comparisonOverlayImg = document.getElementById('comparisonOverlayImg');
    const sliderHandle = document.getElementById('sliderHandle');
    const comparisonSliderBox = document.getElementById('comparisonSliderBox');

    const matchScoreVal = document.getElementById('matchScoreVal');
    const detectedGenderBadge = document.getElementById('detectedGenderBadge');
    const matchName = document.getElementById('matchName');
    const matchKnownFor = document.getElementById('matchKnownFor');
    const matchVibe = document.getElementById('matchVibe');
    const matchQuote = document.getElementById('matchQuote');
    const matchFunFact = document.getElementById('matchFunFact');

    // Breakdown bars
    const barEyes = document.getElementById('barEyes');
    const barJaw = document.getElementById('barJaw');
    const barCheekbones = document.getElementById('barCheekbones');
    const barSmile = document.getElementById('barSmile');

    const scoreEyes = document.getElementById('scoreEyes');
    const scoreJaw = document.getElementById('scoreJaw');
    const scoreCheekbones = document.getElementById('scoreCheekbones');
    const scoreSmile = document.getElementById('scoreSmile');

    // Runners up
    const runnersUpGrid = document.getElementById('runnersUpGrid');

    // Radar & Traits
    const radarCanvas = document.getElementById('radarCanvas');
    const traitsList = document.getElementById('traitsList');

    // Action Buttons
    const downloadCardBtn = document.getElementById('downloadCardBtn');
    const shareBtn = document.getElementById('shareBtn');
    const restartBtn = document.getElementById('restartBtn');

    // Navigation & Modals
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const photoModeToggleBtn = document.getElementById('photoModeToggleBtn');
    const howItWorksBtn = document.getElementById('howItWorksBtn');
    const celebDirectoryBtn = document.getElementById('celebDirectoryBtn');
    const howItWorksModal = document.getElementById('howItWorksModal');
    const celebDirectoryModal = document.getElementById('celebDirectoryModal');
    const celebDirectoryGrid = document.getElementById('celebDirectoryGrid');
    const closeModals = document.querySelectorAll('.close-modal');

    function getCelebImage(celeb) {
        if (!celeb) return "";
        return (photoMode === 'real' && celeb.photoUrl) ? celeb.photoUrl : celeb.avatarSvg;
    }

    /* ==========================================================================
       1. INITIALIZATION & SAMPLES
       ========================================================================== */
    function init() {
        populateSampleFaces();
        populateCelebrityDirectory();
        setupEventListeners();
        setupSplitSlider();
    }

    function populateSampleFaces() {
        if (!window.SAMPLE_FACES || !sampleFacesContainer) return;
        sampleFacesContainer.innerHTML = '';
        window.SAMPLE_FACES.forEach((sample, idx) => {
            const card = document.createElement('div');
            card.className = 'sample-card';
            const initialImgSrc = (photoMode === 'real' && sample.photoUrl) ? sample.photoUrl : sample.fallbackSvg;
            card.innerHTML = `
                <div class="sample-thumb">
                    <img src="${initialImgSrc}" alt="${sample.name}" onerror="if(this.src!=='${sample.fallbackSvg}')this.src='${sample.fallbackSvg}';" />
                </div>
                <div class="sample-name">${sample.name}</div>
                <div class="sample-desc">${sample.desc}</div>
            `;
            card.addEventListener('click', () => {
                sound.click();
                loadSampleImage(sample.photoUrl || sample.fallbackSvg, sample.fallbackSvg);
            });
            sampleFacesContainer.appendChild(card);
        });
    }

    let currentDirCategory = 'all';

    function populateCelebrityDirectory(filterCat = currentDirCategory) {
        if (!window.CELEBRITY_DATABASE || !celebDirectoryGrid) return;
        currentDirCategory = filterCat;
        celebDirectoryGrid.innerHTML = '';

        const list = window.CELEBRITY_DATABASE.filter(celeb => {
            if (filterCat === 'all') return true;
            return celeb.category.toLowerCase() === filterCat.toLowerCase();
        });

        list.forEach(celeb => {
            const card = document.createElement('div');
            card.className = 'celeb-directory-card';
            const imgSrc = getCelebImage(celeb);
            const catClass = 'cat-' + celeb.category.toLowerCase();
            card.innerHTML = `
                <img src="${imgSrc}" alt="${celeb.name}" onerror="if(this.src!=='${celeb.avatarSvg}')this.src='${celeb.avatarSvg}';" />
                <span class="celeb-category-badge ${catClass}">${celeb.category}</span>
                <h4 style="font-size: 0.95rem; font-weight:700; margin-bottom: 0.2rem;">${celeb.name}</h4>
                <div style="font-size: 0.7rem; color: #64748b;">${celeb.knownFor}</div>
            `;
            celebDirectoryGrid.appendChild(card);
        });
    }

    /* ==========================================================================
       2. EVENT LISTENERS & TABS
       ========================================================================== */
    function setupEventListeners() {
        // Photo mode toggle (Real Photos vs Stylized Art)
        if (photoModeToggleBtn) {
            photoModeToggleBtn.addEventListener('click', () => {
                photoMode = (photoMode === 'real') ? 'stylized' : 'real';
                photoModeToggleBtn.innerHTML = (photoMode === 'real') ? '📸 Real Photos' : '🎨 Stylized Art';
                sound.click();
                
                // Refresh directory & sample faces
                populateCelebrityDirectory();
                populateSampleFaces();

                // Refresh current spotlight match if open
                if (currentAnalysis && currentAnalysis.rankings.length > 0) {
                    const top = currentAnalysis.rankings[0];
                    matchHeroImg.src = getCelebImage(top);
                    populateRunnersUp(currentAnalysis.rankings.slice(1, 4));
                }
            });
        }

        // Sound toggle
        soundToggleBtn.addEventListener('click', () => {
            soundEnabled = sound.toggle();
            soundToggleBtn.innerHTML = soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
            if (soundEnabled) sound.click();
        });

        // Tabs switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sound.click();
                const tabId = btn.dataset.tab;
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');

                if (tabId === 'tabCamera') {
                    startCamera();
                } else {
                    stopCamera();
                }
            });
        });

        // File upload trigger
        selectFileBtn.addEventListener('click', () => {
            sound.click();
            uploadInput.click();
        });

        uploadInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
            }
        });

        // Drag & Drop
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });
        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
            }
        });

        // Clipboard Paste Support
        window.addEventListener('paste', (e) => {
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (let item of items) {
                if (item.type.indexOf('image') !== -1) {
                    const blob = item.getAsFile();
                    handleFile(blob);
                    break;
                }
            }
        });

        // Camera snap
        snapBtn.addEventListener('click', captureCameraSnapshot);

        // Modals
        howItWorksBtn.addEventListener('click', () => {
            sound.click();
            howItWorksModal.classList.add('active');
        });
        celebDirectoryBtn.addEventListener('click', () => {
            sound.click();
            celebDirectoryModal.classList.add('active');
        });
        closeModals.forEach(btn => {
            btn.addEventListener('click', () => {
                sound.click();
                howItWorksModal.classList.remove('active');
                celebDirectoryModal.classList.remove('active');
            });
        });

        // Modal backdrop click
        [howItWorksModal, celebDirectoryModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // Directory category tabs
        const dirTabBtns = document.querySelectorAll('.dir-tab-btn');
        dirTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sound.click();
                dirTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                populateCelebrityDirectory(btn.dataset.cat);
            });
        });

        // Restart
        restartBtn.addEventListener('click', () => {
            sound.click();
            resultsSection.style.display = 'none';
            scanningSection.style.display = 'none';
            document.querySelector('.main-card').scrollIntoView({ behavior: 'smooth' });
        });

        // Download VIP Doppelgänger Card
        downloadCardBtn.addEventListener('click', generateDoppelgangerCard);

        // Native Share or Copy
        shareBtn.addEventListener('click', shareResult);
    }

    /* ==========================================================================
       3. CAMERA CAPTURE (WEBCAM)
       ========================================================================== */
    let currentFacingMode = 'user';

    async function startCamera() {
        try {
            if (cameraStream) {
                stopCamera();
            }
            cameraStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: currentFacingMode,
                    width: { ideal: 720 },
                    height: { ideal: 720 }
                },
                audio: false
            });
            cameraVideo.srcObject = cameraStream;
            cameraVideo.play();
        } catch (err) {
            console.warn("Camera access denied or unavailable:", err);
            alert("Could not access camera. Please make sure camera permissions are enabled in your browser.");
        }
    }

    function stopCamera() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
        }
    }

    function captureCameraSnapshot() {
        sound.shutter();
        let count = 3;
        camCountdown.style.display = 'block';
        camCountdown.textContent = count;

        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                sound.scanPulse();
                camCountdown.textContent = count;
            } else {
                clearInterval(interval);
                camCountdown.style.display = 'none';
                takeSnapshot();
            }
        }, 600);
    }

    function takeSnapshot() {
        const snapCanvas = document.createElement('canvas');
        snapCanvas.width = cameraVideo.videoWidth || 640;
        snapCanvas.height = cameraVideo.videoHeight || 480;
        const ctx = snapCanvas.getContext('2d');

        // Mirror snapshot to match live selfie mirror view
        ctx.translate(snapCanvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(cameraVideo, 0, 0, snapCanvas.width, snapCanvas.height);

        stopCamera();
        const dataUrl = snapCanvas.toDataURL('image/jpeg', 0.95);
        const img = new Image();
        img.onload = () => startAnalysisPipeline(img);
        img.src = dataUrl;
    }

    /* ==========================================================================
       4. FILE & SAMPLE IMAGE LOADING
       ========================================================================== */
    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file (JPG, PNG, WEBP).');
            return;
        }
        sound.shutter();
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => startAnalysisPipeline(img);
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function loadSampleImage(src, fallback) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => startAnalysisPipeline(img);
        img.onerror = () => {
            if (fallback && img.src !== fallback) {
                const fallbackImg = new Image();
                fallbackImg.onload = () => startAnalysisPipeline(fallbackImg);
                fallbackImg.src = fallback;
            }
        };
        img.src = src;
    }

    /* ==========================================================================
       5. SCANNING PIPELINE & HUD ANIMATION
       ========================================================================== */
    async function startAnalysisPipeline(img) {
        currentUserImg = img;
        resultsSection.style.display = 'none';
        scanningSection.style.display = 'block';
        scanningSection.scrollIntoView({ behavior: 'smooth' });

        // Set scanning image preview
        scanUserImg.src = img.src;

        // Perform face analysis
        const gFilter = genderFilter.value;
        const cFilter = categoryFilter.value;
        currentAnalysis = await analyzer.analyze(img, {
            genderFilter: gFilter,
            categoryFilter: cFilter
        });

        // Start Biometric Wireframe HUD animation
        startHudAnimation(currentAnalysis.landmarks);

        if (hudGenderIndicator) {
            hudGenderIndicator.style.display = 'none';
            hudGenderIndicator.textContent = '';
        }

        // Sequence of scanning progress
        sound.scanPulse();
        updateScanProgress(20, "Detecting facial boundaries & symmetry...", 0);

        setTimeout(() => {
            sound.scanPulse();
            updateScanProgress(45, "Measuring cheekbone geometry & eye ratios...", 1);
        }, 600);

        setTimeout(() => {
            sound.scanPulse();
            const g = currentAnalysis.detectedGender;
            const icon = g.gender === 'male' ? '👨' : '👩';
            if (hudGenderIndicator) {
                hudGenderIndicator.style.display = 'block';
                hudGenderIndicator.textContent = `⚡ AI Detected Gender: ${icon} ${g.gender.toUpperCase()} (${g.confidence}% Confidence)`;
            }
            updateScanProgress(75, `Identified Gender: ${g.gender.toUpperCase()} (${g.confidence}% Confidence)...`, 2);
        }, 1250);

        setTimeout(() => {
            sound.scanPulse();
            updateScanProgress(95, "Matching 12D vectors against celebrity database...", 3);
        }, 1900);

        setTimeout(() => {
            finishScanning();
        }, 2550);
    }

    function updateScanProgress(pct, status, stepIdx) {
        scanProgressBar.style.width = pct + '%';
        scanStatusText.textContent = status;
        scanSteps.forEach((s, i) => {
            if (i < stepIdx) {
                s.className = 'done';
            } else if (i === stepIdx) {
                s.className = 'active';
            } else {
                s.className = '';
            }
        });
    }

    function startHudAnimation(landmarks) {
        if (hudAnimFrame) cancelAnimationFrame(hudAnimFrame);
        const canvas = scanHudCanvas;
        const ctx = canvas.getContext('2d');
        canvas.width = 320;
        canvas.height = 320;

        let angle = 0;
        const scaleX = 320 / 256;
        const scaleY = 320 / 256;

        function renderHUD() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            angle += 0.04;

            // Draw Face Bounding Box with Cyan Neon
            const b = landmarks.bounds;
            const bx = b.x * scaleX;
            const by = b.y * scaleY;
            const bw = b.width * scaleX;
            const bh = b.height * scaleY;

            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([6, 6]);
            ctx.strokeRect(bx, by, bw, bh);

            // Draw Landmark Wireframe Connections
            ctx.strokeStyle = 'rgba(167, 139, 250, 0.45)';
            ctx.lineWidth = 1;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(landmarks.leftEye.x * scaleX, landmarks.leftEye.y * scaleY);
            ctx.lineTo(landmarks.nose.x * scaleX, landmarks.nose.y * scaleY);
            ctx.lineTo(landmarks.rightEye.x * scaleX, landmarks.rightEye.y * scaleY);
            ctx.lineTo(landmarks.mouth.x * scaleX, landmarks.mouth.y * scaleY);
            ctx.lineTo(landmarks.leftEye.x * scaleX, landmarks.leftEye.y * scaleY);
            ctx.lineTo(landmarks.chin.x * scaleX, landmarks.chin.y * scaleY);
            ctx.lineTo(landmarks.rightEye.x * scaleX, landmarks.rightEye.y * scaleY);
            ctx.stroke();

            // Draw Landmark Tracking Nodes
            const points = [
                landmarks.leftEye, landmarks.rightEye,
                landmarks.leftEyebrow, landmarks.rightEyebrow,
                landmarks.nose, landmarks.mouth, landmarks.chin,
                landmarks.leftCheek, landmarks.rightCheek,
                landmarks.leftJaw, landmarks.rightJaw
            ];

            points.forEach(p => {
                const px = p.x * scaleX;
                const py = p.y * scaleY;
                ctx.fillStyle = '#67e8f9';
                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fill();

                // Outer pulsing ring
                ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
                ctx.beginPath();
                ctx.arc(px, py, 6 + Math.sin(angle * 2) * 2, 0, Math.PI * 2);
                ctx.stroke();
            });

            // Rotating reticle over center
            const cx = landmarks.center.x * scaleX;
            const cy = landmarks.center.y * scaleY;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            ctx.strokeStyle = 'rgba(236, 72, 153, 0.6)';
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 12]);
            ctx.beginPath();
            ctx.arc(0, 0, 50, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            hudAnimFrame = requestAnimationFrame(renderHUD);
        }

        renderHUD();
    }

    /* ==========================================================================
       6. DISPLAY MATCH RESULTS
       ========================================================================== */
    function finishScanning() {
        if (hudAnimFrame) cancelAnimationFrame(hudAnimFrame);
        sound.fanfare();

        scanningSection.style.display = 'none';
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });

        const topMatch = currentAnalysis.rankings[0];
        const runnersUp = currentAnalysis.rankings.slice(1, 4);

        // Setup Match Hero Info
        matchScoreVal.textContent = `${topMatch.matchScore}% Match`;
        if (detectedGenderBadge && currentAnalysis.detectedGender) {
            const g = currentAnalysis.detectedGender;
            const icon = g.gender === 'male' ? '👨' : '👩';
            detectedGenderBadge.textContent = `${icon} AI Gender: ${g.gender.toUpperCase()} (${g.confidence}%)`;
        }
        matchName.textContent = topMatch.name;
        matchKnownFor.textContent = `★ ${topMatch.knownFor}`;
        matchVibe.textContent = `⚡ Twin Vibe: ${topMatch.twinVibe}`;
        matchQuote.textContent = `“${topMatch.quote}”`;
        matchFunFact.textContent = `💡 Doppelgänger Note: ${topMatch.funFact}`;

        // Setup Before / After Split Images
        matchHeroImg.onerror = () => {
            if (matchHeroImg.src !== topMatch.avatarSvg) matchHeroImg.src = topMatch.avatarSvg;
        };
        matchHeroImg.src = getCelebImage(topMatch);
        matchUserImg.src = currentUserImg.src;
        comparisonOverlayImg.src = currentUserImg.src;

        // Reset split slider to 50%
        setSliderPosition(50);

        // Feature Breakdown Bars with animation
        setTimeout(() => {
            const b = topMatch.breakdown;
            barEyes.style.width = b.eyes + '%';
            scoreEyes.textContent = b.eyes + '%';

            barJaw.style.width = b.jaw + '%';
            scoreJaw.textContent = b.jaw + '%';

            barCheekbones.style.width = b.cheekbones + '%';
            scoreCheekbones.textContent = b.cheekbones + '%';

            barSmile.style.width = b.smile + '%';
            scoreSmile.textContent = b.smile + '%';
        }, 150);

        // Runners-up Grid
        populateRunnersUp(runnersUp);

        // Radar Geometry Spider Chart
        drawRadarChart(currentAnalysis.vector, topMatch.vector);

        // Traits Profile List
        populateTraitsList(currentAnalysis.traits);
    }

    function populateRunnersUp(runners) {
        runnersUpGrid.innerHTML = '';
        runners.forEach(runner => {
            const card = document.createElement('div');
            card.className = 'runner-card';
            const runnerImgSrc = getCelebImage(runner);
            card.innerHTML = `
                <div class="runner-avatar">
                    <img src="${runnerImgSrc}" alt="${runner.name}" onerror="if(this.src!=='${runner.avatarSvg}')this.src='${runner.avatarSvg}';" />
                </div>
                <div class="runner-info">
                    <h4>${runner.name}</h4>
                    <p>${runner.knownFor}</p>
                    <span class="runner-score">${runner.matchScore}% Match</span>
                </div>
            `;
            // Clicking a runner swaps them to top match spotlight!
            card.addEventListener('click', () => {
                sound.click();
                swapToTopMatch(runner);
            });
            runnersUpGrid.appendChild(card);
        });
    }

    function swapToTopMatch(selectedCeleb) {
        // Swap spotlight
        matchScoreVal.textContent = `${selectedCeleb.matchScore}% Match`;
        matchName.textContent = selectedCeleb.name;
        matchKnownFor.textContent = `★ ${selectedCeleb.knownFor}`;
        matchVibe.textContent = `⚡ Twin Vibe: ${selectedCeleb.twinVibe}`;
        matchQuote.textContent = `“${selectedCeleb.quote}”`;
        matchFunFact.textContent = `💡 Doppelgänger Note: ${selectedCeleb.funFact}`;
        
        matchHeroImg.onerror = () => {
            if (matchHeroImg.src !== selectedCeleb.avatarSvg) matchHeroImg.src = selectedCeleb.avatarSvg;
        };
        matchHeroImg.src = getCelebImage(selectedCeleb);

        // Update bars
        const b = selectedCeleb.breakdown;
        barEyes.style.width = b.eyes + '%';
        scoreEyes.textContent = b.eyes + '%';
        barJaw.style.width = b.jaw + '%';
        scoreJaw.textContent = b.jaw + '%';
        barCheekbones.style.width = b.cheekbones + '%';
        scoreCheekbones.textContent = b.cheekbones + '%';
        barSmile.style.width = b.smile + '%';
        scoreSmile.textContent = b.smile + '%';

        drawRadarChart(currentAnalysis.vector, selectedCeleb.vector);
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    function populateTraitsList(traits) {
        const gLabel = traits.genderLabel || "Neutral";
        const icon = (traits.detectedGender && traits.detectedGender.gender === 'male') ? '👨' : '👩';
        traitsList.innerHTML = `
            <li class="trait-item"><span class="trait-label">AI Identified Gender</span><span class="trait-value" style="color: #67e8f9; font-weight: 700;">${icon} ${gLabel}</span></li>
            <li class="trait-item"><span class="trait-label">Primary Face Shape</span><span class="trait-value">${traits.faceShape}</span></li>
            <li class="trait-item"><span class="trait-label">Jawline Definition</span><span class="trait-value">${traits.jawStyle}</span></li>
            <li class="trait-item"><span class="trait-label">Facial Symmetry</span><span class="trait-value">${traits.symmetryRating}</span></li>
            <li class="trait-item"><span class="trait-label">Cheekbone Prominence</span><span class="trait-value">${traits.cheekbones}</span></li>
            <li class="trait-item"><span class="trait-label">Skin Undertone</span><span class="trait-value">${traits.undertone}</span></li>
            <li class="trait-item"><span class="trait-label">Expression Aura</span><span class="trait-value">${traits.expressionVibe}</span></li>
        `;
    }

    /* ==========================================================================
       7. RADAR SPIDER CHART (HTML5 CANVAS)
       ========================================================================== */
    function drawRadarChart(userVec, celebVec) {
        const canvas = radarCanvas;
        const ctx = canvas.getContext('2d');
        const size = 300;
        canvas.width = size;
        canvas.height = size;

        const cx = size / 2;
        const cy = size / 2;
        const radius = size * 0.38;

        const labels = ["Symmetry", "Jawline", "Cheekbones", "Eye Ratio", "Smile Curvature"];
        // Map 12D vectors to 5 representative radar axes
        const userVals = [
            userVec[7], // symmetry
            userVec[1], // jaw width
            userVec[2], // cheek prominence
            userVec[3], // eye spacing
            userVec[8]  // smile curve
        ];
        const celebVals = [
            celebVec[7],
            celebVec[1],
            celebVec[2],
            celebVec[3],
            celebVec[8]
        ];

        const totalAxes = labels.length;
        const angleStep = (Math.PI * 2) / totalAxes;

        ctx.clearRect(0, 0, size, size);

        // Draw concentric webs
        const levels = 4;
        for (let l = 1; l <= levels; l++) {
            const r = (radius / levels) * l;
            ctx.beginPath();
            for (let i = 0; i < totalAxes; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw axis spokes & labels
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < totalAxes; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(x, y);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.stroke();

            // Label position
            const lx = cx + (radius + 20) * Math.cos(angle);
            const ly = cy + (radius + 20) * Math.sin(angle);
            ctx.fillText(labels[i], lx, ly);
        }

        // Draw Celebrity Polygon (Fuchsia)
        drawPolygon(ctx, cx, cy, radius, angleStep, celebVals, 'rgba(236, 72, 153, 0.25)', '#ec4899');

        // Draw User Polygon (Cyan Neon)
        drawPolygon(ctx, cx, cy, radius, angleStep, userVals, 'rgba(6, 182, 212, 0.35)', '#06b6d4');
    }

    function drawPolygon(ctx, cx, cy, radius, angleStep, values, fillStyle, strokeStyle) {
        ctx.beginPath();
        for (let i = 0; i < values.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const r = radius * Math.min(1.0, Math.max(0.2, values[i]));
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = fillStyle;
        ctx.fill();
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    /* ==========================================================================
       8. INTERACTIVE BEFORE/AFTER SPLIT SLIDER
       ========================================================================== */
    function setupSplitSlider() {
        let isDragging = false;

        function onMove(clientX) {
            if (!isDragging) return;
            const rect = comparisonSliderBox.getBoundingClientRect();
            let offsetX = clientX - rect.left;
            let percent = (offsetX / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));
            setSliderPosition(percent);
        }

        function setPos(e) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            onMove(clientX);
        }

        comparisonSliderBox.addEventListener('mousedown', (e) => {
            isDragging = true;
            setPos(e);
        });
        window.addEventListener('mouseup', () => { isDragging = false; });
        window.addEventListener('mousemove', (e) => {
            if (isDragging) setPos(e);
        });

        // Touch support
        comparisonSliderBox.addEventListener('touchstart', (e) => {
            isDragging = true;
            setPos(e);
        }, { passive: true });
        window.addEventListener('touchend', () => { isDragging = false; });
        window.addEventListener('touchmove', (e) => {
            if (isDragging) setPos(e);
        }, { passive: true });

        window.addEventListener('resize', () => {
            if (resultsSection && resultsSection.style.display !== 'none') {
                const currentPct = parseFloat(sliderHandle.style.left) || 50;
                setSliderPosition(currentPct);
            }
        });
    }

    function setSliderPosition(percent) {
        if (comparisonSliderBox) {
            const boxWidth = comparisonSliderBox.clientWidth;
            if (boxWidth > 0 && comparisonOverlayImg) {
                comparisonOverlayImg.style.width = boxWidth + 'px';
            }
        }
        comparisonOverlay.style.width = percent + '%';
        sliderHandle.style.left = percent + '%';
    }

    /* ==========================================================================
       9. DOWNLOAD VIP DOPPELGÄNGER CARD (OFFSCREEN CANVAS)
       ========================================================================== */
    function drawRoundedRect(ctx, x, y, width, height, radius) {
        if (ctx.roundRect) {
            ctx.roundRect(x, y, width, height, radius);
        } else {
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
        }
    }

    function generateDoppelgangerCard() {
        sound.click();
        const topMatch = currentAnalysis.rankings[0];

        const cardCanvas = document.createElement('canvas');
        const cW = 900;
        const cH = 1100;
        cardCanvas.width = cW;
        cardCanvas.height = cH;
        const ctx = cardCanvas.getContext('2d');

        // Dark Luxury Card Background
        const bgGrad = ctx.createLinearGradient(0, 0, 0, cH);
        bgGrad.addColorStop(0, '#0c0f1d');
        bgGrad.addColorStop(1, '#05070e');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, cW, cH);

        // Gold Trim Border
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 4;
        ctx.strokeRect(25, 25, cW - 50, cH - 50);

        ctx.strokeStyle = 'rgba(217, 119, 6, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(35, 35, cW - 70, cH - 70);

        // Header Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("CELEBTWIN AI • VIP VERIFIED", cW / 2, 95);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText("OFFICIAL BIOMETRIC DOPPELGÄNGER CERTIFICATE", cW / 2, 130);

        // Draw Photos Side by Side
        const photoY = 175;
        const photoSize = 340;
        const leftPhotoX = 80;
        const rightPhotoX = cW - 80 - photoSize;

        // User Photo
        ctx.save();
        ctx.beginPath();
        drawRoundedRect(ctx, leftPhotoX, photoY, photoSize, photoSize, 16);
        ctx.clip();
        ctx.drawImage(currentUserImg, leftPhotoX, photoY, photoSize, photoSize);
        ctx.restore();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.strokeRect(leftPhotoX, photoY, photoSize, photoSize);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText("YOU", leftPhotoX + photoSize / 2, photoY + photoSize + 30);

        // Celebrity Photo
        const celebImg = new Image();
        celebImg.crossOrigin = "anonymous";

        function drawCardWithImage(imageObj) {
            ctx.save();
            ctx.beginPath();
            drawRoundedRect(ctx, rightPhotoX, photoY, photoSize, photoSize, 16);
            ctx.clip();
            ctx.drawImage(imageObj, rightPhotoX, photoY, photoSize, photoSize);
            ctx.restore();
            ctx.strokeStyle = '#ec4899';
            ctx.lineWidth = 3;
            ctx.strokeRect(rightPhotoX, photoY, photoSize, photoSize);

            ctx.fillStyle = '#ec4899';
            ctx.font = 'bold 18px sans-serif';
            ctx.fillText(topMatch.name.toUpperCase(), rightPhotoX + photoSize / 2, photoY + photoSize + 30);

            // Match Score Badge in Center
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            drawRoundedRect(ctx, cW / 2 - 90, photoY + photoSize / 2 - 35, 180, 70, 35);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 30px sans-serif';
            ctx.fillText(`${topMatch.matchScore}%`, cW / 2, photoY + photoSize / 2 + 5);
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText("MATCH", cW / 2, photoY + photoSize / 2 + 25);

            // Details Section
            const detailsY = 620;
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 40px sans-serif';
            ctx.fillText(topMatch.name, cW / 2, detailsY);

            ctx.fillStyle = '#f59e0b';
            ctx.font = 'italic 20px sans-serif';
            ctx.fillText(`“${topMatch.twinVibe}”`, cW / 2, detailsY + 45);

            ctx.fillStyle = '#94a3b8';
            ctx.font = '18px sans-serif';
            ctx.fillText(`Known For: ${topMatch.knownFor}`, cW / 2, detailsY + 85);

            // Breakdown Stats Row
            const b = topMatch.breakdown;
            const stats = [
                `Eyes: ${b.eyes}%`,
                `Jawline: ${b.jaw}%`,
                `Cheekbones: ${b.cheekbones}%`,
                `Smile: ${b.smile}%`
            ];

            ctx.fillStyle = '#334155';
            ctx.beginPath();
            drawRoundedRect(ctx, 80, detailsY + 120, cW - 160, 60, 12);
            ctx.fill();

            ctx.fillStyle = '#e2e8f0';
            ctx.font = 'bold 18px sans-serif';
            stats.forEach((st, i) => {
                const sx = 140 + i * 190;
                ctx.fillText(st, sx, detailsY + 156);
            });

            // Simulated Barcode & Footer Stamp
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 60; i++) {
                const barW = (i % 3 === 0) ? 4 : 2;
                ctx.fillRect(80 + i * 8, 970, barW, 40);
            }
            ctx.font = '12px monospace';
            ctx.fillStyle = '#64748b';
            ctx.textAlign = 'left';
            const gInfo = (currentAnalysis && currentAnalysis.detectedGender) ? ` • AI GENDER: ${currentAnalysis.detectedGender.gender.toUpperCase()} (${currentAnalysis.detectedGender.confidence}%)` : '';
            ctx.fillText(`ID #${Math.random().toString(36).substr(2, 9).toUpperCase()}${gInfo}`, 80, 1030);

            ctx.textAlign = 'right';
            ctx.font = 'bold 15px sans-serif';
            ctx.fillStyle = '#f59e0b';
            ctx.fillText("CELEBTWIN AI OFFICIAL SEAL", cW - 80, 1000);

            // Trigger instant download
            try {
                const link = document.createElement('a');
                link.download = `Celebrity-Twin-${topMatch.name.replace(/\s+/g, '-')}.png`;
                link.href = cardCanvas.toDataURL('image/png');
                link.click();
            } catch (err) {
                // If remote photo tainted canvas, fallback to drawing local SVG vector which never taints
                if (imageObj.src !== topMatch.avatarSvg) {
                    const fallbackImg = new Image();
                    fallbackImg.onload = () => drawCardWithImage(fallbackImg);
                    fallbackImg.src = topMatch.avatarSvg;
                }
            }
        }

        celebImg.onload = () => drawCardWithImage(celebImg);
        celebImg.onerror = () => {
            const fallbackImg = new Image();
            fallbackImg.onload = () => drawCardWithImage(fallbackImg);
            fallbackImg.src = topMatch.avatarSvg;
        };
        celebImg.src = getCelebImage(topMatch);
    }

    function shareResult() {
        sound.click();
        const topMatch = currentAnalysis.rankings[0];
        const shareText = `I just tested my celebrity twin on CelebTwin AI and I'm a ${topMatch.matchScore}% match with ${topMatch.name}! ✨ Check your celebrity doppelgänger too!`;

        if (navigator.share) {
            navigator.share({
                title: 'My Celebrity Doppelgänger',
                text: shareText,
                url: window.location.href
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Result copied to clipboard! Share it with your friends.');
            });
        }
    }

    // Run Initialization
    init();
});
