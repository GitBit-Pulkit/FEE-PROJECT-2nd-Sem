// ========== QUESTIONS ==========
const questions = [
    {
        text: "How do you recharge after a long day?",
        options: ["Alone time with music or a show", "Hanging out with friends", "Doing something creative", "Sleeping. Just sleeping."]
    },
    {
        text: "What's your ideal weekend?",
        options: ["Exploring somewhere new", "Staying home in cozy mode", "Going out with the squad", "Catching up on everything I missed"]
    },
    {
        text: "How do you handle conflict?",
        options: ["Talk it out immediately", "Take space then come back", "Avoid it until it disappears", "Send a long text message"]
    },
    {
        text: "What drives you most?",
        options: ["Success and recognition", "Happiness and peace", "Making others proud", "Proving people wrong"]
    },
    {
        text: "Pick an aesthetic:",
        options: ["Dark and mysterious", "Bright and colorful", "Minimal and clean", "Chaotic and fun"]
    },
    {
        text: "Your signature move is:",
        options: ["Walking into rooms like I own them", "Making everyone laugh", "Being the wise friend", "Showing up unannounced"]
    }
];

// ========== PERSONALITY TYPES ==========
const personalities = [
    {
        name: "THE VISIONARY",
        title: "Born to Lead, Built to Inspire",
        tagline: "You don't follow paths — you create them.",
        description: "You're a natural leader with an unstoppable drive. Your mind is always five steps ahead, dreaming up possibilities others can't even imagine. You inspire people without trying, and your confidence is magnetic.",
        strengths: ["Strategic thinking", "Natural leadership", "Inspiring others", "Big picture focus"],
        weaknesses: ["Can be impatient", "Forgets self-care", "Too hard on yourself"],
        element: "🔥 Fire",
        powerColor: "#ffd700",
        advice: "Your biggest flex is your mind. But even visionaries need rest. Schedule 'nothing time' — it's where your best ideas will find you."
    },
    {
        name: "THE DREAMER",
        title: "Your Imagination Knows No Limits",
        tagline: "Reality is overrated anyway.",
        description: "You live in a world of possibilities. Your creativity is endless, and you see beauty in places others overlook. You feel deeply, love fiercely, and express yourself in ways that leave people in awe.",
        strengths: ["Creativity", "Empathy", "Intuition", "Adaptability"],
        weaknesses: ["Overthinking", "Escapism", "Sensitive to criticism"],
        element: "💨 Air",
        powerColor: "#9b59b6",
        advice: "Your imagination is your superpower. But don't forget to ground yourself — the world needs your ideas in action."
    },
    {
        name: "THE HEALER",
        title: "The Friend Everyone Needs",
        tagline: "You carry light without even realizing it.",
        description: "You're the emotional backbone of your circle. People naturally open up to you because you listen without judgment. Your presence is calming, your words are comforting.",
        strengths: ["Empathy", "Patience", "Loyalty", "Emotional intelligence"],
        weaknesses: ["Takes on others' problems", "Forgets own needs", "People-pleasing"],
        element: "💧 Water",
        powerColor: "#2ecc71",
        advice: "You can't pour from an empty cup. Set boundaries — not because you don't care, but because you care enough to show up as your full self."
    },
    {
        name: "THE REBEL",
        title: "Rules Are Just Suggestions",
        tagline: "Normal is boring. You were born to stand out.",
        description: "You march to the beat of your own drum. You challenge the status quo, question everything, and refuse to fit in boxes. Your authenticity is refreshing, your humor is sharp.",
        strengths: ["Authenticity", "Courage", "Humor", "Independent thinking"],
        weaknesses: ["Stubbornness", "Impulsivity", "Difficulty with authority"],
        element: "🌍 Earth",
        powerColor: "#e74c3c",
        advice: "Your rebellion is beautiful. But sometimes, playing the game strategically gets you further than burning the whole system down."
    }
];

// ========== GLOBAL VARIABLES ==========
let answers = new Array(questions.length).fill(null);
let currentQuestion = 0;
let currentPersonality = null;

