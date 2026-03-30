const quizData = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Markup Language",
      "Hyper Tabular Markup Language",
      "None of these",
    ],
    correctOptionIndex: 0,
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    correctOptionIndex: 3,
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Colorful Style Sheets",
      "Creative Style Sheets",
      "Computer Style Sheets",
    ],
    correctOptionIndex: 0,
  },
  {
    question:
      "What is the correct syntax for referring to an external script called 'xxx.js'?",
    options: [
      "<script href='xxx.js'>",
      "<script name='xxx.js'>",
      "<script src='xxx.js'>",
      "<script file='xxx.js'>",
    ],
    correctOptionIndex: 2,
  },
  {
    question: "Which HTML attribute is used to define inline styles?",
    options: ["class", "style", "font", "styles"],
    correctOptionIndex: 1,
  },
  {
    question: "Which is the correct CSS syntax?",
    options: [
      "body:color=black;",
      "{body;color:black;}",
      "body {color: black;}",
      "{body:color=black;}",
    ],
    correctOptionIndex: 2,
  },
];

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timer;
let correctAns = 0;
let incorrectAns = 0;
const timeQ = [30, 30, 30, 30, 30, 30];
const attemptedQuestions = new Set();

const questionElement = document.querySelector("#question");
const mark = document.querySelectorAll(".options");
const optionsElement = document.querySelector("#options");
const scoreElement = document.querySelector("#score");
const timerElement = document.querySelector("#timer");
const navigationElement = document.querySelector("#navigation");
const alertElement = document.querySelector("#alert");
const quizContainer = document.querySelector("#quiz-container");
const resultContainer = document.querySelector("#result-container");
const finalScoreElement = document.querySelector("#final-score");
const totalQuestionsElement = document.querySelector("#total-questions");
const correctAnswersElement = document.querySelector("#correct-answers");
const incorrectAnswersElement = document.querySelector("#incorrect-answers");
const restartButton = document.querySelector("#restart-button");

function initializeQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  correctAns = 0;
  incorrectAns = 0;
  attemptedQuestions.clear();

  scoreElement.textContent = score;
  quizContainer.style.display = "block";
  resultContainer.style.display = "none";
  navigationElement.style.display = "flex";

  createNavigation();
  displayQuestion();
  startTimer();
}

function createNavigation() {
  navigationElement.innerHTML = "";
  quizData.forEach((_, index) => {
    const button = document.createElement("button");
    button.className = "nav-button";
    button.textContent = index + 1;
    button.addEventListener("click", () => navigateToQuestion(index));
    navigationElement.appendChild(button);
  });
  updateNavigation();
}

function updateNavigation() {
  const buttons = navigationElement.getElementsByClassName("nav-button");
  Array.from(buttons).forEach((button, index) => {
    button.classList.toggle("active", index === currentQuestionIndex);
    button.classList.toggle("attempted", attemptedQuestions.has(index));
  });
}

function displayQuestion() {
  const currentQuestion = quizData[currentQuestionIndex];
  questionElement.textContent = `Question ${currentQuestionIndex + 1}: ${
    currentQuestion.question
  }`;

  optionsElement.innerHTML = "";
  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.id = `${index}`;
    button.textContent = option;
    const isAttempted = attemptedQuestions.has(currentQuestionIndex);

    if (isAttempted) {
      button.classList.add("disabled");
      button.disabled = true;
      if (index === currentQuestion.correctOptionIndex) {
        button.classList.add("correct");
      }
    }
    button.addEventListener("click", () => handleOptionSelect(index));
    optionsElement.appendChild(button);
  });
}

function handleOptionSelect(selectedIndex) {
  if (attemptedQuestions.has(currentQuestionIndex)) return;

  const currentQuestion = quizData[currentQuestionIndex];
  const isCorrect = selectedIndex === currentQuestion.correctOptionIndex;

  // Stop the timer immediately upon selection
  clearInterval(timer);

  // Update Score
  score += isCorrect ? 4 : -1;
  isCorrect ? correctAns++ : incorrectAns++;
  scoreElement.textContent = score;
  attemptedQuestions.add(currentQuestionIndex);

  // Apply Colors to all buttons
  const options = optionsElement.getElementsByClassName("option");
  Array.from(options).forEach((button, index) => {
    button.disabled = true;
    button.classList.add("disabled");

    if (index === selectedIndex) {
      button.classList.add(isCorrect ? "correct" : "incorrect");
    } else if (index === currentQuestion.correctOptionIndex) {
      // Optional: Show the right answer if they got it wrong
      button.classList.add("correct");
    }
  });

  showAlert(isCorrect ? "Correct!" : "Wrong!", isCorrect ? "success" : "error");

  setTimeout(() => {
    if (attemptedQuestions.size === quizData.length) {
      showResults();
    } else if (currentQuestionIndex < quizData.length - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    }
  }, 1500);

  updateNavigation();
}

function startTimer() {
  clearInterval(timer);
  timeLeft = timeQ[currentQuestionIndex];
  timerElement.textContent = timeLeft;
  if (timeLeft <= 0 || attemptedQuestions.has(currentQuestionIndex)) {
    return;
  }

  timer = setInterval(() => {
    timeLeft--;

    timeQ[currentQuestionIndex] = timeLeft;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      handleTimeUp();
    }
  }, 1000);
}

function handleTimeUp() {
  clearInterval(timer);
  if (!attemptedQuestions.has(currentQuestionIndex)) {
    attemptedQuestions.add(currentQuestionIndex);
    incorrectAns++;
    showAlert("Time's up!", "error");

    if (attemptedQuestions.size === quizData.length) {
      setTimeout(showResults, 1500);
    } else {
      setTimeout(() => {
        if (currentQuestionIndex < quizData.length - 1) {
          navigateToQuestion(currentQuestionIndex + 1);
        }
      }, 1500);
    }
    updateNavigation();
  }
}

function navigateToQuestion(index) {
  currentQuestionIndex = index;
  displayQuestion();
  startTimer();
  updateNavigation();
}

function showAlert(message, type) {
  alertElement.textContent = message;
  alertElement.className = `alert ${type}`;
  alertElement.style.display = "block";

  setTimeout(() => {
    alertElement.style.display = "none";
  }, 1500);
}

function showResults() {
  clearInterval(timer);
  quizContainer.style.display = "none";
  navigationElement.style.display = "none";
  resultContainer.style.display = "block";

  finalScoreElement.textContent = score;
  totalQuestionsElement.textContent = quizData.length;
  correctAnswersElement.textContent = correctAns;
  incorrectAnswersElement.textContent = incorrectAns;
}

restartButton.addEventListener("click", initializeQuiz);

document.addEventListener("DOMContentLoaded", initializeQuiz);
