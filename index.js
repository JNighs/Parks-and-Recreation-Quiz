//Globals
let score, question;
//Function that runs on page load
$(onPageLoad);
function onPageLoad() {
  //Event listeners
  startQuiz();
  submitAnswer();
  nextQuestionButton();
  restartQuiz();
  //Show start page
  changePage('startPage');
}
      
//Page handler
function changePage(page, selectedAnswer) {
  showPage(page);
  if (page === 'startPage') {
    showStats(false);
    resetStats();
  } else if (page === 'questionPage') {
    showStats(true);
    renderQuestion();
  } else if (page === 'answerPage') {
    showStats(true);
    renderAnswerPage(selectedAnswer);
  } else if (page === 'scorePage') {
    showStats(false);
    renderScorePage();
  }
}

//Render
function renderQuestion() {
  const currentQuestion = questionsDB[question];
  //Clear previous question
  $('.choices').empty();
  //Fill in question
  $('legend').text(currentQuestion.question)
  //Add in answer choices
  currentQuestion.answers.forEach(function (answer, index) {
    $('.choices').append(`
            <input type="radio" value="${answer}" ID="${index}" name="answer" required>
            <label for="${index}">${answer}</label>
        `);
  })
}

function renderAnswerPage(selectedAnswer) {
  const currentQuestion = questionsDB[question];
  //Change picture
  $('.answerPage img').attr('src', currentQuestion.picture).attr('alt', currentQuestion.alt);
  //Check answer and adjust text, increase score accordingly
  if (checkAnswer(selectedAnswer)) {
    increaseScore();
    $('.answerCheck').text('correct');
    $('.nextQuestion').text('Nice');
    //Don't show correct answer
    $('.answerPage h2').addClass('hidden');
  } else {
    $('.answerCheck').text('incorrect');
    $('.nextQuestion').text('Ugh');
    //Show correct answer
    $('.answerPage h2').removeClass('hidden');
    $('.correctAnswer').text(currentQuestion.correctAnswer);
  }
}

function renderStats() {
  $('.currentScore').text(`${score}/${questionsDB.length}`);
  $('.currentQuestion').text(`${question + 1}/${questionsDB.length}`);
}

function renderScorePage() {
  //-1 for database array
  const scoreLevel = Math.floor(score / 2) - 1;
  const scorePageDB = scorePageLevels[scoreLevel];

  $('.finalScore').text(`${score}/${questionsDB.length}`);
  $('.scoreText').text(scorePageDB.text);
  $('.scorePicture').attr('src', scorePageDB.picture).attr('alt', scorePageDB.alt);
}

//Utility
function resetStats() {
  score = 0;
  question = 0;
  renderStats();
}

function increaseScore() {
  ++score;
  renderStats();
}

function increaseQuestion() {
  ++question;
  renderStats();
}

function showStats(show) {
  if (show)
    $('.stats').removeClass('hidden');
  else $('.stats').addClass('hidden');
}

function showPage(inputPage) {
  const pages = ['startPage', 'questionPage', 'answerPage', 'scorePage'];
  //Compare input page to available pages, show input page, hide the rest
  pages.forEach(page => {
    if (inputPage === page) {
      $('.' + page).removeClass('hidden');
    } else $('.' + page).addClass('hidden');
  })
}

function checkAnswer(selectedAnswer) {
  const rightAnswer = questionsDB[question].correctAnswer;
  if (selectedAnswer === rightAnswer) {
    return true;
  } else return false;
}

//Event listeners
function startQuiz() {
  $('.startPage').on('click', '.startButton', function (event) {
    changePage('questionPage');
  })
}

function restartQuiz() {
  $('.scorePage').on('click', '.restartQuiz', function (event) {
    changePage('startPage');
  })
}

function nextQuestionButton() {
  $('.answerPage').on('click', '.nextQuestion', function (event) {
    increaseQuestion();
    //If it's the last question, go to score page, else go to next question
    if (question === questionsDB.length) {
      changePage('scorePage');
    } else {
      changePage('questionPage');
    }
  })
}

function submitAnswer() {
  $('form').on('submit', function (event) {
    event.preventDefault();
    const selectedAnswer = $('input:checked').val();
    changePage('answerPage', selectedAnswer);
  })
}