// DOM Elements
const homePage = document.getElementById('homePage');
const quizArea = document.getElementById('quizArea');
const resultArea = document.getElementById('resultArea');
const questionContainer = document.getElementById('questionContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const errorMsg = document.getElementById('errorMsg');
const startBtn = document.getElementById('startQuizBtn');

// ========== START QUIZ ==========
startBtn.addEventListener('click', () => {
    homePage.style.display = 'none';
    quizArea.style.display = 'block';
    resultArea.style.display = 'none';
    renderQuestion();
    updateProgress();
});

// ========== UPDATE PROGRESS ==========
function updateProgress() {
    const answered = answers.filter(a => a !== null).length;
    const percent = (answered / questions.length) * 100;
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `Question ${answered + 1} of ${questions.length}`;
}

// ========== RENDER CURRENT QUESTION ==========
function renderQuestion() {
    const q = questions[currentQuestion];
    const letters = ['A', 'B', 'C', 'D'];
    
    const html = `
        <div class="question-card">
            <div class="question-number">QUESTION ${currentQuestion + 1} OF ${questions.length}</div>
            <div class="question-text">${q.text}</div>
            <div class="options-grid" id="optionsGrid">
                ${q.options.map((opt, idx) => `
                    <div class="option-card ${answers[currentQuestion] === idx ? 'selected' : ''}" data-opt-index="${idx}">
                        <div class="option-letter">${letters[idx]}</div>
                        <div class="option-text">${opt}</div>
                    </div>
                `).join('')}
            </div>
            <div class="nav-buttons">
                <button class="btn-prev" id="prevBtn" style="${currentQuestion === 0 ? 'visibility:hidden' : 'visibility:visible'}">← PREVIOUS</button>
                <button class="btn-next" id="nextBtn">${currentQuestion === questions.length - 1 ? 'REVEAL MY BOOK →' : 'NEXT →'}</button>
            </div>
        </div>
    `;
    
    questionContainer.innerHTML = html;
    
    // Add option click listeners
    document.querySelectorAll('.option-card').forEach(opt => {
        opt.addEventListener('click', () => {
            const idx = parseInt(opt.dataset.optIndex);
            answers[currentQuestion] = idx;
            renderQuestion();
            updateProgress();
            errorMsg.style.display = 'none';
        });
    });
    
    // Add navigation listeners
    document.getElementById('prevBtn')?.addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            renderQuestion();
            updateProgress();
        }
    });
    
    document.getElementById('nextBtn')?.addEventListener('click', () => {
        if (answers[currentQuestion] === null) {
            errorMsg.style.display = 'block';
            return;
        }
        
        if (currentQuestion === questions.length - 1) {
            calculateAndShowResult();
        } else {
            currentQuestion++;
            renderQuestion();
            updateProgress();
        }
    });
}

// ========== CALCULATE PERSONALITY ==========
function calculatePersonality() {
    let visionaryScore = 0;
    let dreamerScore = 0;
    let healerScore = 0;
    let rebelScore = 0;
    
    answers.forEach((ans, idx) => {
        if (ans === null) return;
        
        if (idx === 0) { // Recharge
            if (ans === 0) healerScore += 2;
            if (ans === 1) visionaryScore += 2;
            if (ans === 2) dreamerScore += 2;
            if (ans === 3) rebelScore += 2;
        }
        if (idx === 1) { // Weekend
            if (ans === 0) visionaryScore += 2;
            if (ans === 1) healerScore += 2;
            if (ans === 2) rebelScore += 2;
            if (ans === 3) dreamerScore += 2;
        }
        if (idx === 2) { // Conflict
            if (ans === 0) visionaryScore += 2;
            if (ans === 1) healerScore += 2;
            if (ans === 2) rebelScore += 2;
            if (ans === 3) dreamerScore += 2;
        }
        if (idx === 3) { // Drive
            if (ans === 0) visionaryScore += 3;
            if (ans === 1) healerScore += 3;
            if (ans === 2) healerScore += 2;
            if (ans === 3) rebelScore += 3;
        }
        if (idx === 4) { // Aesthetic
            if (ans === 0) rebelScore += 2;
            if (ans === 1) dreamerScore += 2;
            if (ans === 2) visionaryScore += 2;
            if (ans === 3) rebelScore += 2;
        }
        if (idx === 5) { // Signature
            if (ans === 0) visionaryScore += 3;
            if (ans === 1) rebelScore += 2;
            if (ans === 2) healerScore += 3;
            if (ans === 3) dreamerScore += 2;
        }
    });
    
    const scores = [
        { type: personalities[0], score: visionaryScore },
        { type: personalities[1], score: dreamerScore },
        { type: personalities[2], score: healerScore },
        { type: personalities[3], score: rebelScore }
    ];
    
    scores.sort((a, b) => b.score - a.score);
    return scores[0].type;
}

