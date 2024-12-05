// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAnxlANRd4KGSU_-Ysit9prSjvOtuKiAZA",

  authDomain: "quiz-movie-app.firebaseapp.com",

  databaseURL: "https://quiz-movie-app-default-rtdb.firebaseio.com",

  projectId: "quiz-movie-app",

  storageBucket: "quiz-movie-app.firebasestorage.app",

  messagingSenderId: "518391341521",

  appId: "1:518391341521:web:291106e19d79295faa40f0",

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Elements
const loginForm = document.getElementById("login-form");
const quizContainer = document.querySelector(".quiz-container");
const resultContainer = document.getElementById("result");
const answersContainer = document.getElementById("answers-container");

// Handle Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Login successful!");
      startQuiz();
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Load Questions
const questions = [
  { question: "What year was Inception released?", answers: ["2008", "2010", "2012", "2014"], correct: 1 },
  { question: "What year was Inception released?", answers: ["2008", "2010", "2012", "2014"], correct: 1 },
  { question: "What year was Inception released?", answers: ["2008", "2010", "2012", "2014"], correct: 1 },
  // Add more questions here
];

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
  loadQuestion();
  quizContainer.classList.remove("hidden");
}

function loadQuestion() {
  const question = questions[currentQuestionIndex];
  answersContainer.innerHTML = ""; // Clear previous answers

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.classList.add("answer");
    button.textContent = answer;
    button.addEventListener("click", () => handleAnswer(index));
    answersContainer.appendChild(button);
  });
}

function handleAnswer(selectedIndex) {
  const question = questions[currentQuestionIndex];
  const isCorrect = selectedIndex === question.correct;

  if (isCorrect) score++;

  currentQuestionIndex++;
  if (currentQuestionIndex >= questions.length) {
    saveResults(score);
    alert(`Quiz Complete! Your score: ${score}/${questions.length}`);
    return;
  }
  loadQuestion();
}

function saveResults(score) {
  const user = auth.currentUser;
  if (user) {
    const userRef = ref(database, `users/${user.uid}/results`);
    set(userRef, { score });
  }
}
