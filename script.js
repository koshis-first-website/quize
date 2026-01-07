const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const scoreDisplay = document.getElementById('score-display');

let score = 0;
let currentQuestionIndex = 0;
let questions = [];

// 1. HARDCODED MEDITATION QUESTIONS (App works even without internet)
const localMeditationQuestions = [
    {
        question: "Which of these is a benefit of regular meditation?",
        answers: [
            { text: "Reduced Stress", correct: true },
            { text: "Faster Running", correct: false },
            { text: "Better Eyesight", correct: false },
            { text: "Higher Height", correct: false }
        ]
    },
    {
        question: "What is 'Pranayama' in yoga?",
        answers: [
            { text: "A type of food", correct: false },
            { text: "Breath Control", correct: true },
            { text: "A sleeping position", correct: false },
            { text: "Fast dancing", correct: false }
        ]
    },
    {
        question: "What is the best posture for sitting meditation?",
        answers: [
            { text: "Standing on one leg", correct: false },
            { text: "Lying face down", correct: false },
            { text: "Back straight, sitting comfortably", correct: true },
            { text: "Hunched over", correct: false }
        ]
    }
];

// 2. FETCH FROM WEB WITH ERROR HANDLING
async function getQuestions() {
    questionElement.innerText = "Connecting to Zen Network...";
    
    try {
        // We add a 2-second delay to prevent spamming the API
        const response = await fetch('https://opentdb.com/api.php?amount=10&category=17&type=multiple');
        
        if (!response.ok) throw new Error("Server Busy");

        const data = await response.json();
        
        if (data.response_code !== 0) {
            throw new Error("API Limit Reached");
        }

        const apiQuestions = data.results.map(q => ({
            question: decodeHTML(q.question),
            answers: shuffle([
                { text: decodeHTML(q.correct_answer), correct: true },
                ...q.incorrect_answers.map(a => ({ text: decodeHTML(a), correct: false }))
            ])
        }));

        questions = [...localMeditationQuestions, ...apiQuestions];
        startQuiz();

    } catch (e) {
        console.log("Web Error:", e.message);
        // FALLBACK: Use local questions if web fails
        questions = localMeditationQuestions;
        questionElement.innerText = "Offline Mode: Loading Meditation Basics...";
        setTimeout(startQuiz, 1500); 
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQ = questions[currentQuestionIndex];
    questionElement.innerText = currentQ.question;

    currentQ.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) button.dataset.correct = "true";
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
    } else {
        selectedBtn.classList.add("wrong");
    }
    
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") button.classList.add("correct");
        button.disabled = true;
    });
    nextButton.classList.remove('hide');
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        questionElement.innerText = `Journey Complete! Score: ${score}/${questions.length}`;
        nextButton.innerText = "Restart";
        nextButton.onclick = () => location.reload();
    }
});

function shuffle(array) { return array.sort(() => Math.random() - 0.5); }

function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

getQuestions();
