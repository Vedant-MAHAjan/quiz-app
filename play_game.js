const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));

const questionNumText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull")

const game = document.getElementById("game");
const loader = document.getElementById("loader");


let currentQuestion = {};
let acceptAns = false;    //used to create a delay for loading all the elements 
let score = 0;
let questionNum = 0;
let availableQue = [];

let questions = [];       //array containing questions of the quiz

fetch("https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple").then(res => {
    return res.json();
})
.then(loadedQuestions => {
    //results part in the API contains all the questions annd their choices
    //console.log(loadedQuestions.results)  

    //loadedQuestions array contains the question, correct option as well as the incorrect question

    //all the questions present in the array but with different format are present in loadedQuestions array

//formatQuestion object will have the actual question,the options and the correct answer with the required format

    questions = loadedQuestions.results.map(loadedQue => {
        const formatQuestion = {
            //loadedQue contains all the other details like incorrect answers, correct answer, etc
            //all the question in the required format are present inside loadedQue.question
            question : loadedQue.question   
        };
        //loadedQue.question is mapped to the corresponding index of formatQuestion
        //this generates the question that we want
                
        //uncomment this to check all the question stored in that array
        //console.log(loadedQue.question);

        //add all the incorrect answers in the array
        const answerChoices = [...loadedQue.incorrect_answers];

        //now add the correct answer in a random position from 1 to 4

        //this will generate a random number between 1-4
        formatQuestion.answer = Math.floor(Math.random() * 3) + 1;   

        //add the correct choice in the answerChoices array

        //in the place of formatQuestion.answer add loadedQue.correct_answer
        //the 0 indicates that nothing has to replaced, just correct_answer has to be added at an index
        answerChoices.splice(formatQuestion.answer - 1, 0, loadedQue.correct_answer);
        
        //uncomment this to find all the choices of all the questions
        //console.log(answerChoices);

        //since all the choices are present into the answerChoices
        //now, the choice is stored into the formatQuestion array as choice-index ie. choice-1, choice-2
        answerChoices.forEach((choice, index) => {
            formatQuestion["choice" + (index + 1)] = choice;
        });

        //console.log(formatQuestion);

        return formatQuestion;
    });

    startGame();
})
.catch(err => {
    console.log(err);
});


const correct_pts = 10;
const max_que = 10;


startGame = () => {
    questionNum = 0;
    score = 0;
    availableQue = [...questions]   //create a seperate copy of question to play around 
    console.log(availableQue);
    getNewQuestions();

    //add a loading animation to the screen if questions are being loaded from the API
    game.classList.remove("hidden");      //remove the hidden part of the game
    loader.classList.add("hidden");
};


getNewQuestions = () => {
    //if all the questions have been displayed...
    if(availableQue.length === 0 || questionNum >= max_que)
    {
        localStorage.setItem("mostRecentScore",score);   //localStorage only stores strings
        return window.location.href = "end_game.html";
    }

    questionNum++;

    questionNumText.innerText = `Question ${questionNum}/${max_que}`;

    //update the progress bar
    //since % of question divided by total will give 33,66,99 as results...
    //use them as the number for width
    progressBarFull.style.width = `${(questionNum / max_que) * 100}%`;       

    //generate a random question present in the availableQue array 
    const questionIndex = Math.floor(Math.random() * availableQue.length);
    currentQuestion = availableQue[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset["number"];          //data number of that choice is stored in number
        //inner text of each choice will fetch the value of 
        choice.innerText = currentQuestion["choice" + number];    
    });

    //remove the existing question from the array of questions since its used already
    availableQue.splice(questionIndex, 1);     

    acceptAns = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e=> {
        if(!acceptAns) return;

        acceptAns = false;
        const selectedChoice = e.target;
        const selectedAns = selectedChoice.dataset["number"];

        const classToApply = selectedAns == currentQuestion.answer ? "correct" : "incorrect";

        if(classToApply === "correct")
        {
            incrementScore(correct_pts);
        }

        //class is given to the HTML part of that choice to give color green or red to answer
        selectedChoice.parentElement.classList.add(classToApply); 

        //delay given to actually display the color change
        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestions();
        }, 1000)

        //class is removed after 1000ms since the next question will start immediately
        
    });
});


incrementScore = points => {
    score += points;
    scoreText.innerText = score;
};
