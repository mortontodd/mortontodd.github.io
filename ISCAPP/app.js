let currentQuestionIndex = 0;
let score = 0;
let questions = [];

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const progress = document.getElementById('progress');
const questionNum = document.getElementById('question-number');

// 1. Load questions from JSON file
async function loadQuiz() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        showQuestion();
    } catch (error) {
        questionText.innerText = "Error loading questions. Make sure you are using a local server.";
    }
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    questionText.innerText = currentQuestion.question;
    
    // Update Progress
    questionNum.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    progress.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.addEventListener('click', () => selectAnswer(index, button));
        optionsContainer.appendChild(button);
    });
}

function resetState() {
    nextBtn.classList.add('hidden');
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
    }
}

function selectAnswer(selectedIndex, button) {
    const correctIndex = questions[currentQuestionIndex].answer;
    const allButtons = optionsContainer.querySelectorAll('button');
    
    allButtons.forEach(btn => btn.disabled = true); // Stop multiple clicks

    if (selectedIndex === correctIndex) {
        button.classList.add('correct');
        score++;
    } else {
        button.classList.add('wrong');
        allButtons[correctIndex].classList.add('correct'); // Show correct answer
    }
    
    nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    document.getElementById('quiz').classList.add('hidden');
    const resultContainer = document.getElementById('result-container');
    resultContainer.classList.remove('hidden');
    document.getElementById('score-text').innerText = `You scored ${score} out of ${questions.length}`;
}

loadQuiz();