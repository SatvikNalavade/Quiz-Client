const form = document.querySelector('#generate-form');
      const responseDiv = document.querySelector('#response');
const loader = document.getElementById("loader"); 
       loader.style.display = "none";

      form.addEventListener('submit', async (event) => {
        event.preventDefault();

            // Show the loading animation
loader.style.display = "block";
            
        const prompt = document.querySelector('#prompt').value;
        console.log(prompt)
        try {
          const response = await fetch("https://quiz-app-seven-roan.vercel.app/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ topic: prompt }),
          });
          
          const data = await response.json();
          if (response.status !== 200) {
            throw data.error || new Error(`Request failed with status ${response.status}`);
          }
          console.log(data.result);
          const apiResponse = data.result;
          createQuiz(apiResponse);
        } catch(error) {
          // Consider implementing your own error handling logic here
          console.error(error);
          alert(error.message);
        }
            
   loader.style.display = "none";
            
      });


function createQuiz(apiResponse) {
  const quizContainer = document.getElementById('quiz-container');
  const quizQuestions = apiResponse.split('\n\n');
  
  quizQuestions.forEach((question, index) => {
    const questionNumber = index + 1;
    const questionOptions = question.match(/[A-D]\) [^\n]*(?=\n|$)/g);
    const questionAnswer = question.match(/Answer: ([A-D])\)/)[1];
    const formattedQuestion = `
      <div class="quiz-question">
        <h3>${questionNumber}. ${question.split('\n')[0]}</h3>
        <div class="quiz-options">
          ${questionOptions.map(option => `
            <label>
              <input type="radio" name="question-${questionNumber}" value="${option.match(/([A-D])/)[1]}">
              ${option.replace(/[A-D]\) /, '')}
            </label>
          `).join('')}
        </div>
      </div>
    `;
    quizContainer.insertAdjacentHTML('beforeend', formattedQuestion);
  });
  
  const submitButton = `
    <button onclick="submitQuiz()">Submit</button>
  `;
  quizContainer.insertAdjacentHTML('beforeend', submitButton);
  
  function submitQuiz() {
    let score = 0;
    const questions = document.querySelectorAll('.quiz-question');
    questions.forEach(question => {
      const selectedOption = question.querySelector('input[name^="question-"]:checked');
      if (selectedOption && selectedOption.value === question.querySelector(`input[value="${questionAnswer}"]`).value) {
        score++;
      }
    });
    alert(`Your score is ${score} out of ${questions.length}`);
  }
}
