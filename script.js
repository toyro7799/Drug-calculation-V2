// script.js (Professional Version)

document.addEventListener('DOMContentLoaded', () => {
    // --- Constants for API and DOM Elements ---
    const API_URL = 'http://localhost:3000/api/questions';
    const quizContainer = document.getElementById('quiz-container');
    const quizArea = document.getElementById('quiz-area');
    const loader = document.getElementById('loader');
    const quizContent = document.getElementById('quiz-content');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const explanationBox = document.getElementById('explanation-box');
    const explanationText = document.getElementById('explanation-text');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const quizResult = document.getElementById('quiz-result');
    const reviewArea = document.getElementById('review-area');
    const startButton = document.querySelector('.cta-button');
    const progressBar = document.getElementById('progress-bar');
    
    // --- State Management ---
    let allQuestions = [];
    let currentQuestionIndex = 0;
    let userAnswers = [];

    // --- Core Functions ---
    async function fetchQuestions() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const questions = await response.json();
            return questions;
        } catch (error) {
            console.error("Could not fetch questions:", error);
            quizArea.innerHTML = `<p style="color: var(--danger-color);">Failed to load quiz. Please make sure the server is running and try again.</p>`;
            return null;
        }
    }

    async function startQuiz() {
        // Reset state
        currentQuestionIndex = 0;
        quizResult.style.display = 'none';
        reviewArea.style.display = 'none';
        reviewArea.innerHTML = '';
        quizArea.style.display = 'none';
        loader.style.display = 'block';
        quizContainer.style.display = 'block';

        allQuestions = await fetchQuestions();
        if (!allQuestions) return; // Stop if fetch failed

        userAnswers = new Array(allQuestions.length).fill(null);
        
        loader.style.display = 'none';
        quizArea.style.display = 'block';

        loadQuestion();
    }

    function loadQuestion() {
        quizContent.classList.remove('fade-in');
        quizContent.classList.add('fade-out');

        setTimeout(() => {
            const q = allQuestions[currentQuestionIndex];
            questionText.innerHTML = `Question ${currentQuestionIndex + 1}/${allQuestions.length}:<br>${q.question}`;
            optionsContainer.innerHTML = '';
            optionsContainer.classList.remove('disabled');
            explanationBox.style.display = 'none'; // Hide explanation

            // Use original options order or shuffle them
            const options = [...q.options]; //.sort(() => Math.random() - 0.5);
            options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                button.textContent = option;
                button.onclick = () => selectOption(option, button);
                optionsContainer.appendChild(button);
            });

            if (userAnswers[currentQuestionIndex] !== null) {
                revealAnswer();
            }
            
            updateNavigationButtons();
            updateProgressBar();

            quizContent.classList.remove('fade-out');
            quizContent.classList.add('fade-in');
        }, 200);
    }

    function selectOption(selectedOption, clickedButton) {
        if (userAnswers[currentQuestionIndex] !== null) return;

        userAnswers[currentQuestionIndex] = selectedOption;
        revealAnswer();
    }
    
    function revealAnswer() {
        const userChosenAnswer = userAnswers[currentQuestionIndex];
        if (userChosenAnswer === null) return;

        const currentQuestion = allQuestions[currentQuestionIndex];
        const correctAnswer = currentQuestion.answer;
        
        optionsContainer.classList.add('disabled');
        Array.from(optionsContainer.children).forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct');
            } else if (btn.textContent === userChosenAnswer) {
                btn.classList.add('incorrect');
            }
        });
        
        // Show explanation
        explanationText.innerHTML = currentQuestion.explanation;
        explanationBox.style.display = 'block';
        if (window.MathJax) {
            MathJax.typeset(); // Re-render LaTeX formulas
        }
    }

    function showResults() {
        progressBar.style.width = '100%';
        let score = userAnswers.reduce((acc, answer, index) => {
            return acc + (answer === allQuestions[index].answer ? 1 : 0);
        }, 0);

        quizArea.style.display = 'none';
        quizResult.style.display = 'block';
        reviewArea.style.display = 'none';

        quizResult.innerHTML = `
            <div id="result-text">Congratulations! You scored <span class="score">${score}</span>/${allQuestions.length}</div>
            <button id="review-button" class="cta-button" style="margin-right: 1rem;">Review Answers</button>
            <button id="restart-button" class="cta-button">Restart Quiz</button>
        `;

        document.getElementById('restart-button').addEventListener('click', startQuiz);
        document.getElementById('review-button').addEventListener('click', showReview);
    }
    
    function showReview() {
        quizResult.style.display = 'none';
        reviewArea.style.display = 'block';
        reviewArea.innerHTML = '<h2 class="section-title">Review Your Answers</h2>';

        allQuestions.forEach((q, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === q.answer;
            const reviewCard = document.createElement('div');
            reviewCard.className = `review-question ${isCorrect ? 'correct-answer' : 'incorrect-answer'}`;

            let answerHtml;
            if (isCorrect) {
                answerHtml = `<p>Your answer: <span class="user-answer correct">${userAnswer}</span> (Correct)</p>`;
            } else {
                answerHtml = `
                    <p>Your answer: <span class="user-answer incorrect">${userAnswer || 'Not answered'}</span></p>
                    <p>Correct answer: <span class="correct-answer-text">${q.answer}</span></p>
                `;
            }

            reviewCard.innerHTML = `
                <h5>Question ${index + 1}: ${q.question}</h5>
                ${answerHtml}
                <div class="review-explanation">
                    <strong>Explanation:</strong> ${q.explanation}
                </div>
            `;
            reviewArea.appendChild(reviewCard);
        });
        
        // Add a button to go back to start
        const backButton = document.createElement('button');
        backButton.className = 'cta-button';
        backButton.textContent = 'Take Quiz Again';
        backButton.onclick = startQuiz;
        reviewArea.appendChild(backButton);
        if (window.MathJax) {
            MathJax.typeset();
        }
    }

    function updateNavigationButtons() {
        prevButton.disabled = currentQuestionIndex === 0;
        nextButton.textContent = currentQuestionIndex === allQuestions.length - 1 ? 'Finish' : 'Next';
    }

    function updateProgressBar() {
        const progressPercentage = ((currentQuestionIndex) / allQuestions.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    // --- Event Listeners ---
    prevButton.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion();
        }
    });

    nextButton.addEventListener('click', () => {
        if (userAnswers[currentQuestionIndex] === null) {
            // Optional: Shake animation or small alert
            quizContent.classList.add('shake');
            setTimeout(() => quizContent.classList.remove('shake'), 500);
            return;
        }

        if (currentQuestionIndex < allQuestions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            showResults();
        }
    });

    startButton.addEventListener('click', (e) => {
        e.preventDefault();
        const targetElement = document.querySelector(startButton.getAttribute('href'));
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        setTimeout(startQuiz, 300);
    });
});
