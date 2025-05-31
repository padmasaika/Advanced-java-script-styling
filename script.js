document.addEventListener("DOMContentLoaded", () => {
  const sections = {
    quiz: document.getElementById("quiz-section"),
    jokes: document.getElementById("api-section"),
    carousel: document.getElementById("carousel-section"),
  };

  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.target.getAttribute("href").replace("#", "");
      Object.entries(sections).forEach(([key, section]) => {
        section.style.display = key === target ? "block" : "none";
      });
      document.querySelectorAll("nav a").forEach((a) => a.classList.remove("active"));
      e.target.classList.add("active");
    });
  });

  // Quiz contains 3 questions with multiple choice answers
  // Each question has a correct answer and an explanation
  const questions = [
    {
      question: "What is the tallest mountain in the World?",
      options: ["Mount Kilimanjaro", "Mount Everest", "Mount McKinely", "K2"],
      answer: "The tallest mountain in the world is <b>Mount Everest</b>. It has a height of 8,849 meters (29,032 feet)." 
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Mars", "Earth", "Jupiter", "Saturn"],
      answer: "The planet known as the Red Planet is <b>Mars</b>. Its surface is covered in iron oxide (rust), giving it a reddish appearance." 
    },
    {
      question: "What is the longest river in the World?",
      options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
      answer: "The longest river in the world is the <b>Nile River</b>. Its length is approximately 6,650 kilometers (4,132 miles)."
    }
  ];

  let currentQuestion = 0, score = 0, userAnswers = [], timerInterval, timeLeft = 60;
  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");

  function startQuiz() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("quiz-screen").style.display = "block";
    timeLeft = 15;
    score = 0;
    userAnswers = [];
    currentQuestion = 0;
    startTimer();
    showQuestion();
  }

  function startTimer() {
    document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
    timerInterval = setInterval(() => {
      timeLeft--;
      document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        finishQuiz();
      }
    }, 1000);
  }

  function showQuestion() {
    const q = questions[currentQuestion];
    document.getElementById("question").textContent = q.question;
    const optionsList = document.getElementById("options");
    optionsList.innerHTML = "";
    q.options.forEach(opt => {
      const li = document.createElement("li");
      li.innerHTML = `<label><input type='radio' name='option' value='${opt}'> ${opt}</label>`;
      optionsList.appendChild(li);
    });
    nextBtn.textContent = (currentQuestion === questions.length - 1) ? "Submit" : "Next";
  }

  function nextQuestion() {
    const selected = document.querySelector("input[name='option']:checked");
    if (!selected) {
      alert("Please select an option!");
      return;
    }
    const selectedAnswer = selected.value;
    userAnswers.push({
      question: questions[currentQuestion].question,
      selected: selectedAnswer,
      correct: questions[currentQuestion].answer
    });
    if (selectedAnswer === questions[currentQuestion].answer) score++;
    currentQuestion++;
    if (currentQuestion < questions.length) showQuestion();
    else finishQuiz();
  }

  function finishQuiz() {
    clearInterval(timerInterval);
    let resultHTML = `<h2>Quiz Completed!</h2><p>Your Score: ${score}/${questions.length}</p><h3>Time up!</h3>`;
    userAnswers.forEach((ans, index) => {
      const className = ans.selected === ans.correct ? "correct" : "incorrect";
      resultHTML += `<div class='${className}'><strong>Q${index + 1}:</strong> ${ans.question}<br><strong>Your Answer:</strong> ${ans.selected}<br><strong>Correct Answer:</strong> ${ans.correct}</div>`;
    });
    document.getElementById("quiz-section").innerHTML = resultHTML;
  }

  startBtn.addEventListener("click", startQuiz);
  nextBtn.addEventListener("click", nextQuestion);

  //Jokes using API 
  function loadJoke() {
    const jokeDiv = document.getElementById("joke");
    fetch("https://icanhazdadjoke.com/search?", {
      headers: { 
        Accept: "application/json",
        "User-Agent": "NatureQuizApp (https://yourapp.example)"
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.results.length > 0) {
          const randomJoke = data.results[Math.floor(Math.random() * data.results.length)];
          jokeDiv.textContent = randomJoke.joke;
        } else {
          jokeDiv.textContent = "No nature jokes found.";
        }
      })
      .catch(() => {
        jokeDiv.textContent = "Oops! Couldn't fetch a joke.";
      });
  }

  document.getElementById("joke-btn").addEventListener("click", loadJoke);
  loadJoke();

  // changed images automatically evey second
  const images = [
    "images/image1.jpg",
    "images/image2.jpg",
    "images/image3.jpg",
    "images/image4.jpg"
  ];
  let currentSlide = 0;
  const carouselImg = document.getElementById("carousel-img");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtnCarousel = document.getElementById("next-btn-carousel");
  const dotsContainer = document.getElementById("dots-container");

  function updateCarousel() {
    carouselImg.src = images[currentSlide];
    updateDots();
  }

  function updateDots() {
    dotsContainer.innerHTML = "";
    images.forEach((_, index) => {
      const dot = document.createElement("span");
      dot.style.height = "12px";
      dot.style.width = "12px";
      dot.style.margin = "0 6px";
      dot.style.display = "inline-block";
      dot.style.borderRadius = "50%";
      dot.style.backgroundColor = index === currentSlide ? "#3f51b5" : "#bbb";
      dot.style.cursor = "pointer";
      dot.title = `Go to slide ${index + 1}`;
      dot.addEventListener("click", () => {
        currentSlide = index;
        updateCarousel();
        resetAutoSlideTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  nextBtnCarousel.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % images.length;
    updateCarousel();
    resetAutoSlideTimer();
  });

  prevBtn.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + images.length) % images.length;
    updateCarousel();
    resetAutoSlideTimer();
  });

  let autoSlideTimer = setInterval(() => {
    currentSlide = (currentSlide + 1) % images.length;
    updateCarousel();
  }, 1000);

  function resetAutoSlideTimer() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(() => {
      currentSlide = (currentSlide + 1) % images.length;
      updateCarousel();
    }, 1000);
  }

  updateCarousel();
});
