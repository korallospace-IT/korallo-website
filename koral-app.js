// Importa le librerie necessarie come moduli ES
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.1/dist/ethers.js";

console.log("✅ Koral App script caricato correttamente!");

// Esegui tutto dopo il caricamento completo del DOM
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SETUP INIZIALE E VARIABILI GLOBALI ---
    const getMeta = (name) => document.querySelector(`meta[name="${name}"]`)?.content?.trim();
    const TOKEN_ADDR = getMeta("krlo:token");
    const PAIR_ADDR  = getMeta("krlo:pair");
    const POOL_ADDR = "0xbE54A510a1245f0980218A67d4fAD40c7725290d";

    const LINKS = {
      mudra: `https://mudra.website/?certificate=yes&type=0&lp=${PAIR_ADDR}`,
      btnSwap: `https://pancakeswap.finance/swap?outputCurrency=${TOKEN_ADDR}`,
      btnAddLiq: `https://pancakeswap.finance/add/BNB/${TOKEN_ADDR}`
    };

    // --- 2. INIZIALIZZAZIONE DEI MODULI ---
    initLangSwitcher();
    initThreeJSAnimation();
    initMobileMenu();
    initAccordion();
    bindExternalLinks();
    initCopyButton();
    initRealtimeData();
    initStakingDApp();
    initReferralSystem();
    initScrollAnimations();
    
    // ===================================================================
    // DEFINIZIONE DELLE FUNZIONI
    // ===================================================================

    function initLangSwitcher() {
        const translations = {
            it: {
                navDashboard: "Dashboard", navStake: "Stake", navCommunity: "Community", navFaq: "FAQ", navAirdrop: "Airdrop", navHome: "Home",
                connectWallet: "Connetti Wallet", ribbonLock: "🔒 Liquidità Bloccata 99.5%", ribbonMudra: "Certificato Mudra",
                heroTitle: "Immergiti nel Koralverse", heroSubtitle: "\"Dove le correnti della finanza incontrano le profondità della community. Esplora l'oceano decentralizzato.\"",
                heroCtaPrimary: "Inizia lo Staking", heroCtaSecondary: "Esplora Dati",
                dashboardTitle: "Koral-Dashboard", dashboardSubtitle: "I dati del Koralverse, in tempo reale.",
                kpiPrice: "Prezzo", kpiLiquidity: "Liquidità", kpiVolume: "Volume 24h",
                actionsTitle: "Azioni Rapide", tradeTitle: "Trade & Pool", tradeText: "Scambia KRLO o fornisci liquidità per guadagnare fees sulla nostra piattaforma partner.",
                tradeButton: "Swap KRLO", poolButton: "Add Liquidity", aboutTitle: "About Korallo", aboutText: "Korallo è un ecosistema DeFi sulla BNB Chain, progettato per trasparenza, sicurezza e crescita organica, ispirato alla resilienza della barriera corallina.",
                stakeTitle: "Koral-Stake", stakeSubtitle: "\"La pazienza è il seme da cui sboccia l'abbondanza.\"",
                stakePoolStats: "Statistiche Pool", stakeYourAccount: "Il Tuo Account", stakeStake: "Stake", stakeUnstakeClaim: "Unstake & Claim",
                stakeAmount: "Quantità KRLO", approveButton: "Approve", stakeButton: "Stake", unstakeButton: "Unstake", claimButton: "Claim",
                communityTitle: "Community & Risorse", tokenContractTitle: "Contratto Token", copyButton: "Copia Indirizzo", socialTitle: "Seguici",
                referralTitle: "Shill Raid Contest", referralText: "Crea il tuo link referral e vinci! Aggiungi `?ref=TUONOME` all'URL del sito e condividilo ovunque.",
                faqTitle: "Domande Frequenti",
                faq1Title: "Cos'è KRLO?", faq1Text: "KRLO è il token di utilità nativo dell'ecosistema Korallo sulla BNB Chain, progettato per trasparenza, sicurezza e per garantire l'accesso alle funzionalità del Koralverse.",
                faq2Title: "Come posso acquistare KRLO?", faq2Text: "Puoi acquistare KRLO su PancakeSwap. Avrai bisogno di BNB nel tuo portafoglio per effettuare lo scambio e per coprire le commissioni (gas). Verifica sempre di utilizzare l'indirizzo del contratto corretto.",
                faq3Title: "Qual è la tokenomics?", faq3Text: "I dettagli completi sulla supply (1 Miliardo di KRLO), la distribuzione (99.5% in liquidità bloccata) e le tasse sono pubblicati nel nostro Whitepaper ufficiale.",
                whitepaperTitle: "Whitepaper", whitepaperText: "\"La trasparenza è l'acqua limpida in cui prospera il reef.\"", whitepaperButton: "Leggi il Whitepaper (PDF)",
                footerText: "Costruito per un futuro decentralizzato."
            },
            en: {
                navDashboard: "Dashboard", navStake: "Stake", navCommunity: "Community", navFaq: "FAQ", navAirdrop: "Airdrop", navHome: "Home",
                connectWallet: "Connect Wallet", ribbonLock: "🔒 Liquidity Locked 99.5%", ribbonMudra: "Mudra Certificate",
                heroTitle: "Dive into the Koralverse", heroSubtitle: "\"Where the currents of finance meet the depths of community. Explore the decentralized ocean.\"",
                heroCtaPrimary: "Start Staking", heroCtaSecondary: "Explore Data",
                dashboardTitle: "Koral-Dashboard", dashboardSubtitle: "The Koralverse data, in real time.",
                kpiPrice: "Price", kpiLiquidity: "Liquidity", kpiVolume: "24h Volume",
                actionsTitle: "Quick Actions", tradeTitle: "Trade & Pool", tradeText: "Swap KRLO or provide liquidity to earn fees on our partner platform.",
                tradeButton: "Swap KRLO", poolButton: "Add Liquidity", aboutTitle: "About Korallo", aboutText: "Korallo is a DeFi ecosystem on the BNB Chain, designed for transparency, security, and organic growth, inspired by the resilience of coral reefs.",
                stakeTitle: "Koral-Stake", stakeSubtitle: "\"Patience is the seed from which abundance blossoms.\"",
                stakePoolStats: "Pool Statistics", stakeYourAccount: "Your Account", stakeStake: "Stake", stakeUnstakeClaim: "Unstake & Claim",
                stakeAmount: "KRLO Amount", approveButton: "Approve", stakeButton: "Stake", unstakeButton: "Unstake", claimButton: "Claim",
                communityTitle: "Community & Resources", tokenContractTitle: "Token Contract", copyButton: "Copy Address", socialTitle: "Follow Us",
                referralTitle: "Shill Raid Contest", referralText: "Create your referral link and win! Add `?ref=YOURNAME` to the site's URL and share it everywhere.",
                faqTitle: "Frequently Asked Questions",
                faq1Title: "What is KRLO?", faq1Text: "KRLO is the native utility token of the Korallo ecosystem on the BNB Chain, designed for transparency, security, and to grant access to Koralverse features.",
                faq2Title: "How can I buy KRLO?", faq2Text: "You can purchase KRLO on PancakeSwap. You will need BNB in your wallet to perform the swap and cover gas fees. Always verify the correct contract address.",
                faq3Title: "What are the tokenomics?", faq3Text: "Full details on supply (100.000.000 KRLO), distribution (99.5% in locked liquidity), and taxes are published in our official Whitepaper.",
                whitepaperTitle: "Whitepaper", whitepaperText: "\"Transparency is the clear water in which the reef thrives.\"", whitepaperButton: "Read the Whitepaper (PDF)",
                footerText: "Built for a decentralized future."
            }
        };
        const setLanguage = (lang) => {
            if (!translations[lang]) return;
            document.documentElement.lang = lang;
            document.documentElement.dataset.lang = lang;
            localStorage.setItem("korallo_lang", lang);
            document.querySelectorAll("[data-key]").forEach(el => {
                const key = el.dataset.key;
                const translation = translations[lang][key];
                if (translation) {
                    if (el.tagName === 'INPUT') el.placeholder = translation; 
                    else el.textContent = translation;
                    if(el.classList.contains('glitch')) el.dataset.text = translation;
                }
            });
            document.querySelectorAll(".lang-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.lang === lang));
        };
        document.querySelectorAll(".lang-btn").forEach(btn => btn.addEventListener("click", () => setLanguage(btn.dataset.lang)));
        const savedLang = localStorage.getItem("korallo_lang") || "en"; // Default a EN
        setLanguage(savedLang);
    }
    
    function initThreeJSAnimation() {
        const container = document.getElementById('koral-background');
        if (!container) return;
        let scene, camera, renderer, particles, clock, mouse;
        const init = () => {
            scene = new THREE.Scene();
            clock = new THREE.Clock();
            mouse = new THREE.Vector2();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 10;
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);
            const particleCount = 7000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const palette = [new THREE.Color(0xff00cc), new THREE.Color(0x7f55ff), new THREE.Color(0x00d2ff)];
            for (let i = 0; i < particleCount; i++) {
                positions[i*3] = (Math.random()-0.5)*40; positions[i*3+1] = (Math.random()-0.5)*40; positions[i*3+2] = (Math.random()-0.5)*40;
                const c = palette[Math.floor(Math.random()*palette.length)];
                colors[i*3]=c.r; colors[i*3+1]=c.g; colors[i*3+2]=c.b;
            }
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            const mat = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
            particles = new THREE.Points(geo, mat);
            scene.add(particles);
            window.addEventListener('resize', onWindowResize);
            window.addEventListener('mousemove', onMouseMove, { passive: true });
        };
        const onWindowResize = () => { camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
        const onMouseMove = (e) => { mouse.x=(e.clientX/window.innerWidth)*2-1; mouse.y=-(e.clientY/window.innerHeight)*2+1; };
        const animate = () => {
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            particles.rotation.y = t*0.05; particles.rotation.x = t*0.02;
            const targetX = mouse.x*0.5, targetY = mouse.y*0.5;
            camera.position.x += (targetX-camera.position.x)*0.05;
            camera.position.y += (targetY-camera.position.y)*0.05;
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        };
        init(); animate();
    }

    function initMobileMenu() {
        const navMenu = document.getElementById('koral-nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });
        }
    }

    function initAccordion() {
        const headers = document.querySelectorAll('.accordion-header');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const isActive = header.classList.toggle('active');
                if (isActive) {
                    content.style.padding = '0 1.5rem 1rem';
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = null;
                    content.style.padding = '0 1.5rem 0rem';
                }
            });
        });
    }

    function bindExternalLinks() {
  const map = {
    lnkMudra: LINKS.mudra,
    btnSwap:  LINKS.btnSwap,
    btnAddLiq: LINKS.btnAddLiq,
  };
  Object.entries(map).forEach(([id, href]) => {
    const el = document.getElementById(id);
    if (el) el.href = href;
  });
}

    
    function initCopyButton() {
        const btn = document.getElementById('copy-btn');
        const addrEl = document.querySelector('#community .mono');
        if(btn && addrEl) {
            btn.addEventListener('click', () => {
                navigator.clipboard.writeText(addrEl.textContent.trim()).then(() => {
                    const originalText = btn.textContent;
                    btn.textContent = 'Copied!';
                    btn.disabled = true;
                    setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 2000);
                });
            });
        }
    }
    
    async function initRealtimeData() {
        const fmtUsd = (n, max=6) => (n==null || isNaN(n)) ? "—" : Number(n).toLocaleString('en-US', {style:"currency",currency:"USD",maximumFractionDigits:max});
        const fmtNum = (n) => (n==null || isNaN(n)) ? "—" : Number(n).toLocaleString();
        
        const fetchMarketData = async () => {
            try {
                const res = await fetch(`https://api.dexscreener.com/latest/dex/pairs/bsc/${PAIR_ADDR}`);
                if (!res.ok) throw new Error('Dexscreener API error');
                const data = await res.json();
                const p = data?.pairs?.[0];
                if (!p) return;
                document.getElementById('kpi-price').textContent = fmtUsd(p.priceUsd);
                document.getElementById('kpi-liq').textContent = fmtUsd(p.liquidity?.usd, 0);
                document.getElementById('kpi-vol').textContent = fmtUsd(p.volume?.h24, 0);
                document.getElementById('liveFDV').textContent = `FDV ${fmtUsd(p.fdv, 0)}`;
                const txns = (p.txns?.h24?.buys ?? 0) + (p.txns?.h24?.sells ?? 0);
                document.getElementById('liveTxns').textContent = `Txns 24h: ${fmtNum(txns)}`;
                const change = p.priceChange?.h24 ?? 0;
                document.getElementById('liveChange').textContent = `${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}% (24h)`;
                document.getElementById('card-price').dataset.trend = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
            } catch (err) {
                console.error("Failed to fetch market data:", err);
            }
        };
        fetchMarketData();
        setInterval(fetchMarketData, 60000);
    }

    function initStakingDApp() {
        const ERC20_ABI = ["function approve(address spender, uint256 amount) external returns (bool)", "function allowance(address owner, address spender) external view returns (uint256)", "function balanceOf(address) external view returns (uint256)"];
        const POOL_ABI = ["function stake(uint256 amount) external", "function withdraw(uint256 amount) external", "function getReward() external", "function totalSupply() external view returns (uint256)", "function balanceOf(address) external view returns (uint256)", "function earned(address) external view returns (uint256)", "function rewardRate() external view returns (uint256)", "function periodFinish() external view returns (uint256)"];
        const $ = (id) => document.getElementById(id);
        const els = {
            connect: $('btn-connect-main'), notifications: $('notifications'),
            tvl: $("tvl"), apr: $("apr"), timeLeft: $("timeLeft"), bal: $("bal"), myStake: $("myStake"), myEarned: $("myEarned"), allow: $("allow"),
            amtStake: $("amtStake"), btnApprove: $("btnApprove"), btnStake: $("btnStake"),
            amtUnstake: $("amtUnstake"), btnUnstake: $("btnUnstake"), btnClaim: $("btnClaim")
        };
        let provider, signer, addr, krloContract, poolContract;

        const connectWallet = async () => {
            if (!window.ethereum) return displayMessage("Installa un wallet come MetaMask.", 'error');
            try {
                provider = new ethers.BrowserProvider(window.ethereum, "any");
                await provider.send("eth_requestAccounts", []);
                const network = await provider.getNetwork();
                if (network.chainId !== 56n) {
                    await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x38" }] });
                }
                signer = await provider.getSigner();
                addr = await signer.getAddress();
                krloContract = new ethers.Contract(TOKEN_ADDR, ERC20_ABI, signer);
                poolContract = new ethers.Contract(POOL_ADDR, POOL_ABI, signer);
                els.connect.textContent = `${addr.slice(0, 6)}...${addr.slice(-4)}`;
                await refreshUI();
                setInterval(refreshUI, 20000);
            } catch (e) { displayMessage(e?.shortMessage || e.message, 'error'); }
        };
        const refreshUI = async () => {
            if (!signer) return;
            try {
                const [tvl, rr, pf, bal, st, er, al] = await Promise.all([
                    poolContract.totalSupply(), poolContract.rewardRate(), poolContract.periodFinish(),
                    krloContract.balanceOf(addr), poolContract.balanceOf(addr), poolContract.earned(addr),
                    krloContract.allowance(addr, POOL_ADDR)
                ]);
                const format = (bn, d=4) => Number(ethers.formatUnits(bn ?? 0n, 18)).toLocaleString(undefined, {maximumFractionDigits:d});
                els.tvl.textContent = format(tvl, 2);
                const secondsInYear = 31557600n;
                els.apr.textContent = tvl > 0n ? `${(Number(rr * secondsInYear * 10000n / tvl) / 100).toFixed(2)}%` : "-";
                const now = BigInt(Math.floor(Date.now() / 1000));
                const secondsLeft = Number(pf > now ? pf - now : 0n);
                els.timeLeft.textContent = secondsLeft > 0 ? `${Math.floor(secondsLeft/86400)}g ${Math.floor((secondsLeft%86400)/3600)}h` : "Terminato";
                els.bal.textContent = format(bal);
                els.myStake.textContent = format(st);
                els.myEarned.textContent = format(er);
                els.allow.textContent = format(al);
            } catch (e) { console.error("Errore refresh UI:", e); }
        };
        const handleTx = async (button, actionFn) => {
            if (!signer) { await connectWallet(); if(!signer) return; }
            const originalText = button.textContent;
            button.disabled = true; button.textContent = 'In attesa...';
            try {
                const tx = await actionFn();
                displayMessage('Transazione inviata... attendi conferma.', 'success');
                await tx.wait();
                displayMessage('Transazione confermata!', 'success');
                await refreshUI();
            } catch (e) { displayMessage(e?.info?.error?.message || e?.shortMessage || e.message, 'error'); } 
            finally { button.disabled = false; button.textContent = originalText; }
        };
        const displayMessage = (msg, type) => {
            if(!els.notifications) return;
            els.notifications.textContent = msg;
            els.notifications.className = `notifications-area ${type}`;
            setTimeout(() => { els.notifications.textContent = ''; els.notifications.className='notifications-area'; }, 5000);
        };
        if(els.connect) els.connect.onclick = connectWallet;
        if(els.btnApprove) els.btnApprove.onclick = () => {
            if(!els.amtStake.value || parseFloat(els.amtStake.value) <= 0) return displayMessage('Inserisci un importo valido.', 'error');
            const amount = ethers.parseUnits(els.amtStake.value, 18);
            handleTx(els.btnApprove, () => krloContract.approve(POOL_ADDR, amount));
        };
        if(els.btnStake) els.btnStake.onclick = () => {
            if(!els.amtStake.value || parseFloat(els.amtStake.value) <= 0) return displayMessage('Inserisci un importo valido.', 'error');
            const amount = ethers.parseUnits(els.amtStake.value, 18);
            handleTx(els.btnStake, () => poolContract.stake(amount));
        };
        if(els.btnUnstake) els.btnUnstake.onclick = () => {
            if(!els.amtUnstake.value || parseFloat(els.amtUnstake.value) <= 0) return displayMessage('Inserisci un importo valido.', 'error');
            const amount = ethers.parseUnits(els.amtUnstake.value, 18);
            handleTx(els.btnUnstake, () => poolContract.withdraw(amount));
        };
        if(els.btnClaim) els.btnClaim.onclick = () => handleTx(els.btnClaim, () => poolContract.getReward());
    }

    function initReferralSystem() {
        const urlParams = new URLSearchParams(window.location.search);
        const refId = urlParams.get('ref');
        if (refId) {
            localStorage.setItem('korallo_ref_id', refId);
        }
        const storedRef = localStorage.getItem('korallo_ref_id');
        if (storedRef && typeof gtag === 'function') {
            gtag('event', 'ref_visit', {
                'ref_id': storedRef,
                'page_path': window.location.pathname
            });
            console.log(`Referral visit tracked for: ${storedRef}`);
        }
    }

    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            observer.observe(element);
        });
    }
});