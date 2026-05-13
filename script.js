// ============================================
// PERSONALITY TEST - MAIN JAVASCRIPT
// Handles: DOM, Events, localStorage, Fetch API
// ============================================

// ---------- QUIZ DATA (7 Questions) ----------
const QUESTIONS = [
    { text: "On a free weekend, you'd rather...", options: ["Read a novel & sip tea", "Go on an adventure/hike", "Host a dinner with friends", "Try a new creative project"] },
    { text: "Which energy best describes you?", options: ["Calm & reflective", "Bold & spontaneous", "Warm & social", "Curious & inventive"] },
    { text: "How do you handle a tough decision?", options: ["Trust intuition & values", "Analyze risks vs reward", "Seek advice from loved ones", "Experiment & adapt quickly"] },
    { text: "Your ideal creative outlet?", options: ["Writing or journaling", "Extreme sports / action", "Collaborative art / music", "Coding / design / building"] },
    { text: "What drives you most?", options: ["Inner peace & wisdom", "Freedom & excitement", "Connection & community", "Mastery & innovation"] },
    { text: "Pick your favorite food:", options: ["Pizza", "Burgers", "Pasta", "Sushi"] },
    { text: "Pick your favorite animal:", options: ["🐱 Cat (independent & curious)", "🐶 Dog (loyal & social)", "🦁 Lion (bold & confident)", "🐬 Dolphin (smart & playful)"] }
];

// ---------- PERSONALITY MAPPING (based on dominant answer index: 0,1,2,3) ----------
const PERSONALITY_MAP = {
    0: {
        name: "The Sage Curator",
        tagline: "Wisdom. Depth. Quiet influence.",
        description: "You're the friend who always has the best advice. You notice things others don't and love diving deep into topics that interest you. Books, coffee shops, and quiet evenings are your happy places.",
        strengths: "Introspective, Wise, Patient, Great listener",
        weaknesses: "Overthinking, Detached in crowds, Reluctant to act fast",
        likes: "Reading books, solving puzzles, deep conversations, rainy days",
        dislikes: "Small talk, loud parties, rushing, disorganization",
        funFact: "You probably have a notes app full of quotes you like. That's totally a you thing.",
        colorPalette: "#2f3e46, #cad2c5",
        icon: "bi bi-gem",
        bestCareers: "Librarian, Researcher, Teacher, Writer"
    },
    1: {
        name: "The Maverick Spark",
        tagline: "Adventure. Impulse. Raw Energy.",
        description: "You're the one who says 'yes' to everything. Road trip at 2am? You're in. New hobby every week? That's you. Life is too short to be boring, and you make sure everyone around you remembers that.",
        strengths: "Courageous, Energetic, Decisive, Optimistic",
        weaknesses: "Impulsive, Can burn out, Risk of recklessness",
        likes: "Adventure sports, trying new things, spontaneity, loud music",
        dislikes: "Rules, routines, waiting, being told 'no'",
        funFact: "You've probably started a new hobby and bought all the stuff for it in one day. No judgment here.",
        colorPalette: "#e76f51, #f4a261",
        icon: "bi bi-lightning-charge-fill",
        bestCareers: "Entrepreneur, Pilot, Coach, Event Planner"
    },
    2: {
        name: "The Harmony Weaver",
        tagline: "Empathy. Radiance. Human Connection.",
        description: "You're the group mom/dad. You remember everyone's birthday, check in on friends who are feeling down, and somehow make every gathering feel warm and welcoming. People feel safe with you.",
        strengths: "Empathetic, Diplomatic, Generous, Encouraging",
        weaknesses: "Over-accommodating, Difficulty saying no, Avoids confrontation",
        likes: "Hosting dinners, gift-giving, hugs, heartfelt conversations",
        dislikes: "Arguments, seeing others upset, being alone for too long",
        funFact: "Your phone contacts are probably full of nicknames for your favorite people. That's adorable.",
        colorPalette: "#e9c46a, #f4e285",
        icon: "bi bi-people-fill",
        bestCareers: "Counselor, Teacher, Social Worker, Event Planner"
    },
    3: {
        name: "The Visionary Architect",
        tagline: "Ingenuity. Pattern. Future-built.",
        description: "You're always thinking about how to make things better. Whether it's organizing your desk or planning a whole project, your brain never stops finding patterns and solutions. 'Good enough' is never good enough for you.",
        strengths: "Innovative, Strategic, Curious, Perfectionist drive",
        weaknesses: "Impatient with routine, Overly critical, Emotionally reserved",
        likes: "Building things, planning, learning new skills, fixing broken stuff",
        dislikes: "Inefficiency, vague instructions, wasted time, clutter",
        funFact: "You probably have a system for organizing your systems. And honestly? That's impressive.",
        colorPalette: "#2a9d8f, #264653",
        icon: "bi bi-brush-fill",
        bestCareers: "Engineer, Architect, Designer, Software Developer"
    }
};

