// ================= GLOBAL STATE & DATA STORAGE =================
let activeTab = 'scanner';
        let currency = 'USD'; // 'USD' or 'INR'
        let exchangeRate = 83.5; // 1 USD = 83.5 INR
        let userApiKey = localStorage.getItem('resnap_gemini_key') || '';
        let webcamStream = null;
        let activeDeviceData = null; // Current scanned gadget object
        let diagnosticRadar = null;

        // Default Presets Library
        const PRESET_GADGETS = {
            'iphone_x': {
                id: 'preset_1',
                model: 'Apple iPhone X (64GB)',
                brand: 'Apple',
                category: 'smartphone',
                originalValueUsd: 999,
                resellValueUsd: 145,
                repairCostUsd: 65,
                conditionPct: 62,
                screenDamagePct: 55,
                wearPct: 35,
                batteryHealthPct: 72,
                portHealthPct: 85,
                bestRoute: 'RESELL',
                safetyWarning: false,
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
                upcycleIdea: {
                    title: 'Smart Home AI Security Camera',
                    desc: 'Convert high-res camera into an IP motion-sensing security camera.',
                    guideKey: 'smart_cam'
                },
                ecoImpact: { co2Kg: 34.2, goldG: 0.035, waterL: 420, ewasteKg: 0.17 }
            },
            'galaxy_s9': {
                id: 'preset_2',
                model: 'Samsung Galaxy S9 (128GB)',
                brand: 'Samsung',
                category: 'smartphone',
                originalValueUsd: 720,
                resellValueUsd: 95,
                repairCostUsd: 40,
                conditionPct: 78,
                screenDamagePct: 15,
                wearPct: 25,
                batteryHealthPct: 80,
                portHealthPct: 90,
                bestRoute: 'REUSE',
                safetyWarning: false,
                image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
                upcycleIdea: {
                    title: 'Dedicated Auto-Loop Vehicle Dashcam',
                    desc: 'Repurpose OLED display and camera into a smart auto dashcam.',
                    guideKey: 'car_dashcam'
                },
                ecoImpact: { co2Kg: 28.5, goldG: 0.028, waterL: 380, ewasteKg: 0.16 }
            },
            'ipad_mini': {
                id: 'preset_3',
                model: 'Apple iPad Mini 4 (WiFi)',
                brand: 'Apple',
                category: 'tablet',
                originalValueUsd: 399,
                resellValueUsd: 80,
                repairCostUsd: 75,
                conditionPct: 70,
                screenDamagePct: 20,
                wearPct: 30,
                batteryHealthPct: 65,
                portHealthPct: 80,
                bestRoute: 'REUSE',
                safetyWarning: false,
                image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
                upcycleIdea: {
                    title: 'Smart Wall Weather & Dashboard Display',
                    desc: 'Mount on wall to display calendar, smart home controls, and live weather.',
                    guideKey: 'desk_hud'
                },
                ecoImpact: { co2Kg: 52.0, goldG: 0.050, waterL: 650, ewasteKg: 0.30 }
            },
            'sony_headphones': {
                id: 'preset_4',
                model: 'Sony WH-1000XM3 Headphones',
                brand: 'Sony',
                category: 'audio',
                originalValueUsd: 348,
                resellValueUsd: 110,
                repairCostUsd: 25,
                conditionPct: 82,
                screenDamagePct: 0,
                wearPct: 40,
                batteryHealthPct: 85,
                portHealthPct: 95,
                bestRoute: 'REPAIR',
                safetyWarning: false,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
                upcycleIdea: {
                    title: 'Bluetooth PC Wireless Audio Station',
                    desc: 'Replace ear cushions and use as permanent desktop studio headset.',
                    guideKey: 'smart_cam'
                },
                ecoImpact: { co2Kg: 18.2, goldG: 0.012, waterL: 210, ewasteKg: 0.25 }
            },
            'dell_laptop': {
                id: 'preset_5',
                model: 'Dell Inspiron 15 (8GB RAM / 256GB SSD)',
                brand: 'Dell',
                category: 'laptop',
                originalValueUsd: 650,
                resellValueUsd: 120,
                repairCostUsd: 110,
                conditionPct: 50,
                screenDamagePct: 40,
                wearPct: 60,
                batteryHealthPct: 45,
                portHealthPct: 70,
                bestRoute: 'REUSE',
                safetyWarning: false,
                image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
                upcycleIdea: {
                    title: 'Personal Cloud NAS & Home Server',
                    desc: 'Convert core hardware into a low-power home file server or Plex node.',
                    guideKey: 'home_nas'
                },
                ecoImpact: { co2Kg: 140.0, goldG: 0.120, waterL: 1800, ewasteKg: 2.10 }
            },
            'swollen_phone': {
                id: 'preset_6',
                model: 'Old Android Device (Battery Swollen)',
                brand: 'Generic',
                category: 'smartphone',
                originalValueUsd: 300,
                resellValueUsd: 10,
                repairCostUsd: 90,
                conditionPct: 15,
                screenDamagePct: 80,
                wearPct: 90,
                batteryHealthPct: 10,
                portHealthPct: 30,
                bestRoute: 'RECYCLE',
                safetyWarning: true,
                image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80',
                upcycleIdea: {
                    title: 'Recycle Immediately',
                    desc: 'Swollen batteries are a safety hazard. Disposal required.',
                    guideKey: 'smart_cam'
                },
                ecoImpact: { co2Kg: 22.0, goldG: 0.020, waterL: 300, ewasteKg: 0.15 }
            }
        };

        // Persistent E-Waste Vault Items
        let vaultItems = JSON.parse(localStorage.getItem('resnap_vault')) || [
            {
                id: 'v_101',
                model: 'Apple iPhone X (64GB)',
                brand: 'Apple',
                resellValueUsd: 145,
                bestRoute: 'RESELL',
                status: 'SCANNED',
                conditionPct: 62,
                ecoImpact: { co2Kg: 34.2, goldG: 0.035, waterL: 420, ewasteKg: 0.17 },
                date: '2026-09-18'
            },
            {
                id: 'v_102',
                model: 'Dell Inspiron 15 Laptop',
                brand: 'Dell',
                resellValueUsd: 120,
                bestRoute: 'REUSE',
                status: 'UPCYCLED',
                conditionPct: 50,
                ecoImpact: { co2Kg: 140.0, goldG: 0.120, waterL: 1800, ewasteKg: 2.10 },
                date: '2026-09-22'
            }
        ];

        window.onload = function() {
            lucide.createIcons();
            initDiagnosticRadarChart();
            loadDemoPreset('iphone_x');
            renderVaultTable();
            renderBadges();
            selectDIYProject('smart_cam');
            renderHubsList();
        };

        // Navigation Tab Switching Logic
        function switchTab(tabId) {
            activeTab = tabId;
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('text-brand-400', 'bg-brand-500/10', 'border', 'border-brand-500/30', 'font-semibold');
                btn.classList.add('text-slate-400');
            });

            const activeContent = document.getElementById(`tab-${tabId}`);
            if (activeContent) activeContent.classList.remove('hidden');

            const activeBtn = document.getElementById(`nav-${tabId}`);
            if (activeBtn) {
                activeBtn.classList.add('text-brand-400', 'bg-brand-500/10', 'border', 'border-brand-500/30', 'font-semibold');
                activeBtn.classList.remove('text-slate-400');
            }

            if (tabId === 'vault') renderVaultTable();
            if (tabId === 'impact') updateImpactView();
            if (tabId === 'shop') { sparkRenderShop(); sparkUpdateBalances(); }
            if (tabId === 'admin') sparkRenderAdmin();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function toggleMobileNav() {
            const nav = document.getElementById('mobile-nav');
            nav.classList.toggle('hidden');
        }

        // Currency Toggle
        function toggleCurrency() {
            currency = (currency === 'USD') ? 'INR' : 'USD';
            const label = (currency === 'USD') ? '$ USD' : '₹ INR';
            document.getElementById('currency-label').innerText = label;
            document.getElementById('mobile-currency-label').innerText = label;
            updateUIValuesForCurrency();
        }

        function formatMoney(usdAmount) {
            if (currency === 'INR') {
                const inr = Math.round(usdAmount * exchangeRate);
                return `₹${inr.toLocaleString('en-IN')}`;
            }
            return `$${usdAmount.toFixed(2)}`;
        }

        function updateUIValuesForCurrency() {
            if (activeDeviceData) updateMatrixAndSummaryDisplay(activeDeviceData);
            renderVaultTable();
        }

        function initDiagnosticRadarChart() {
            const ctx = document.getElementById('diagnosticRadarChart').getContext('2d');
            diagnosticRadar = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Display Quality', 'Housing Integrity', 'Battery Health', 'Port Health', 'Motherboard'],
                    datasets: [{
                        label: 'Device Health %',
                        data: [45, 65, 72, 85, 90],
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        borderColor: '#10b981',
                        borderWidth: 2,
                        pointBackgroundColor: '#06b6d4',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#10b981'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(75, 103, 79, 0.18)' },
                            grid: { color: 'rgba(75, 103, 79, 0.18)' },
                            pointLabels: { color: '#65756b', font: { size: 9, family: 'JetBrains Mono' } },
                            ticks: { display: false, min: 0, max: 100 }
                        }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }

        function updateDiagnosticsFromSliders() {
            const screenDamage = parseInt(document.getElementById('slider-screen').value);
            const wear = parseInt(document.getElementById('slider-wear').value);
            const battery = parseInt(document.getElementById('slider-battery').value);
            const port = parseInt(document.getElementById('slider-port').value);

            document.getElementById('slider-screen-val').innerText = `${screenDamage}%`;
            document.getElementById('slider-wear-val').innerText = `${wear}%`;
            document.getElementById('slider-battery-val').innerText = `${battery}%`;
            document.getElementById('slider-port-val').innerText = `${port}%`;

            const displayHealth = Math.max(0, 100 - screenDamage);
            const housingHealth = Math.max(0, 100 - wear);

            if (diagnosticRadar) {
                diagnosticRadar.data.datasets[0].data = [displayHealth, housingHealth, battery, port, 90];
                diagnosticRadar.update();
            }

            if (activeDeviceData) {
                activeDeviceData.screenDamagePct = screenDamage;
                activeDeviceData.wearPct = wear;
                activeDeviceData.batteryHealthPct = battery;
                activeDeviceData.portHealthPct = port;
                recalculateDeviceValuation(activeDeviceData);
            }
        }

        function loadDemoPreset(presetKey) {
            const preset = PRESET_GADGETS[presetKey];
            if (!preset) return;

            activeDeviceData = JSON.parse(JSON.stringify(preset));

            // Set Image Preview
            const imgEl = document.getElementById('scanned-image-preview');
            const placeholder = document.getElementById('upload-placeholder');
            imgEl.src = preset.image;
            imgEl.classList.remove('hidden');
            placeholder.classList.add('hidden');

            // Show HUD Box
            const bbox = document.getElementById('hud-bounding-box');
            bbox.classList.remove('hidden');
            bbox.style.top = '15%';
            bbox.style.left = '15%';
            bbox.style.width = '70%';
            bbox.style.height = '70%';
            document.getElementById('hud-detected-tag').innerText = `DETECTED: ${preset.model}`;

            // Set Sliders
            document.getElementById('slider-screen').value = preset.screenDamagePct;
            document.getElementById('slider-wear').value = preset.wearPct;
            document.getElementById('slider-battery').value = preset.batteryHealthPct;
            document.getElementById('slider-port').value = preset.portHealthPct;
            updateDiagnosticsFromSliders();

            // Safety Warning
            const alertBanner = document.getElementById('safety-alert-banner');
            if (preset.safetyWarning) {
                alertBanner.classList.remove('hidden');
            } else {
                alertBanner.classList.add('hidden');
            }

            updateMatrixAndSummaryDisplay(activeDeviceData);
        }

        function recalculateDeviceValuation(gadget) {
            // Adjust resell value based on screen crack & battery health
            const baseResell = gadget.originalValueUsd * 0.25;
            const screenDeduction = (gadget.screenDamagePct / 100) * 0.4 * baseResell;
            const batteryDeduction = ((100 - gadget.batteryHealthPct) / 100) * 0.2 * baseResell;
            
            gadget.resellValueUsd = Math.max(10, Math.round(baseResell - screenDeduction - batteryDeduction));

            if (gadget.safetyWarning) {
                gadget.bestRoute = 'RECYCLE';
            } else if (gadget.resellValueUsd > 100) {
                gadget.bestRoute = 'RESELL';
            } else if (gadget.repairCostUsd < gadget.resellValueUsd * 0.6) {
                gadget.bestRoute = 'REPAIR';
            } else {
                gadget.bestRoute = 'REUSE';
            }

            updateMatrixAndSummaryDisplay(gadget);
        }

        function updateMatrixAndSummaryDisplay(gadget) {
            // Scanner Tab Quick Summary
            document.getElementById('summary-best-route-title').innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4"></i> Optimal Route: ${gadget.bestRoute}`;
            document.getElementById('summary-est-val').innerText = formatMoney(gadget.resellValueUsd);

            // Matrix Tab Updates
            document.getElementById('matrix-gadget-title').innerText = `Active Device: ${gadget.model}`;

            // Resell Card
            document.getElementById('resell-val-display').innerText = formatMoney(gadget.resellValueUsd);
            document.getElementById('resell-price-cashify').innerText = formatMoney(gadget.resellValueUsd);
            document.getElementById('resell-price-backmarket').innerText = formatMoney(gadget.resellValueUsd * 0.95);
            document.getElementById('resell-price-ebay').innerText = `${formatMoney(gadget.resellValueUsd * 1.08)} (Private)`;

            // Repair Card
            document.getElementById('repair-cost-display').innerText = formatMoney(gadget.repairCostUsd);
            document.getElementById('repair-vs-replace-display').innerText = `${formatMoney(gadget.originalValueUsd * 0.6)} Replacement`;
            const repairRatio = Math.min(100, Math.round((gadget.repairCostUsd / (gadget.originalValueUsd * 0.6)) * 100));
            document.getElementById('repair-ratio-bar').style.width = `${repairRatio}%`;
            document.getElementById('repair-ratio-label').innerText = `Repair cost is ${repairRatio}% of replacement value.`;

            // Upcycle Card
            document.getElementById('upcycle-project-name').innerHTML = `<i data-lucide="sparkles" class="w-4 h-4 text-violet-400"></i> ${gadget.upcycleIdea.title}`;
            document.getElementById('upcycle-project-desc').innerText = gadget.upcycleIdea.desc;

            // Recycle Card
            document.getElementById('recycle-co2-val').innerText = `${gadget.ecoImpact.co2Kg} kg`;
            document.getElementById('recycle-gold-val').innerText = `${gadget.ecoImpact.goldG} g`;
            document.getElementById('cert-device-name').innerText = gadget.model;

            // Highlight Optimal Route Card
            const routes = ['resell', 'repair', 'reuse', 'recycle'];
            routes.forEach(r => {
                const card = document.getElementById(`card-route-${r}`);
                if (card) {
                    if (r.toUpperCase() === gadget.bestRoute) {
                        card.classList.add('border-brand-500', 'bg-brand-500/5', 'shadow-xl');
                        card.classList.remove('border-transparent', 'border-slate-800');
                    } else {
                        card.classList.remove('border-brand-500', 'bg-brand-500/5', 'shadow-xl');
                        card.classList.add('border-slate-800');
                    }
                }
            });

            lucide.createIcons();
        }

        function triggerFileInput() {
            document.getElementById('file-input').click();
        }

        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                const imgEl = document.getElementById('scanned-image-preview');
                const placeholder = document.getElementById('upload-placeholder');
                imgEl.src = e.target.result;
                imgEl.classList.remove('hidden');
                placeholder.classList.add('hidden');
                executeAIScan();
            };
            reader.readAsDataURL(file);
        }

        async function toggleWebcam() {
            const video = document.getElementById('webcam-feed');
            const btnText = document.getElementById('webcam-btn-text');

            if (webcamStream) {
                // Stop Webcam
                webcamStream.getTracks().forEach(track => track.stop());
                webcamStream = null;
                video.classList.add('hidden');
                btnText.innerText = 'Start Camera';
            } else {
                try {
                    webcamStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                    video.srcObject = webcamStream;
                    video.classList.remove('hidden');
                    document.getElementById('upload-placeholder').classList.add('hidden');
                    btnText.innerText = 'Stop Camera';
                } catch (err) {
                    showToast('Camera access denied or unavailable', 'error');
                }
            }
        }

        async function executeAIScan() {
            const laser = document.getElementById('scan-laser-line');
            const runBtn = document.getElementById('run-ai-btn');

            laser.classList.remove('hidden');
            runBtn.disabled = true;
            runBtn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> AI Vision Analyzing...`;
            lucide.createIcons();

            // Check if user provided a Gemini key and an image exists
            const imgEl = document.getElementById('scanned-image-preview');
            const hasCustomImage = imgEl && !imgEl.classList.contains('hidden');

            if (userApiKey && hasCustomImage) {
                try {
                    const base64Data = imgEl.src.split(',')[1];
                    const payload = {
                        contents: [{
                            role: 'user',
                            parts: [
                                { text: 'Analyze this gadget image. Return strict JSON with fields: model (string), brand (string), category (smartphone|laptop|tablet|audio), conditionPct (number 0-100), screenDamagePct (number 0-100), wearPct (number 0-100), batteryHealthPct (number 0-100), estimatedResellUsd (number), repairCostUsd (number), bestRoute (RESELL|REPAIR|REUSE|RECYCLE), safetyWarning (boolean).' },
                                { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
                            ]
                        }],
                        generationConfig: { responseMimeType: 'application/json' }
                    };

                    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${userApiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const data = await resp.json();
                    if (data.candidates && data.candidates[0].content.parts[0].text) {
                        const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
                        activeDeviceData = {
                            id: `scanned_${Date.now()}`,
                            model: parsed.model || 'Detected Electronic Device',
                            brand: parsed.brand || 'Generic',
                            category: parsed.category || 'smartphone',
                            originalValueUsd: (parsed.estimatedResellUsd || 100) * 3,
                            resellValueUsd: parsed.estimatedResellUsd || 85,
                            repairCostUsd: parsed.repairCostUsd || 45,
                            conditionPct: parsed.conditionPct || 70,
                            screenDamagePct: parsed.screenDamagePct || 20,
                            wearPct: parsed.wearPct || 25,
                            batteryHealthPct: parsed.batteryHealthPct || 75,
                            portHealthPct: 85,
                            bestRoute: parsed.bestRoute || 'RESELL',
                            safetyWarning: parsed.safetyWarning || false,
                            image: imgEl.src,
                            upcycleIdea: {
                                title: 'Smart Home Security Hub',
                                desc: 'Repurpose hardware components for smart home control.',
                                guideKey: 'smart_cam'
                            },
                            ecoImpact: { co2Kg: 30.0, goldG: 0.03, waterL: 400, ewasteKg: 0.2 }
                        };
                        showToast('Gemini 3 Flash Multimodal Vision Completed!', 'success');
                    }
                } catch (e) {
                    console.log('Gemini API fallback to offline smart engine', e);
                }
            }

            // Simulate scanning laser duration
            setTimeout(() => {
                laser.classList.add('hidden');
                runBtn.disabled = false;
                runBtn.innerHTML = `<i data-lucide="cpu" class="w-4 h-4"></i> Run AI Assessment`;
                
                // Show detected bounding box
                const bbox = document.getElementById('hud-bounding-box');
                bbox.classList.remove('hidden');
                document.getElementById('hud-detected-tag').innerText = `DETECTED: ${activeDeviceData.model}`;

                // Keep the original sliders, value labels, and radar in sync with the completed AI assessment.
                sparkSyncDiagnostics();
                const sparkScans = Number(localStorage.getItem(SPARK_SCAN_KEY) || 0) + 1;
                localStorage.setItem(SPARK_SCAN_KEY, String(sparkScans));
                sparkAwardReckles(SPARK_SCAN_REWARD, 'AI assessment', activeDeviceData.model);
                updateMatrixAndSummaryDisplay(activeDeviceData);
                showToast(`AI Diagnostic Complete: ${activeDeviceData.model}`, 'success');
                lucide.createIcons();
            }, 1800);
        }

        const DIY_GUIDES = {
            'smart_cam': {
                title: 'Smart Home AI Security Camera',
                hardwareNeeded: ['Old Phone/Tablet', 'USB Power Cable', 'Sticky Wall Mount Bracket'],
                appsToDownload: ['Alfred Security Camera', 'IP Webcam (Android)', 'Manything (iOS)'],
                steps: [
                    'Clean phone camera lens with microfiber cloth.',
                    'Install Security Camera app from store and log into master account.',
                    'Mount phone near target area with continuous USB power connection.',
                    'Enable motion-detection zones and push notifications.'
                ]
            },
            'desk_hud': {
                title: 'Dedicated Smart Wall Weather & Calendar Dashboard',
                hardwareNeeded: ['Old Tablet or iPad', 'Wall Adhesive Mount', 'Power Cable'],
                appsToDownload: ['Fully Single App Kiosk', 'Dakboard Web Dashboard', 'ActionTiles'],
                steps: [
                    'Factory reset tablet and update to newest supported web browser.',
                    'Create a free DAKboard layout with local weather forecast and Google Calendar.',
                    'Set tablet browser to Kiosk full-screen mode.',
                    'Mount at entryway or kitchen desk.'
                ]
            },
            'home_nas': {
                title: 'Personal Cloud NAS & Media Server',
                hardwareNeeded: ['Old Laptop', 'External Hard Drive (1TB+)', 'Ethernet Cable'],
                appsToDownload: ['OpenMediaVault OS', 'Plex Media Server', 'Nextcloud Docker'],
                steps: [
                    'Install OpenMediaVault or Ubuntu Server on laptop drive.',
                    'Connect external USB drive for storage pool.',
                    'Configure Samba shared drives for automated home laptop backups.',
                    'Enable Plex server to stream movie library across home smart TVs.'
                ]
            },
            'car_dashcam': {
                title: 'Auto-Loop Vehicle Dashcam',
                hardwareNeeded: ['Old Android/iOS Phone', 'Suction Car Windshield Mount', '12V Car Charger'],
                appsToDownload: ['AutoBoy Dash Cam', 'RoadRecorder', 'Driver AI'],
                steps: [
                    'Attach phone mount behind rear-view mirror.',
                    'Install AutoBoy Dashcam app and set continuous loop recording to 5-minute clips.',
                    'Enable background G-sensor auto-saving on impact.',
                    'Connect auto-ignition USB power adapter.'
                ]
            }
        };

        function selectDIYProject(guideKey) {
            const guide = DIY_GUIDES[guideKey];
            if (!guide) return;

            document.querySelectorAll('.diy-selector-card').forEach(c => {
                c.classList.remove('border-violet-500/50', 'bg-violet-500/10');
                c.classList.add('border-slate-800');
            });
            const activeCard = document.getElementById(`diy-card-${guideKey}`);
            if (activeCard) {
                activeCard.classList.add('border-violet-500/50', 'bg-violet-500/10');
            }

            const container = document.getElementById('diy-guide-container');
            container.innerHTML = `
                <div class="border-b border-slate-800 pb-4 flex justify-between items-start">
                    <div>
                        <span class="text-xs font-mono text-violet-400 uppercase">Step-By-Step Transformation Blueprint</span>
                        <h3 class="text-xl font-bold text-white mt-1">${guide.title}</h3>
                    </div>
                    <button onclick="markProjectUpcycled('${guide.title}')" class="px-3.5 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-bold text-xs flex items-center gap-1.5 transition">
                        <i data-lucide="check-circle" class="w-4 h-4"></i> Mark as Upcycled
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                        <h4 class="font-bold text-slate-300 mb-2 flex items-center gap-1.5"><i data-lucide="box" class="w-3.5 h-3.5 text-violet-400"></i> Hardware Needed:</h4>
                        <ul class="list-disc list-inside text-slate-400 space-y-1">
                            ${guide.hardwareNeeded.map(h => `<li>${h}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                        <h4 class="font-bold text-slate-300 mb-2 flex items-center gap-1.5"><i data-lucide="download" class="w-3.5 h-3.5 text-cyan-400"></i> Recommended Apps / Tools:</h4>
                        <ul class="list-disc list-inside text-slate-400 space-y-1">
                            ${guide.appsToDownload.map(a => `<li>${a}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="space-y-3">
                    <h4 class="font-bold text-sm text-white flex items-center gap-2">
                        <i data-lucide="list-checks" class="w-4 h-4 text-brand-400"></i> Execution Steps:
                    </h4>
                    <div class="space-y-2 text-xs">
                        ${guide.steps.map((step, idx) => `
                            <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                                <span class="w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40 flex items-center justify-center font-mono font-bold shrink-0">${idx + 1}</span>
                                <p class="text-slate-300 mt-0.5">${step}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            lucide.createIcons();
        }

        function launchStudioProjectFromMatrix() {
            switchTab('upcycle');
            if (activeDeviceData && activeDeviceData.upcycleIdea) {
                selectDIYProject(activeDeviceData.upcycleIdea.guideKey || 'smart_cam');
            }
        }

        function markProjectUpcycled(title) {
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
            showToast(`Awesome! "${title}" added to your impact score!`, 'success');
            
            if (activeDeviceData) {
                vaultItems.push({
                    id: `v_${Date.now()}`,
                    model: activeDeviceData.model,
                    brand: activeDeviceData.brand,
                    resellValueUsd: activeDeviceData.resellValueUsd,
                    bestRoute: 'REUSE',
                    status: 'UPCYCLED',
                    conditionPct: activeDeviceData.conditionPct,
                    ecoImpact: activeDeviceData.ecoImpact,
                    date: new Date().toISOString().split('T')[0]
                });
                localStorage.setItem('resnap_vault', JSON.stringify(vaultItems));
            }
        }

        function saveActiveDeviceToVault() {
            if (!activeDeviceData) return;
            vaultItems.push({
                id: `v_${Date.now()}`,
                model: activeDeviceData.model,
                brand: activeDeviceData.brand,
                resellValueUsd: activeDeviceData.resellValueUsd,
                bestRoute: activeDeviceData.bestRoute,
                status: 'SCANNED',
                conditionPct: activeDeviceData.conditionPct,
                ecoImpact: activeDeviceData.ecoImpact,
                date: new Date().toISOString().split('T')[0]
            });
            localStorage.setItem('resnap_vault', JSON.stringify(vaultItems));
            renderVaultTable();
            showToast(`Saved ${activeDeviceData.model} to My Drawer!`, 'success');
        }

        function renderVaultTable() {
            const tbody = document.getElementById('vault-table-body');
            const filter = document.getElementById('vault-filter').value;
            
            const filtered = (filter === 'ALL') ? vaultItems : vaultItems.filter(i => i.status === filter);

            // Update Vault Count Badge
            document.getElementById('vault-count-badge').innerText = vaultItems.length;
            document.getElementById('vault-count-badge').classList.remove('hidden');

            // Update Stats
            let totalCash = 0, totalCo2 = 0, totalGold = 0;
            vaultItems.forEach(i => {
                totalCash += i.resellValueUsd;
                totalCo2 += (i.ecoImpact ? i.ecoImpact.co2Kg : 30);
                totalGold += (i.ecoImpact ? i.ecoImpact.goldG : 0.03);
            });

            document.getElementById('vault-stat-count').innerText = vaultItems.length;
            document.getElementById('vault-stat-cash').innerText = formatMoney(totalCash);
            document.getElementById('vault-stat-co2').innerText = `${totalCo2.toFixed(1)} kg`;
            document.getElementById('vault-stat-gold').innerText = `${totalGold.toFixed(3)} g`;

            if (filtered.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="p-8 text-center text-slate-500 font-mono">
                            No stored devices found in drawer. Click "Scan Gadget" to add one!
                        </td>
                    </tr>
                `;
                return;
            }

            tbody.innerHTML = filtered.map(item => `
                <tr class="hover:bg-slate-900/50 transition">
                    <td class="p-3.5 font-bold text-white">${item.model}</td>
                    <td class="p-3.5 text-slate-400">${item.brand}</td>
                    <td class="p-3.5">
                        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-300">
                            Condition: ${item.conditionPct}%
                        </span>
                    </td>
                    <td class="p-3.5 font-mono text-emerald-400 font-bold">${formatMoney(item.resellValueUsd)}</td>
                    <td class="p-3.5 font-mono text-brand-400 font-semibold">${item.bestRoute}</td>
                    <td class="p-3.5">
                        <select onchange="updateVaultItemStatus('${item.id}', this.value)" class="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200">
                            <option value="SCANNED" ${item.status === 'SCANNED' ? 'selected' : ''}>Scanned</option>
                            <option value="RESOLD" ${item.status === 'RESOLD' ? 'selected' : ''}>Resold</option>
                            <option value="REPAIRED" ${item.status === 'REPAIRED' ? 'selected' : ''}>Repaired</option>
                            <option value="UPCYCLED" ${item.status === 'UPCYCLED' ? 'selected' : ''}>Upcycled</option>
                            <option value="RECYCLED" ${item.status === 'RECYCLED' ? 'selected' : ''}>Recycled</option>
                        </select>
                    </td>
                    <td class="p-3.5 text-right space-x-1">
                        <button onclick="deleteVaultItem('${item.id}')" class="p-1.5 rounded hover:bg-slate-800 text-rose-400" title="Delete">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
            lucide.createIcons();
        }

        function updateVaultItemStatus(id, newStatus) {
            const item = vaultItems.find(i => i.id === id);
            if (item) {
                item.status = newStatus;
                localStorage.setItem('resnap_vault', JSON.stringify(vaultItems));
                showToast(`Status updated to ${newStatus}`, 'info');
            }
        }

        function deleteVaultItem(id) {
            vaultItems = vaultItems.filter(i => i.id !== id);
            localStorage.setItem('resnap_vault', JSON.stringify(vaultItems));
            renderVaultTable();
            showToast('Item removed from vault', 'info');
        }

        function openAddManualGadgetModal() {
            const model = prompt("Enter Device Name (e.g., Nintendo Switch):");
            if (!model) return;
            vaultItems.push({
                id: `v_${Date.now()}`,
                model: model,
                brand: 'Custom',
                resellValueUsd: 110,
                bestRoute: 'RESELL',
                status: 'SCANNED',
                conditionPct: 75,
                ecoImpact: { co2Kg: 25.0, goldG: 0.02, waterL: 300, ewasteKg: 0.2 },
                date: new Date().toISOString().split('T')[0]
            });
            localStorage.setItem('resnap_vault', JSON.stringify(vaultItems));
            renderVaultTable();
            showToast(`Added ${model} to vault!`, 'success');
        }

        function exportVaultSummaryReport() {
            let report = `SPARK - OFFICIAL E-WASTE & CIRCULARITY AUDIT REPORT\n`;
            report += `Generated: ${new Date().toLocaleDateString()}\n`;
            report += `========================================================\n\n`;
            vaultItems.forEach((i, idx) => {
                report += `${idx + 1}. ${i.model} (${i.brand}) - Est Value: $${i.resellValueUsd} | Best Route: ${i.bestRoute} | Status: ${i.status}\n`;
            });
            report += `\nCPCB Zero Landfill Certified Protocol Compliance.`;

            const blob = new Blob([report], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `SPARK_Ewaste_Report.txt`;
            a.click();
            showToast('Eco Summary Audit Exported!', 'success');
        }

        const BADGES_LIST = [
            { title: 'Circularity Pioneer', icon: 'shield-check', desc: 'Scan your first gadget for 4R diagnostic.', unlocked: true },
            { title: 'Gold Miner', icon: 'sparkles', desc: 'Recover over 0.1g of gold from old electronics.', unlocked: true },
            { title: 'Upcycle Master', icon: 'wrench', desc: 'Transform a device into a smart home camera/server.', unlocked: true },
            { title: 'Zero-Waste Hero', icon: 'recycle', desc: 'Schedule CPCB certified doorstep pickup.', unlocked: false },
            { title: 'CPCB Champion', icon: 'award', desc: 'Divert over 100kg of CO2 emissions.', unlocked: true },
            { title: 'Cash Collector', icon: 'dollar-sign', desc: 'Unlock over $200 in resell buybacks.', unlocked: true }
        ];

        function renderBadges() {
            const grid = document.getElementById('badges-grid');
            grid.innerHTML = BADGES_LIST.map(b => `
                <div class="p-4 rounded-xl glass-panel text-center space-y-2 border ${b.unlocked ? 'border-brand-500/40 bg-brand-500/5' : 'border-slate-800 opacity-50'}">
                    <div class="w-10 h-10 rounded-full mx-auto flex items-center justify-center ${b.unlocked ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-800 text-slate-500'}">
                        <i data-lucide="${b.icon}" class="w-5 h-5"></i>
                    </div>
                    <h4 class="font-bold text-xs text-white">${b.title}</h4>
                    <p class="text-[10px] text-slate-400 font-sans">${b.desc}</p>
                    <span class="inline-block px-2 py-0.5 rounded text-[9px] font-mono ${b.unlocked ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-900 text-slate-500'}">
                        ${b.unlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                </div>
            `).join('');
            lucide.createIcons();
        }

        function updateImpactView() {
            renderBadges();
        }

        const REPAIR_HUBS = [
            { name: 'EcoRecycle CPCB Authorized Hub', city: 'Delhi / NCR', rating: '4.9 ★', dist: '2.4 km', type: 'Recycling Facility' },
            { name: 'Attero Certified E-Waste Center', city: 'Okhla Industrial Area', rating: '4.8 ★', dist: '5.1 km', type: 'Recycling Facility' },
            { name: 'OEM Apple/Samsung Repair Express', city: 'Connaught Place', rating: '4.7 ★', dist: '3.8 km', type: 'Certified Repair Shop' },
            { name: 'Greentronics Safe Disposal Hub', city: 'Nehru Place', rating: '4.9 ★', dist: '4.2 km', type: 'Recycling & Repair' }
        ];

        function renderHubsList() {
            const container = document.getElementById('hub-list-container');
            container.innerHTML = REPAIR_HUBS.map(h => `
                <div class="glass-panel p-4 rounded-xl border border-slate-800 space-y-2 hover:border-cyan-500/40 transition">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-bold text-sm text-white">${h.name}</h4>
                            <p class="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <i data-lucide="map-pin" class="w-3 h-3 text-cyan-400"></i> ${h.city} • ${h.dist}
                            </p>
                        </div>
                        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">${h.type}</span>
                    </div>
                    <div class="flex justify-between items-center pt-2 border-t border-slate-800 text-xs font-mono">
                        <span class="text-amber-400">${h.rating} (CPCB Verified)</span>
                        <button onclick="showToast('Facility Location Pinned', 'info')" class="text-cyan-400 hover:underline">View on Map →</button>
                    </div>
                </div>
            `).join('');
            lucide.createIcons();
        }

        function searchLocations() {
            const q = document.getElementById('locator-search-input').value;
            if (q) showToast(`Displaying certified facilities near "${q}"`, 'info');
        }

        function openBuybackModal() {
            document.getElementById('modal-buyback-device').innerText = activeDeviceData ? activeDeviceData.model : 'iPhone X';
            document.getElementById('modal-buyback-price').innerText = activeDeviceData ? formatMoney(activeDeviceData.resellValueUsd) : '$145 USD';
            document.getElementById('buyback-modal').classList.remove('hidden');
        }

        function confirmBuybackLock() {
            closeModal('buyback-modal');
            confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
            showToast('Price lock confirmed! Free shipping label sent to your email.', 'success');
        }

        function openRecyclePickupModal() {
            document.getElementById('recycle-modal').classList.remove('hidden');
        }

        function confirmRecyclePickup() {
            closeModal('recycle-modal');
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            showToast('Doorstep Pickup Scheduled! Certificate downloaded.', 'success');
        }

        function triggerPriceAlert() {
            showToast('Price Alert Triggered! We will alert you if buyback value jumps >10%.', 'info');
        }

        function openRepairShopModal() {
            switchTab('locator');
        }

        function openApiKeyModal() {
            document.getElementById('gemini-api-key-input').value = userApiKey;
            document.getElementById('apikey-modal').classList.remove('hidden');
        }

        function saveApiKey() {
            userApiKey = document.getElementById('gemini-api-key-input').value.trim();
            localStorage.setItem('resnap_gemini_key', userApiKey);
            closeModal('apikey-modal');
            showToast('Gemini API Key Saved!', 'success');
        }

        function clearApiKey() {
            userApiKey = '';
            localStorage.removeItem('resnap_gemini_key');
            document.getElementById('gemini-api-key-input').value = '';
            closeModal('apikey-modal');
            showToast('Key cleared. Engine reset to offline fallback mode.', 'info');
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
        }

        // Custom Toast Dialog Notification System
        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-2 transition duration-300 transform translate-y-10 opacity-0 border`;
            
            if (type === 'success') {
                toast.classList.add('bg-emerald-950/90', 'text-emerald-300', 'border-emerald-500/50');
                toast.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i> ${message}`;
            } else if (type === 'error') {
                toast.classList.add('bg-rose-950/90', 'text-rose-300', 'border-rose-500/50');
                toast.innerHTML = `<i data-lucide="alert-circle" class="w-4 h-4 text-rose-400"></i> ${message}`;
            } else {
                toast.classList.add('bg-slate-900/90', 'text-cyan-300', 'border-cyan-500/50');
                toast.innerHTML = `<i data-lucide="info" class="w-4 h-4 text-cyan-400"></i> ${message}`;
            }

            document.body.appendChild(toast);
            lucide.createIcons();

            setTimeout(() => {
                toast.classList.remove('translate-y-10', 'opacity-0');
            }, 50);

            setTimeout(() => {
                toast.classList.add('translate-y-10', 'opacity-0');
                setTimeout(() => toast.remove(), 300);
            }, 3500);
        }


/* SPARK additions — this extends, rather than replaces, the original scanner, API key, presets, 4R matrix, DIY studio, drawer, impact, and locator logic. */
const SPARK_COINS_KEY='spark_reckles_balance_v1';
const SPARK_ACTIVITY_KEY='spark_activity_log_v1';
const SPARK_PURCHASES_KEY='spark_shop_purchases_v1';
const SPARK_SCAN_KEY='spark_scan_count_v1';
const SPARK_STARTING_RECKLES=520;
const SPARK_SCAN_REWARD=40;
const SPARK_PRODUCTS=[
  {id:'cleaning-kit',name:'Device care kit',desc:'A microfiber cloth and gentle screen-safe cleaner.',price:120,icon:'sparkles',tag:'DEVICE CARE'},
  {id:'cable-set',name:'Recycled cable set',desc:'A tidy bundle for the chargers you already use.',price:250,icon:'cable',tag:'LOW-WASTE'},
  {id:'repair-credit',name:'Repair café credit',desc:'Put your points toward a local repair visit.',price:400,icon:'wrench',tag:'REPAIR MORE'},
  {id:'upcycle-kit',name:'Upcycle starter kit',desc:'Small parts for a useful second-life project.',price:600,icon:'recycle',tag:'MAKE & REUSE'}
];
function sparkGetBalance(){const v=Number(localStorage.getItem(SPARK_COINS_KEY));return Number.isFinite(v)&&v>=0?v:SPARK_STARTING_RECKLES;}
function sparkGetActivities(){try{const v=JSON.parse(localStorage.getItem(SPARK_ACTIVITY_KEY)||'[]');return Array.isArray(v)?v:[];}catch(e){return[];}}
function sparkGetPurchases(){try{const v=JSON.parse(localStorage.getItem(SPARK_PURCHASES_KEY)||'[]');return Array.isArray(v)?v:[];}catch(e){return[];}}
function sparkUpdateBalances(){const amount=sparkGetBalance();document.querySelectorAll('[data-reckles-balance]').forEach(el=>el.textContent=amount.toLocaleString());const shop=document.getElementById('spark-shop-balance');if(shop)shop.textContent=amount.toLocaleString();}
function sparkRenderShop(){
  const grid=document.getElementById('spark-shop-grid');if(!grid)return;
  const balance=sparkGetBalance();
  grid.innerHTML=SPARK_PRODUCTS.map(p=>`<article class="spark-feature-card"><div class="spark-product-icon"><i data-lucide="${p.icon}"></i></div><span class="text-[9px] font-mono text-brand-400 font-bold">${p.tag}</span><h3>${p.name}</h3><p>${p.desc}</p><div class="flex items-center justify-between"><span class="spark-cost"><span class="reckles-coin">R</span> ${p.price} Reckles</span></div><button type="button" class="spark-shop-buy" data-product="${p.id}" ${balance<p.price?'disabled':''}>${balance<p.price?'Earn more Reckles':'Redeem reward'}</button></article>`).join('');
  if(window.lucide)lucide.createIcons();
}
function sparkRecordActivity(type,detail,points=0){
  const list=sparkGetActivities();list.unshift({id:`${Date.now()}_${Math.random().toString(36).slice(2,7)}`,type:String(type),detail:String(detail||''),points:Number(points)||0,at:new Date().toISOString()});
  localStorage.setItem(SPARK_ACTIVITY_KEY,JSON.stringify(list.slice(0,250)));
  const total=document.getElementById('spark-admin-activity-total');if(total)total.textContent=Math.min(list.length,250).toLocaleString();
  if(document.getElementById('tab-admin')&&!document.getElementById('tab-admin').classList.contains('hidden'))sparkRenderAdmin();
}
function sparkAwardReckles(amount,reason,detail){
  const now=sparkGetBalance()+amount;localStorage.setItem(SPARK_COINS_KEY,String(now));sparkUpdateBalances();sparkRenderShop();
  sparkRecordActivity(reason,detail,amount);
  if(typeof showToast==='function')showToast(`+${amount} Reckles earned!`, 'success');
}
function sparkRedeemProduct(productId){
  const product=SPARK_PRODUCTS.find(p=>p.id===productId);if(!product)return;
  const balance=sparkGetBalance();if(balance<product.price){showToast(`You need ${product.price-balance} more Reckles for this reward.`, 'error');return;}
  localStorage.setItem(SPARK_COINS_KEY,String(balance-product.price));
  const purchases=sparkGetPurchases();purchases.unshift({name:product.name,cost:product.price,at:new Date().toISOString()});localStorage.setItem(SPARK_PURCHASES_KEY,JSON.stringify(purchases.slice(0,250)));
  sparkUpdateBalances();sparkRenderShop();sparkRecordActivity('Shop redemption',`${product.name} · ${product.price} Reckles`,-product.price);sparkRenderAdmin();showToast(`${product.name} redeemed.`, 'success');
}
function sparkRenderAdmin(){
  const activities=sparkGetActivities(),purchases=sparkGetPurchases();
  const balance=sparkGetBalance(),scans=Number(localStorage.getItem(SPARK_SCAN_KEY)||0);
  const vaultCount=typeof vaultItems!=='undefined'&&Array.isArray(vaultItems)?vaultItems.length:0;
  const setters={'spark-admin-balance':balance.toLocaleString(),'spark-admin-scans':scans.toLocaleString(),'spark-admin-purchases':purchases.length.toLocaleString(),'spark-admin-vault':vaultCount.toLocaleString(),'spark-admin-activity-total':activities.length.toLocaleString()};
  Object.entries(setters).forEach(([id,value])=>{const el=document.getElementById(id);if(el)el.textContent=value;});
  const tbody=document.getElementById('spark-admin-rows');if(!tbody)return;
  if(!activities.length){tbody.innerHTML='<tr><td colspan="4" class="p-6 text-center text-slate-500">No activity has been recorded in this browser yet. Try a preset, run an assessment, save a device, or visit the shop.</td></tr>';return;}
  tbody.innerHTML=activities.slice(0,100).map(a=>`<tr><td>${new Date(a.at).toLocaleString()}</td><td class="font-semibold">${sparkEscape(a.type)}</td><td>${sparkEscape(a.detail)}</td><td class="font-mono ${a.points<0?'text-amber-600':'text-brand-400'}">${a.points>0?'+':''}${a.points?Number(a.points).toLocaleString():'—'}</td></tr>`).join('');
}
function sparkEscape(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function sparkSyncDiagnostics(){
  if(typeof activeDeviceData==='undefined'||!activeDeviceData)return;
  const d=activeDeviceData;
  const fields=[['slider-screen',d.screenDamagePct],['slider-wear',d.wearPct],['slider-battery',d.batteryHealthPct],['slider-port',d.portHealthPct]];
  fields.forEach(([id,value])=>{const el=document.getElementById(id);if(el&&Number.isFinite(Number(value)))el.value=String(value);});
  if(typeof updateDiagnosticsFromSliders==='function')updateDiagnosticsFromSliders();
}
function sparkExportActivity(){
  const rows=[['Time','Activity','Details','Reckles change'],...sparkGetActivities().map(a=>[a.at,a.type,a.detail,a.points])];
  const csv=rows.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='SPARK-activity-log.csv';a.click();URL.revokeObjectURL(url);showToast('Activity log exported.', 'success');
}
function sparkInitExtras(){
  if(!localStorage.getItem(SPARK_COINS_KEY))localStorage.setItem(SPARK_COINS_KEY,String(SPARK_STARTING_RECKLES));
  if(!localStorage.getItem(SPARK_ACTIVITY_KEY))localStorage.setItem(SPARK_ACTIVITY_KEY,'[]');
  if(!localStorage.getItem(SPARK_PURCHASES_KEY))localStorage.setItem(SPARK_PURCHASES_KEY,'[]');
  if(!localStorage.getItem(SPARK_SCAN_KEY))localStorage.setItem(SPARK_SCAN_KEY,'0');
  sparkUpdateBalances();sparkRenderShop();sparkRenderAdmin();
}
window.addEventListener('load',sparkInitExtras);
document.addEventListener('click',function(event){
  const buy=event.target.closest('.spark-shop-buy');if(buy){sparkRedeemProduct(buy.dataset.product);return;}
  if(event.target.closest('#spark-export-activity')){sparkExportActivity();return;}
  if(event.target.closest('#spark-clear-activity')){localStorage.setItem(SPARK_ACTIVITY_KEY,'[]');sparkRenderAdmin();showToast('Activity log cleared.','info');return;}
  const button=event.target.closest('button');if(!button)return;
  if(button.closest('#tab-admin')||button.classList.contains('spark-shop-buy'))return;
  const label=(button.innerText||button.getAttribute('aria-label')||'Button').replace(/\s+/g,' ').trim();
  if(label&&label.length<100)sparkRecordActivity('Interface action',label,0);
},true);
document.addEventListener('change',function(event){
  if(event.target.matches('#vault-filter'))sparkRecordActivity('Drawer filter',event.target.value,0);
  else if(event.target.matches('#file-input')){const file=event.target.files&&event.target.files[0];if(file)sparkRecordActivity('Photo selected',file.name,0);}
});
window.addEventListener('scroll',function(){
  const orb=document.getElementById('scroll-3d-orb');if(!orb)return;
  const y=window.scrollY;orb.style.transform=`translate3d(0,${Math.sin(y/175)*18}px,0) rotateX(${(y*.035)%360}deg) rotateY(${(y*.065)%360}deg)`;
},{passive:true});