// ========== FETCH API - QUOTE ==========
async function fetchQuote() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        if (!response.ok) throw new Error();
        const data = await response.json();
        return { text: data.content, author: data.author };
    } catch (error) {
        return { text: "Be the energy you want to attract.", author: "Vibe Magazine" };
    }
}

// ========== FETCH API - ADVICE ==========
async function fetchAdvice() {
    try {
        const response = await fetch('https://api.adviceslip.com/advice');
        const data = await response.json();
        return data.slip.advice;
    } catch (error) {
        return "Trust your gut today. It knows more than your brain.";
    }
}

// ========== SHOW RESULT (MAGAZINE BOOK) ==========
async function calculateAndShowResult() {
    currentPersonality = calculatePersonality();
    const quote = await fetchQuote();
    const advice = await fetchAdvice();
    
    const strengthsHTML = currentPersonality.strengths.map(s => 
        `<div class="trait-item">✓ ${s}</div>`
    ).join('');
    
    const weaknessesHTML = currentPersonality.weaknesses.map(w => 
        `<div class="trait-item">⚡ ${w}</div>`
    ).join('');
    
    const resultHTML = `
        <div class="magazine-book">
            <div class="book-cover">
                <div class="cover-badge">EXCLUSIVE PERSONALITY REVEAL</div>
                <div class="cover-title">VIBE</div>
                <div class="cover-subtitle">THE PERSONALITY BOOK</div>
                <div class="personality-name">${currentPersonality.name}</div>
                <div class="personality-title">${currentPersonality.title}</div>
            </div>
            
            <div class="book-page">
                <div class="page-title">EDITOR'S NOTE</div>
                <div class="page-content">${currentPersonality.description}</div>
                <div class="highlight-box">"${currentPersonality.tagline}"</div>
            </div>
            
            <div class="book-page">
                <div class="page-title">STRENGTHS & WEAKNESSES</div>
                <div class="traits-grid">
                    <div class="strengths">
                        <h3>💪 STRENGTHS</h3>
                        ${strengthsHTML}
                    </div>
                    <div class="weaknesses">
                        <h3>🌙 WEAKNESSES</h3>
                        ${weaknessesHTML}
                    </div>
                </div>
            </div>
            
            <div class="book-page">
                <div class="page-title">COSMIC COMPATIBILITY</div>
                <div class="element-box">Your Element: ${currentPersonality.element}</div>
                <div class="power-color">Power Color: <span style="background:${currentPersonality.powerColor}; display:inline-block; width:20px; height:20px; border-radius:50%; vertical-align:middle;"></span> ${currentPersonality.powerColor}</div>
            </div>
            
            <div class="book-page">
                <div class="page-title">THE UNIVERSE SAID...</div>
                <div class="quote-box">"${quote.text}"</div>
                <div class="quote-author">— ${quote.author}</div>
            </div>
            
            <div class="book-page">
                <div class="page-title">YOUR VIBE FORECAST</div>
                <div class="prediction-box">🔮 ${advice}</div>
            </div>
            
            <div class="book-page">
                <div class="page-title">DEAR VIBE...</div>
                <div class="advice-box">${currentPersonality.advice}</div>
            </div>
            
            <div class="book-back">
                <p>✨ KEEP THIS MAGAZINE FOREVER ✨</p>
                <p>VIBE MAGAZINE • ISSUE #${Math.floor(Math.random() * 100)}</p>
            </div>
            
            <div class="action-buttons">
                <button class="save-btn" onclick="saveToLibrary()">📚 SAVE TO LIBRARY</button>
                <button class="restart-btn" onclick="restartQuiz()">🔄 TAKE AGAIN</button>
            </div>
        </div>
    `;
    
    resultArea.innerHTML = resultHTML;
    quizArea.style.display = 'none';
    resultArea.style.display = 'block';
    
    saveToLocalStorage();
    loadHomeGallery();
    startConfetti();
    setTimeout(stopConfetti, 3000);
}