// ---------- HELPER: Determine Personality from Answers ----------
function getPersonalityFromAnswers(answersArray) {
    if (!answersArray.length || answersArray.every(a => a === null)) {
        return PERSONALITY_MAP[0];
    }
    const freq = [0, 0, 0, 0];
    answersArray.forEach(ans => {
        if (ans >= 0 && ans <= 3) freq[ans]++;
    });
    let maxIdx = 0;
    for (let i = 1; i < 4; i++) {
        if (freq[i] > freq[maxIdx]) maxIdx = i;
    }
    return PERSONALITY_MAP[maxIdx];
}

// ---------- STATE MANAGEMENT ----------
let currentStep = 0;
let userAnswers = new Array(QUESTIONS.length).fill(null);
let quizCompleted = false;

const appRoot = document.getElementById('appRoot');

// ---------- LOCALSTORAGE FUNCTIONS ----------
function saveProgress() {
    if (!quizCompleted) {
        const progress = {
            currentStep: currentStep,
            userAnswers: userAnswers,
            completed: false,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('personality_quiz', JSON.stringify(progress));
        console.log("Progress saved to localStorage");
    } else {
        localStorage.removeItem('personality_quiz');
    }
}

function loadProgress() {
    const saved = localStorage.getItem('personality_quiz');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (!data.completed && data.userAnswers && data.currentStep !== undefined) {
                currentStep = data.currentStep;
                userAnswers = data.userAnswers;
                quizCompleted = false;
                console.log("Progress loaded from localStorage");
                return true;
            }
        } catch (e) {
            console.warn("Error loading progress:", e);
        }
    }
    return false;
}

function clearStorageAndReset() {
    localStorage.removeItem('personality_quiz');
    console.log("localStorage cleared");
}

// ---------- FETCH API: Get a Fun Fact ----------
async function fetchFunFact(personalityName) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            return `✨ Random fun thing: "${data.title.substring(0, 60)}..." — This kind of vibe suits the ${personalityName} personality!`;
        } else {
            return `✨ Fun fact: People with the ${personalityName} personality type usually enjoy quiet time to recharge. Sounds like you!`;
        }
    } catch (error) {
        return `✨ Here's a fun fact: ${personalityName}s make up about 15-20% of people. You're in a cool club!`;
    }
}

// ---------- RESET FUNCTION ----------
function resetAndRestartQuiz() {
    clearStorageAndReset();
    currentStep = 0;
    userAnswers = new Array(QUESTIONS.length).fill(null);
    quizCompleted = false;
    renderQuestion();
}

