const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const scoreElement = document.getElementById('score-count');
const countElement = document.getElementById('question-count');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let totalAnswered = 0;

// Connect to the Web API and get 50 questions
async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=50&type=multiple');
        const data = await response.json();
        
        const newQuestions = data.results.map(q => {
            return {
                question: decodeHTML(q.question),
                answers: shuffle([
                    { text: decodeHTML(q.correct_answer), correct: true },
                    ...q.incorrect_answers.map(a => ({ text: decodeHTML(a), correct: false }))
                ])
            };
        });

        questions = [...questions, ...newQuestions];
        
        // If it's the first time loading, start the quiz
        if (totalAnswered === 0) showQuestion();
        
    } catch (error) {
        questionElement.innerText = "Error loading from web. Check connection.";
    }
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    
    questionElement.innerText = currentQuestion.question;
    countElement.innerText = `Question: ${totalAnswered + 1}`;

    currentQuestion.answers.forEach(answer => {
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
        scoreElement.innerText = `Score: ${score}`;
    } else {
        selectedBtn.classList.add("wrong");
    }

    // Reveal correct answer and disable buttons
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") button.classList.add("correct");
        button.disabled = true;
    });

    nextButton.classList.remove('hide');
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    totalAnswered++;

    // "Refill" the tank: if only 5 questions left, fetch 50 more in background
    if (questions.length - currentQuestionIndex === 5) {
        fetchQuestions();
    }

    showQuestion();
});

// Helper: Shuffle answers
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Helper: Fix weird web characters (like &quot;)
function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

// Kick off the first fetch
fetchQuestions();
