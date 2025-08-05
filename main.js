document.addEventListener('DOMContentLoaded', () => {
    const allQuestions = [
        {
            question: "The doctor orders an IV medication to be infused at 4 mcg/kg/min. The patient weighs 75 kg. You are supplied with a bag of the IV medication that reads 250 mg/250 mL. How many mL/hr will you administer?",
            options: ["9 mL/hr", "18 mL/hr", "36 mL/hr", "72 mL/hr"],
            answer: "18 mL/hr",
            explanation: "1. Calculate total dosage in mcg/min: $$\\small{4 \\text{ mcg/kg/min} \\times 75 \\text{ kg} = 300 \\text{ mcg/min}}$$ 2. Convert mcg/min to mg/hr: $$\\small{300 \\text{ mcg/min} \\times \\frac{60 \\text{ min}}{1 \\text{ hr}} \\times \\frac{1 \\text{ mg}}{1000 \\text{ mcg}} = 18 \\text{ mg/hr}}$$ 3. Determine concentration: $$\\small{\\frac{250 \\text{ mg}}{250 \\text{ mL}} = 1 \\text{ mg/mL}}$$ 4. Calculate the rate in mL/hr: $$\\small{\\frac{18 \\text{ mg/hr}}{1 \\text{ mg/mL}} = 18 \\text{ mL/hr}}$$ "
        },
        {
            question: "Dr orders Fentanyl 75 mcg IV pre-procedural. The vial is labeled 0.5 mg/mL. How many mL will you give per dose?",
            options: ["0.075 mL/dose", "0.15 mL/dose", "0.75 mL/dose", "1.5 mL/dose"],
            answer: "0.15 mL/dose",
            explanation: "1. Convert the available concentration to mcg/mL: $$\\small{0.5 \\text{ mg/mL} \\times \\frac{1000 \\text{ mcg}}{1 \\text{ mg}} = 500 \\text{ mcg/mL}}$$ 2. Use the formula: Desired / Have x Volume: $$\\small{\\frac{75 \\text{ mcg (Desired)}}{500 \\text{ mcg (Have)}} \\times 1 \\text{ mL} = 0.15 \\text{ mL}}$$ "
        },
        // ... other questions are here ...
        {
            question: "Dr orders Ceftriaxone 1 g IV daily. The vial is labeled 2 g/10 mL. How many mL will you give per dose?",
            options: ["2 mL/dose", "2.5 mL/dose", "5 mL/dose", "10 mL/dose"],
            answer: "5 mL/dose",
            explanation: "Use the formula: Desired / Have x Volume. Ensure units are consistent (g). $$\\small{\\frac{1 \\text{ g (Desired)}}{2 \\text{ g (Have)}} \\times 10 \\text{ mL} = 0.5 \\times 10 \\text{ mL} = 5 \\text{ mL}}$$ "
        }
    ];

    let currentQuestionIndex = 0;
    let userAnswers = [];
    let shuffledQuestions = [];
    
    // --- DOM Element References ---
    const quizContainer = document.getElementById('quiz-container');
    const quizContent = document.getElementById('quiz-content');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const showExplanationBtn = document.getElementById('show-explanation-btn');
    const explanationBox = document.getElementById('explanation-box');
    const explanationText = document.getElementById('explanation-text');
    const resultsScreen = document.getElementById('results-screen');
    const startButton = document.querySelector('.cta-button');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const themeToggleButton = document.getElementById('theme-toggle-btn');

    // --- Utility Functions ---
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // --- Theme Management ---
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.setAttribute('data-theme', currentTheme);
    }
    
    themeToggleButton.addEventListener('click', () => {
        const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });


    // --- Quiz Logic ---
    function startQuiz() {
        shuffledQuestions = shuffleArray([...allQuestions]);
        currentQuestionIndex = 0;
        userAnswers = new Array(shuffledQuestions.length).fill(null);
        
        resultsScreen.style.display = 'none';
        resultsScreen.innerHTML = ''; 
        quizContainer.style.display = 'block';
        quizContent.style.display = 'block';
        document.querySelector('.quiz-actions').style.display = 'flex';
        
        loadQuestion();
    }

    function loadQuestion(isReview = false) {
        quizContent.classList.remove('fade-in');
        quizContent.classList.add('fade-out');

        setTimeout(() => {
            if (currentQuestionIndex < shuffledQuestions.length) {
                const q = shuffledQuestions[currentQuestionIndex];
                
                questionText.innerHTML = q.question;
                optionsContainer.innerHTML = '';
                optionsContainer.classList.remove('disabled');

                const options = isReview ? q.options : shuffleArray([...q.options]);
                options.forEach(option => {
                    const button = document.createElement('button');
                    button.classList.add('option-button');
                    button.textContent = option;
                    button.onclick = () => selectOption(option, button);
                    optionsContainer.appendChild(button);
                });

                resetExplanation();
                
                if (userAnswers[currentQuestionIndex] !== null) {
                    revealAnswer();
                }
                
                updateNavigation();
                updateProgressBar();
            }
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
        const selected = userAnswers[currentQuestionIndex];
        const correct = shuffledQuestions[currentQuestionIndex].answer;
        
        optionsContainer.classList.add('disabled');
        showExplanationBtn.style.display = 'inline-block';

        Array.from(optionsContainer.children).forEach(btn => {
            if (btn.textContent === correct) {
                btn.classList.add('correct');
            } else if (btn.textContent === selected) {
                btn.classList.add('incorrect');
            }
        });
    }

    function toggleExplanation() {
        const q = shuffledQuestions[currentQuestionIndex];
        explanationText.innerHTML = q.explanation;
        explanationBox.classList.toggle('show');
        
        if (explanationBox.classList.contains('show')) {
            showExplanationBtn.textContent = 'Hide Calculation';
            // Re-render MathJax for the new content
            if (window.MathJax) {
                MathJax.typesetPromise([explanationText]);
            }
        } else {
            showExplanationBtn.textContent = 'Show Calculation';
        }
    }
    
    function resetExplanation() {
        explanationBox.classList.remove('show');
        showExplanationBtn.textContent = 'Show Calculation';
        showExplanationBtn.style.display = 'none';
    }

    function updateNavigation() {
        prevButton.disabled = currentQuestionIndex === 0;
        nextButton.textContent = currentQuestionIndex === shuffledQuestions.length - 1 ? 'Finish' : 'Next';
    }
    
    function updateProgressBar() {
        const answeredCount = userAnswers.filter(a => a !== null).length;
        const progressPercentage = (answeredCount / shuffledQuestions.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}`;
    }

    function showResults() {
        progressBar.style.width = '100%';
        let score = 0;
        userAnswers.forEach((answer, index) => {
            if (answer === shuffledQuestions[index].answer) {
                score++;
            }
        });

        quizContent.style.display = 'none';
        document.querySelector('.quiz-actions').style.display = 'none';

        resultsScreen.style.display = 'block';
        const percentage = Math.round((score / shuffledQuestions.length) * 100);
        const message = percentage >= 80 ? "Excellent Work! You're a calculation expert." : percentage >= 60 ? "Good job! A little more practice will make perfect." : "Keep practicing! Review your answers to improve.";
        
        resultsScreen.innerHTML = `
            <div id="result-summary">You Scored <span class="score">${score}</span>/${shuffledQuestions.length} (${percentage}%)</div>
            <p id="result-message">${message}</p>
            <button id="restart-button" class="cta-button">Restart Quiz</button>
            <button id="review-button" class="cta-button" style="background-color: var(--text-muted);">Review Answers</button>
            <div id="review-area"></div>
        `;
        
        document.getElementById('restart-button').addEventListener('click', startQuiz);
        document.getElementById('review-button').addEventListener('click', buildReview);
    }
    
    function buildReview() {
        const reviewArea = document.getElementById('review-area');
        reviewArea.innerHTML = '<h3 class="section-title" style="font-size: 1.5rem; margin-bottom: 2rem;">Review Your Answers</h3>';
        shuffledQuestions.forEach((q, index) => {
            const isCorrect = userAnswers[index] === q.answer;
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-question';
            reviewItem.onclick = () => reviewQuestion(index);
            reviewItem.innerHTML = `
                <div class="review-question-text">
                   ${index + 1}. ${q.question.substring(0, 60)}...
                </div>
                <div class="review-status ${isCorrect ? 'correct' : 'incorrect'}">
                   <span class="material-icons-sharp">${isCorrect ? 'check_circle' : 'cancel'}</span>
                   <span>${isCorrect ? 'Correct' : 'Incorrect'}</span>
                </div>
            `;
            reviewArea.appendChild(reviewItem);
        });
        document.getElementById('review-button').style.display = 'none';
    }

    function reviewQuestion(index) {
        currentQuestionIndex = index;
        quizContent.style.display = 'block';
        document.querySelector('.quiz-actions').style.display = 'flex';
        resultsScreen.style.display = 'none';
        loadQuestion(true); // pass true for review mode (don't shuffle options)
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
            alert('Please select an answer before proceeding.');
            return;
        }

        if (currentQuestionIndex < shuffledQuestions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            showResults();
        }
    });

    showExplanationBtn.addEventListener('click', toggleExplanation);

    startButton.addEventListener('click', (e) => {
         e.preventDefault();
         const targetSection = document.querySelector(startButton.getAttribute('href'));
         targetSection.scrollIntoView({ behavior: 'smooth' });
         setTimeout(startQuiz, 500); // Wait for scroll to finish
    });
});