// ---------- RENDER MAGAZINE RESULT (Simple Student Style) ----------
async function renderResult() {
    const personality = getPersonalityFromAnswers(userAnswers.filter(a => a !== null));
    
    // Fetch fun fact using Fetch API
    const fetchFunFactText = await fetchFunFact(personality.name);
    
    // Parse strengths and weaknesses into arrays
    const strengthsArray = personality.strengths.split(',').map(s => s.trim());
    const weaknessesArray = personality.weaknesses.split(',').map(w => w.trim());
    const likesArray = personality.likes.split(',').map(l => l.trim());
    const dislikesArray = personality.dislikes.split(',');
    
    const resultHTML = `
        <div class="animate-fade-in">
            <!-- Magazine Cover -->
            <div class="row g-4 mb-5">
                <div class="col-12">
                    <div class="result-cover p-4 p-md-5 text-center" style="background: linear-gradient(135deg, #1e2a2e 0%, #2c3e2f 100%); border-radius: 20px;">
                        <span class="magazine-badge bg-warning bg-opacity-25 text-light border-0 px-3 py-1 rounded-pill">✦ your personality result ✦</span>
                        <h2 class="display-4 fw-bold mt-3" style="font-family:'Playfair Display';">${personality.name}</h2>
                        <p class="lead fs-3 fst-italic">“${personality.tagline}”</p>
                    </div>
                </div>
            </div>
            
            <!-- About You Section -->
            <div class="row g-4 mb-4">
                <div class="col-12">
                    <div class="card p-4" style="background: white; border-radius: 20px;">
                        <h3 class="h4 fw-bold" style="font-family:'Playfair Display';">📖 About You</h3>
                        <p class="mt-2" style="font-size: 1.1rem; line-height: 1.6;">${personality.description}</p>
                    </div>
                </div>
            </div>
            
            <!-- Strengths & Weaknesses Row -->
            <div class="row g-4 mb-4">
                <div class="col-md-6">
                    <div class="card p-4 h-100" style="background: #f0fdf4; border-radius: 20px; border-left: 5px solid #22c55e;">
                        <h4 class="h5 fw-bold"><i class="bi bi-trophy-fill text-success me-2"></i> Your Strengths</h4>
                        <div class="d-flex flex-wrap gap-2 mt-2">
                            ${strengthsArray.map(s => `<span class="badge bg-success bg-opacity-10 text-success p-2">✓ ${s}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card p-4 h-100" style="background: #fef2f2; border-radius: 20px; border-left: 5px solid #ef4444;">
                        <h4 class="h5 fw-bold"><i class="bi bi-droplet-half text-danger me-2"></i> Things to Work On</h4>
                        <div class="d-flex flex-wrap gap-2 mt-2">
                            ${weaknessesArray.map(w => `<span class="badge bg-danger bg-opacity-10 text-danger p-2">⟡ ${w}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Likes & Dislikes Row -->
            <div class="row g-4 mb-4">
                <div class="col-md-6">
                    <div class="card p-4 h-100" style="background: #eff6ff; border-radius: 20px; border-left: 5px solid #3b82f6;">
                        <h4 class="h5 fw-bold"><i class="bi bi-heart-fill text-primary me-2"></i> You Love</h4>
                        <div class="d-flex flex-wrap gap-2 mt-2">
                            ${likesArray.map(l => `<span class="badge bg-primary bg-opacity-10 text-primary p-2">❤️ ${l}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card p-4 h-100" style="background: #fff7ed; border-radius: 20px; border-left: 5px solid #f97316;">
                        <h4 class="h5 fw-bold"><i class="bi bi-emoji-frown text-warning me-2"></i> You Don't Love</h4>
                        <div class="d-flex flex-wrap gap-2 mt-2">
                            ${dislikesArray.map(d => `<span class="badge bg-warning bg-opacity-10 text-warning p-2">💔 ${d}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Fun Fact + Career Row -->
            <div class="row g-4 mb-4">
                <div class="col-md-7">
                    <div class="card p-4 h-100" style="background: #faf5ff; border-radius: 20px; border-left: 5px solid #a855f7;">
                        <h4 class="h5 fw-bold"><i class="bi bi-star-fill text-purple me-2"></i> Fun Fact About You</h4>
                        <p class="mt-2 mb-0">${fetchFunFactText}</p>
                        <p class="mt-2 mb-0 fst-italic">${personality.funFact}</p>
                    </div>
                </div>
                <div class="col-md-5">
                    <div class="card p-4 h-100" style="background: #fefce8; border-radius: 20px; border-left: 5px solid #eab308;">
                        <h4 class="h5 fw-bold"><i class="bi bi-briefcase-fill me-2"></i> You'd Make a Great</h4>
                        <p class="mt-2 mb-0">${personality.bestCareers}</p>
                    </div>
                </div>
            </div>
            
            <!-- Restart Button -->
            <div class="text-center mt-4">
                <button class="btn btn-dark rounded-pill px-5 py-2" id="restartQuizBtnMagazine">
                    <i class="bi bi-arrow-repeat me-2"></i> Take the Quiz Again
                </button>
            </div>
            
            <!-- Footer -->
            <div class="mt-4 text-center small text-muted border-top pt-3">
                <i class="bi bi-database"></i> Your result is saved in your browser
            </div>
        </div>
    `;
    
    appRoot.innerHTML = resultHTML;
    
    const restartBtn = document.getElementById('restartQuizBtnMagazine');
    if (restartBtn) {
        restartBtn.addEventListener('click', resetAndRestartQuiz);
    }
    
    quizCompleted = true;
    clearStorageAndReset();
}

// ---------- RENDER QUESTION (Step by Step) ----------
function renderQuestion() {
    // Check if all questions are answered
    if (currentStep >= QUESTIONS.length) {
        if (userAnswers.every(a => a !== null)) {
            renderResult();
        } else {
            resetAndRestartQuiz();
        }
        return;
    }
    
    const currentQ = QUESTIONS[currentStep];
    const selectedValue = userAnswers[currentStep];
    
    // Build options HTML with Bootstrap form-check styling
    let optionsHtml = '';
    currentQ.options.forEach((opt, idx) => {
        const isChecked = (selectedValue === idx);
        optionsHtml += `
            <div class="form-check border rounded-3 p-3 mb-2" style="background: white; cursor: pointer;" data-opt-index="${idx}">
                <input class="form-check-input" type="radio" name="questionRadio" id="opt_${idx}" value="${idx}" ${isChecked ? 'checked' : ''}>
                <label class="form-check-label w-100 fw-medium" for="opt_${idx}">
                    ${opt}
                </label>
            </div>
        `;
    });
    
    const progressPercent = ((currentStep) / QUESTIONS.length) * 100;
    
    const quizHTML = `
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card card-magazine question-card p-4 p-md-5" style="background: white; border-radius: 20px;">
                    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                        <span class="badge bg-dark px-3 py-2 rounded-pill">question ${currentStep + 1}/${QUESTIONS.length}</span>
                        <span class="text-muted small"><i class="bi bi-dot"></i> personality test</span>
                    </div>
                    <h3 class="h2 mb-4" style="font-family:'Playfair Display';">${currentQ.text}</h3>
                    <form id="questionForm">
                        ${optionsHtml}
                        <div class="d-flex justify-content-between align-items-center mt-4">
                            <button type="button" class="btn btn-outline-secondary rounded-pill px-4" id="prevBtn" ${currentStep === 0 ? 'disabled' : ''}>
                                <i class="bi bi-arrow-left"></i> back
                            </button>
                            <button type="submit" class="btn btn-dark rounded-pill px-5">
                                ${currentStep === QUESTIONS.length - 1 ? 'reveal my result →' : 'next →'}
                            </button>
                        </div>
                    </form>
                    <div class="progress mt-4" style="height: 6px;">
                        <div class="progress-bar bg-dark" role="progressbar" style="width: ${progressPercent}%;" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div class="mt-3 text-muted small text-center">
                        <i class="bi bi-save"></i> your answers are auto-saved
                    </div>
                </div>
            </div>
        </div>
    `;
    
    appRoot.innerHTML = quizHTML;
    
    // Attach event listeners
    const form = document.getElementById('questionForm');
    const prevBtn = document.getElementById('prevBtn');
    const radioInputs = document.querySelectorAll('input[name="questionRadio"]');
    
    // Handle radio button changes
    radioInputs.forEach(radio => {
        radio.addEventListener('change', (e) => {
            userAnswers[currentStep] = parseInt(e.target.value);
            saveProgress();
        });
    });
    
    // Pre-select if there's a stored answer
    if (selectedValue !== null) {
        const checkedRadio = document.querySelector(`input[name="questionRadio"][value="${selectedValue}"]`);
        if (checkedRadio) checkedRadio.checked = true;
    }
    
    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Find selected option
        let selected = null;
        for (let i = 0; i < radioInputs.length; i++) {
            if (radioInputs[i].checked) {
                selected = parseInt(radioInputs[i].value);
                break;
            }
        }
        
        if (selected === null) {
            // Show alert
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-warning alert-dismissible fade show mt-3';
            alertDiv.role = 'alert';
            alertDiv.innerHTML = '🌟 Please select an option before continuing';
            form.appendChild(alertDiv);
            setTimeout(() => alertDiv.remove(), 2000);
            return;
        }
        
        // Save answer
        userAnswers[currentStep] = selected;
        saveProgress();
        
        // Move to next or finish
        if (currentStep + 1 < QUESTIONS.length) {
            currentStep++;
            renderQuestion();
        } else {
            // Final step - all questions answered
            if (userAnswers.every(a => a !== null)) {
                renderResult();
            } else {
                renderResult();
            }
        }
    });
    
    // Previous button handler
    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            renderQuestion();
        }
    });
}

// ---------- INITIALIZATION ----------
function init() {
    const hasProgress = loadProgress();
    if (hasProgress && userAnswers.some(a => a !== null)) {
        // Check if all answers are filled -> show result
        if (userAnswers.every(a => a !== null)) {
            renderResult();
        } else {
            renderQuestion();
        }
    } else {
        // Fresh start
        clearStorageAndReset();
        currentStep = 0;
        userAnswers = new Array(QUESTIONS.length).fill(null);
        quizCompleted = false;
        renderQuestion();
    }
}

// Start the application
init();