// ========== LOCALSTORAGE ==========
function saveToLocalStorage() {
    const saved = JSON.parse(localStorage.getItem('vibeMagazines')) || [];
    const newMagazine = {
        id: Date.now(),
        name: currentPersonality.name,
        title: currentPersonality.title,
        date: new Date().toLocaleDateString()
    };
    saved.unshift(newMagazine);
    if (saved.length > 5) saved.pop();
    localStorage.setItem('vibeMagazines', JSON.stringify(saved));
}

function saveToLibrary() {
    alert(`📚 "${currentPersonality.name}" saved to your library!`);
    loadHomeGallery();
}

function loadHomeGallery() {
    const saved = JSON.parse(localStorage.getItem('vibeMagazines')) || [];
    const galleryGrid = document.getElementById('homeGalleryGrid');
    
    if (saved.length === 0) {
        galleryGrid.innerHTML = '<div class="empty-gallery">✨ No magazines yet. Take the quiz first! ✨</div>';
        return;
    }
    
    galleryGrid.innerHTML = saved.map(mag => `
        <div class="gallery-item" onclick="alert('${mag.name}\\n${mag.title}\\n📅 ${mag.date}')">
            📖 ${mag.name}
        </div>
    `).join('');
}

// ========== RESTART QUIZ ==========
function restartQuiz() {
    answers = new Array(questions.length).fill(null);
    currentQuestion = 0;
    quizArea.style.display = 'block';
    resultArea.style.display = 'none';
    homePage.style.display = 'none';
    renderQuestion();
    updateProgress();
    stopConfetti();
}

// ========== CONFETTI ==========
let confettiActive = false;
let confettiCanvas, confettiCtx, confettiParticles;

function startConfetti() {
    confettiCanvas = document.createElement('canvas');
    confettiCanvas.style.position = 'fixed';
    confettiCanvas.style.top = '0';
    confettiCanvas.style.left = '0';
    confettiCanvas.style.width = '100%';
    confettiCanvas.style.height = '100%';
    confettiCanvas.style.pointerEvents = 'none';
    confettiCanvas.style.zIndex = '9999';
    document.body.appendChild(confettiCanvas);
    
    confettiCtx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    
    confettiParticles = [];
    for (let i = 0; i < 100; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            size: Math.random() * 8 + 3,
            speedY: Math.random() * 5 + 3,
            speedX: Math.random() * 2 - 1,
            color: `hsl(${Math.random() * 360}, 100%, 60%)`
        });
    }
    
    confettiActive = true;
    
    function drawConfetti() {
        if (!confettiActive || !confettiCanvas) return;
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        for (let p of confettiParticles) {
            confettiCtx.fillStyle = p.color;
            confettiCtx.fillRect(p.x, p.y, p.size, p.size);
            p.y += p.speedY;
            p.x += p.speedX;
            
            if (p.y > confettiCanvas.height) {
                p.y = -p.size;
                p.x = Math.random() * confettiCanvas.width;
            }
        }
        requestAnimationFrame(drawConfetti);
    }
    
    drawConfetti();
}

function stopConfetti() {
    confettiActive = false;
    if (confettiCanvas) confettiCanvas.remove();
}

// ========== MAKE FUNCTIONS GLOBAL FOR BUTTONS ==========
window.saveToLibrary = saveToLibrary;
window.restartQuiz = restartQuiz;

// ========== LOAD GALLERY ON PAGE LOAD ==========
loadHomeGallery();