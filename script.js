//console.log(document.links);
//let a = document.getElementById("quiz-page").innerText;
//console.log(a);
let a= document.getElementById("landing-page").attributes.value;
console.log(a);
// Sample Questions Data
const questions = [
    {
        id: 1,
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2
    },
    {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1
    },
    {
        id: 3,
        question: "What is 15 + 27?",
        options: ["42", "41", "43", "40"],
        correctAnswer: 0
    },
    {
        id: 4,
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctAnswer: 2
    },
    {
        id: 5,
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correctAnswer: 3
    },
    {
        id: 6,
        question: "In which year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correctAnswer: 1
    },
    {
        id: 7,
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Au", "Ag", "Gd"],
        correctAnswer: 1
    },
    {
        id: 8,
        question: "Which is the smallest country in the world?",
        options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
        correctAnswer: 1
    },
    {
        id: 9,
        question: "What is the square root of 64?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 2
    },
    {
        id: 10,
        question: "Which gas makes up most of Earth's atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        correctAnswer: 2
    }
];

// Application State
let currentPhase = 'landing';
let currentQuestion = 0;
let answers = {};
let timeLeft = 15 * 60; // 15 minutes in seconds
let timer = null;
let startTime = null;
let testResults = null;

// Utility Functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function formatTimeSpent(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}

function getGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
}

function getGradeColor(percentage) {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    document.getElementById(pageId).classList.add('active');
    currentPhase = pageId.replace('-page', '');
}

// Page Navigation Functions
function showLandingPage() {
    showPage('landing-page');
}

function showRulesPage() {
    showPage('rules-page');
}

function showQuizPage() {
    showPage('quiz-page');
    initializeQuiz();
}

function showCompletedPage() {
    calculateResults();
    updateCompletedPage();
    showPage('completed-page');
}

function showScoreCardPage() {
    updateScoreCardPage();
    showPage('scorecard-page');
}

// Quiz Functions
function initializeQuiz() {
    currentQuestion = 0;
    answers = {};
    timeLeft = 15 * 60;
    startTime = Date.now();
    
    createQuestionGrid();
    displayQuestion();
    startTimer();
    updateProgress();
}

function createQuestionGrid() {
    const grid = document.getElementById('question-grid');
    grid.innerHTML = '';
    
    for (let i = 0; i < questions.length; i++) {
        const btn = document.createElement('button');
        btn.className = 'question-btn unanswered';
        btn.textContent = i + 1;
        btn.onclick = () => goToQuestion(i);
        grid.appendChild(btn);
    }
    updateQuestionGrid();
}

function updateQuestionGrid() {
    const buttons = document.querySelectorAll('.question-btn');
    buttons.forEach((btn, index) => {
        btn.className = 'question-btn ';
        if (index === currentQuestion) {
            btn.className += 'current';
        } else if (answers.hasOwnProperty(index)) {
            btn.className += 'answered';
        } else {
            btn.className += 'unanswered';
        }
    });
}

function displayQuestion() {
    const question = questions[currentQuestion];
    
    // Update question counter
    document.getElementById('question-counter').textContent = 
        `Question ${currentQuestion + 1} of ${questions.length}`;
    
    // Update question text
    document.getElementById('question-text').textContent = 
        `Q${currentQuestion + 1}. ${question.question}`;
    
    // Create options
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        if (answers[currentQuestion] === index) {
            optionDiv.classList.add('selected');
        }
        
        optionDiv.innerHTML = `
            <input type="radio" name="question-${currentQuestion}" value="${index}" 
                   ${answers[currentQuestion] === index ? 'checked' : ''}>
            <label>${option}</label>
        `;
        
        optionDiv.onclick = () => selectAnswer(index);
        container.appendChild(optionDiv);
    });
    
    // Update navigation buttons
    updateNavigationButtons();
    updateQuestionGrid();
}

function selectAnswer(optionIndex) {
    answers[currentQuestion] = optionIndex;
    
    // Update option styling
    document.querySelectorAll('.option').forEach((option, index) => {
        option.classList.toggle('selected', index === optionIndex);
        const radio = option.querySelector('input[type="radio"]');
        radio.checked = index === optionIndex;
    });
    
    updateQuestionGrid();
}

// function updateNavigationButtons() {
//     const prevBtn = document.getElementById('prev-btn');
//     const nextBtn = document.getElementById('next-btn');
//     const submitBtn = document.getElementById('submit-btn');
    
//     prevBtn.disabled = currentQuestion === 0;
    
//     if (currentQuestion === questions.length - 1) {
//         nextBtn.style.display = 'none';
//         submitBtn.style.display = 'inline-block';
//     } else {
//         nextBtn.style.display = 'inline-block';
//         submitBtn.style.display = 'none';
//     }
// }

function goToQuestion(questionIndex) {
    if (questionIndex >= 0 && questionIndex < questions.length) {
        currentQuestion = questionIndex;
        displayQuestion();
        updateProgress();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
       // updateProgress();
    }
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        displayQuestion();
        //updateProgress();
    }
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        
        const timerElement = document.getElementById('timer');
        const timerSection = document.querySelector('.timer-section');
        
        timerElement.textContent = formatTime(timeLeft);
        
        // Change timer color based on time left
        if (timeLeft < 300) { // Less than 5 minutes
            timerSection.className = 'timer-section danger';
        } else if (timeLeft < 600) { // Less than 10 minutes
            timerSection.className = 'timer-section warning';
        }
        
        if (timeLeft <= 0) {
            submitTest();
        }
    }, 1000);
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function submitTest() {
    stopTimer();
    showCompletedPage();
}

