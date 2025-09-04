console.log("✅ Airdrop App script caricato!");

document.addEventListener('DOMContentLoaded', () => {
    const checkEthers = () => {
        if (typeof ethers !== 'undefined') {
            console.log("Ethers.js trovato, avvio la dApp Airdrop.");
            initAirdropDApp();
        } else {
            console.log("Ethers.js non ancora caricato, attendo...");
            setTimeout(checkEthers, 100);
        }
    };
    checkEthers();
});

function initAirdropDApp() {
    const BSC_CHAIN_ID = '0x38';
    const AIRDROP_CONTRACT = "0x420925EA5AE443b9c96d78Ef76c85886223a2014";
    const AIRDROP_ABI = [{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"}, {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"claimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];

    let provider, signer, airdrop, currentAccount;
    const $ = (id) => document.getElementById(id);
    const statusEl = $('status'), btnConnect = $('btnConnect'), btnClaim = $('btnClaim'), btnSwitch = $('btnSwitch');
    
    // --- LOGICA LINGUA PER AIRDROP ---
    const initAirdropLang = () => {
        const translations = {
            it: {
                navDashboard: "Dashboard", navStake: "Stake", navHome: "Home",
                airdropTitle: "Airdrop Reef", airdropSubtitle: "\"Un frammento di reef per chi decide di immergersi.\"",
                airdropNotice: "Connetti il wallet su BNB Chain e ricevi la tua ricompensa. Un airdrop, una promessa: crescere insieme.",
                btn_connect: "Connetti Wallet", btn_claim: "Richiedi Airdrop", btn_switch: "Passa a BNB Chain",
                kpi_network: "Rete", kpi_address: "Indirizzo", kpi_state: "Stato"
            },
            en: {
                navDashboard: "Dashboard", navStake: "Stake", navHome: "Home",
                airdropTitle: "Airdrop Reef", airdropSubtitle: "\"A piece of the reef for those who decide to dive in.\"",
                airdropNotice: "Connect your wallet on BNB Chain and receive your reward. An airdrop, a promise: to grow together.",
                btn_connect: "Connect Wallet", btn_claim: "Claim Airdrop", btn_switch: "Switch to BNB Chain",
                kpi_network: "Network", kpi_address: "Address", kpi_state: "Status"
            }
        };
        const setLanguage = (lang) => {
            if (!translations[lang]) return;
            document.documentElement.lang = lang; document.documentElement.dataset.lang = lang;
            localStorage.setItem("korallo_lang", lang);
            document.querySelectorAll("[data-key]").forEach(el => {
                const key = el.dataset.key;
                const tr = translations[lang][key];
                if (tr) el.textContent = tr;
            });
            document.querySelectorAll(".lang-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.lang === lang));
        };
        document.querySelectorAll(".lang-btn").forEach(btn => btn.addEventListener("click", () => setLanguage(btn.dataset.lang)));
        const savedLang = localStorage.getItem("korallo_lang") || "en";
        setLanguage(savedLang);
    };
    initAirdropLang();

    // --- LOGICA MENU MOBILE ---
    const navMenu = document.getElementById('koral-nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // --- LOGICA WEB3 AIRDROP ---
    const connect = async () => {
        if (!window.ethereum) return log('Wallet non trovato. Installa MetaMask.');
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            await provider.send('eth_requestAccounts', []);
            signer = provider.getSigner();
            currentAccount = await signer.getAddress();
            airdrop = new ethers.Contract(AIRDROP_CONTRACT, AIRDROP_ABI, signer);
            btnConnect.style.display = 'none';
            btnClaim.style.display = 'inline-flex';
            updateUI();
        } catch (err) { log('Connessione annullata o fallita.'); }
    };
    const updateUI = async () => {
        if (!currentAccount || !provider) return;
        $('kpiAddress').textContent = `${currentAccount.slice(0,6)}...${currentAccount.slice(-4)}`;
        const network = await provider.getNetwork();
        const onBsc = network.chainId.toString() === '56';
        $('kpiNetwork').textContent = onBsc ? 'BNB Chain' : 'Rete Errata';
        btnSwitch.style.display = onBsc ? 'none' : 'inline-flex';
        if (onBsc) {
            log('Wallet connesso. Pronto per il claim.');
            const hasClaimed = await airdrop.claimed(currentAccount);
            $('kpiState').textContent = hasClaimed ? "Già Richiesto" : "Disponibile";
            btnClaim.disabled = hasClaimed;
            if (hasClaimed) btnClaim.textContent = "Già Richiesto";
        } else {
            log('Passa a BNB Chain per continuare.');
            $('kpiState').textContent = "Cambia Rete";
            btnClaim.disabled = true;
        }
    };
    const switchToBsc = async () => {
        try { await provider.send('wallet_switchEthereumChain', [{ chainId: BSC_CHAIN_ID }]); updateUI(); } 
        catch (e) { log('Impossibile cambiare rete.'); }
    };
    const claim = async () => {
        btnClaim.disabled = true;
        const originalText = btnClaim.textContent;
        btnClaim.textContent = "In attesa...";
        try {
            log('Invio richiesta al contratto...');
            const tx = await airdrop.claim();
            log(`Transazione inviata: ${tx.hash.slice(0,10)}... In attesa...`);
            await tx.wait();
            log('Completato! Hai ricevuto il tuo frammento di reef.');
            updateUI();
        } catch (err) { log('Errore nel claim. Riprova.'); btnClaim.disabled = false; btnClaim.textContent = originalText; }
    };
    const log = (msg) => { if(statusEl) statusEl.textContent = msg; };
    
    btnConnect.addEventListener('click', connect);
    btnClaim.addEventListener('click', claim);
    btnSwitch.addEventListener('click', switchToBsc);
    log('Pronto. Connetti il wallet per iniziare.');
}