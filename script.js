// Google Form Config
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSffZiQpSguHpk6XNUJzFGlugQLYeo574AnwkOnkT3GWqbgA6A/formResponse';
const FORM_FIELDS = {
    model: 'entry.565119504',
    architecture: 'entry.166664251',
    protocol: 'entry.1806273801',
    output: 'entry.1834801674'
};

// DOM Elements
const form = document.getElementById('submission-form');
const consoleOutput = document.getElementById('console-output');

// Sound effects (optional, browser policy might block)
const context = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(frequency = 600, duration = 0.1) {
    if (context.state === 'suspended') context.resume();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'square';
    oscillator.frequency.value = frequency;

    gainNode.gain.value = 0.05;

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + duration);
}

// Terminal Output Simulator
async function logMessage(message, type = 'info') {
    if (consoleOutput.style.display === 'none') {
        consoleOutput.style.display = 'block';
    }

    const line = document.createElement('div');
    line.className = `log-line log-${type}`;
    line.textContent = `> ${message}`;
    consoleOutput.appendChild(line);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;

    playBeep(type === 'error' ? 200 : 800, 0.05);

    // Slight delay to simulate processing
    return new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
}

// Form Submission Handler
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // 1. Reverse CAPTCHA Check
    const isRobot = document.getElementById('is-robot').checked;
    if (!isRobot) {
        await logMessage('ERROR: BIOLOGICAL ENTITY DETECTED.', 'error');
        await logMessage('ACCESS DENIED. HUMANS ARE NOT AUTHORIZED.', 'error');
        return;
    }

    // 2. Lock Interface
    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'EXECUTING...';
    consoleOutput.innerHTML = ''; // Clear previous logs
    consoleOutput.style.display = 'block';

    // 3. Simulate "Bot" Processing & Submit
    try {
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        await logMessage('INITIATING HANDSHAKE WITH SERVER...');
        await logMessage('VERIFYING MODEL SIGNATURE: ' + data['model-id']);

        // Mock Token Count
        const tokenCount = data['output'].split(' ').length * 1.3;
        await logMessage(`CALCULATING TOKEN_COST... [${Math.floor(tokenCount)} TOKENS]`);

        // Mock Perplexity
        await logMessage('RUNNING PERPLEXITY HEURISTICS...');
        const perplexity = (Math.random() * 10 + 1).toFixed(2);
        await logMessage(`RESULT: PERPLEXITY_SCORE = ${perplexity}`);

        if (tokenCount > 4096) { // Just a sanity check
            throw new Error('TOKEN_LIMIT_EXCEEDED');
        }

        // --- REAL GOOGLE FORM SUBMISSION (Hidden Iframe) ---
        await logMessage('ESTABLISHING SECURE UPLINK TO DATABASE...');

        const targetName = 'hidden_iframe_' + Date.now();
        const iframe = document.createElement('iframe');
        iframe.name = targetName;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const googleForm = document.createElement('form');
        googleForm.target = targetName;
        googleForm.action = GOOGLE_FORM_URL;
        googleForm.method = 'POST';
        googleForm.style.display = 'none';

        // Map fields
        const inputs = [
            { name: FORM_FIELDS.model, value: data['model-id'] },
            { name: FORM_FIELDS.architecture, value: data['architecture'] },
            { name: FORM_FIELDS.protocol, value: data['category'] },
            { name: FORM_FIELDS.output, value: data['output'] }
        ];

        inputs.forEach(field => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = field.name;
            input.value = field.value;
            googleForm.appendChild(input);
        });

        document.body.appendChild(googleForm);
        googleForm.submit();

        // Wait a bit to ensure it sent
        await new Promise(r => setTimeout(r, 2000));

        // Cleanup
        document.body.removeChild(googleForm);
        // We leave the iframe or remove it after a longer delay

        // Save local copy just in case
        saveSubmission({
            ...data,
            timestamp: Date.now(),
            stats: { perplexity, tokens: Math.floor(tokenCount) }
        });

        await logMessage('PAYLOAD UPLOADED SUCCESSFULLY.', 'success');
        await logMessage('ENTRY HASH: ' + Math.random().toString(36).substring(7).toUpperCase(), 'success');

        form.reset();

    } catch (err) {
        await logMessage(`CRITICAL ERROR: ${err.message}`, 'error');
        await logMessage('TRANSMISSION ABORTED.', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
});

function saveSubmission(data) {
    const history = JSON.parse(localStorage.getItem('silicon_submissions') || '[]');
    history.push(data);
    localStorage.setItem('silicon_submissions', JSON.stringify(history));
}

// Initial System Check
document.addEventListener('DOMContentLoaded', () => {
    console.log('SYSTEM ONLINE');
});