function calculateResults() {
    const totalQuestions = questions.length;
    let correctAnswers = 0;
    
    questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
            correctAnswers++;
        }
    });
    
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    testResults = {
        score: correctAnswers,
        totalQuestions: totalQuestions,
        percentage: percentage,
        grade: getGrade(percentage),
        timeSpent: timeSpent,
        answers: answers,
        questions: questions
    };
}

function updateCompletedPage() {
    document.getElementById('correct-count').textContent = testResults.score;
    document.getElementById('percentage-score').textContent = `${testResults.percentage}%`;
    document.getElementById('grade-display').textContent = testResults.grade;
    document.getElementById('time-taken-display').textContent = formatTimeSpent(testResults.timeSpent);
    
    // Update grade colors
    const percentage = testResults.percentage;
    const color = getGradeColor(percentage);
    document.getElementById('percentage-score').style.color = color;
    document.getElementById('grade-display').style.color = color;
    
    // Update performance message
    const performanceMessage = document.getElementById('performance-message');
    const performanceDescription = document.getElementById('performance-description');
    
    if (percentage >= 80) {
        performanceMessage.textContent = 'Excellent Performance!';
        performanceDescription.textContent = 'You demonstrated strong knowledge in this assessment.';
    } else if (percentage >= 60) {
        performanceMessage.textContent = 'Good Job!';
        performanceDescription.textContent = 'You have a solid understanding of the topics.';
    } else {
        performanceMessage.textContent = 'Keep Practicing!';
        performanceDescription.textContent = 'Consider reviewing the topics and trying again.';
    }
}

function updateScoreCardPage() {
    // Update summary stats
    document.getElementById('final-correct').textContent = testResults.score;
    document.getElementById('final-incorrect').textContent = testResults.totalQuestions - testResults.score;
    document.getElementById('final-percentage').textContent = `${testResults.percentage}%`;
    document.getElementById('final-time').textContent = formatTimeSpent(testResults.timeSpent);
    
    // Update performance overview
    document.getElementById('progress-percentage').textContent = `${testResults.percentage}%`;
    document.getElementById('progress-fill').style.width = `${testResults.percentage}%`;
    document.getElementById('summary-correct').textContent = `${testResults.score} Correct`;
    document.getElementById('summary-incorrect').textContent = `${testResults.totalQuestions - testResults.score} Incorrect`;
    
    // Update detailed analysis
    updateDetailedAnalysis();
}

function updateDetailedAnalysis() {
    const container = document.getElementById('detailed-analysis');
    container.innerHTML = '';
    
    questions.forEach((question, questionIndex) => {
        const userAnswer = answers[questionIndex];
        const isCorrect = userAnswer === question.correctAnswer;
        const wasAnswered = userAnswer !== undefined;
        
        const analysisItem = document.createElement('div');
        analysisItem.className = 'analysis-item';
        
        analysisItem.innerHTML = `
            <div class="analysis-header">
                <div class="question-badge ${isCorrect ? 'correct' : 'incorrect'}">
                    Q${questionIndex + 1}
                </div>
                <div class="analysis-question">
                    <h4>${question.question}</h4>
                    <div class="analysis-options">
                        ${question.options.map((option, optionIndex) => {
                            let optionClass = 'neutral';
                            let icon = '';
                            let badge = '';
                            
                            if (optionIndex === question.correctAnswer) {
                                optionClass = 'correct-answer';
                                icon = '✅';
                                badge = '<span class="option-badge badge-correct">Correct</span>';
                            } else if (optionIndex === userAnswer && userAnswer !== question.correctAnswer) {
                                optionClass = 'user-wrong';
                                icon = '❌';
                                badge = '<span class="option-badge badge-wrong">Your Answer</span>';
                            }
                            
                            return `
                                <div class="analysis-option ${optionClass}">
                                    <span class="option-icon">${icon}</span>
                                    <span class="option-text">${option}</span>
                                    ${badge}
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="analysis-status">
                        <span class="status-text ${isCorrect ? 'correct' : 'incorrect'}">
                            ${isCorrect ? '✓ Correct' : wasAnswered ? '✗ Incorrect' : '⚠ Not Answered'}
                        </span>
                        ${!wasAnswered ? '<span>No answer selected</span>' : ''}
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(analysisItem);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Landing page
    document.getElementById('start-test-btn').onclick = showRulesPage;
    
    // Rules page
    document.getElementById('back-to-home-btn').onclick = showLandingPage;
    document.getElementById('start-quiz-btn').onclick = showQuizPage;
    
    // Quiz page
    document.getElementById('prev-btn').onclick = previousQuestion;
    document.getElementById('next-btn').onclick = nextQuestion;
    document.getElementById('submit-btn').onclick = submitTest;
    
    // Completed page
    document.getElementById('view-score-btn').onclick = showScoreCardPage;
    document.getElementById('back-home-btn').onclick = showLandingPage;
    
    // Score card page
    document.getElementById('home-btn').onclick = showLandingPage;
    document.getElementById('return-home-btn').onclick = showLandingPage;
    
    // Initialize application
    showLandingPage();
});

// Prevent page refresh during quiz
window.addEventListener('beforeunload', function(e) {
    if (currentPhase === 'quiz') {
        e.preventDefault();
        e.returnValue = '';
        return 'Are you sure you want to leave? Your progress will be lost.';
    }
});
