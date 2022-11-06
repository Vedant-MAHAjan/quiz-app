
const username = document.getElementById("username")
const saveScoreBtn = document.getElementById("saveScoreBtn");
const mostRecentScore = localStorage.getItem("mostRecentScore");
const finalScore = document.getElementById("finalScore")

const numOfHighS = 5;

//data received in web is always in string
//to make it a JavaScript object we use JSON.parse
const highScore = JSON.parse(localStorage.getItem("highScore")) || [];
console.log(highScore);

finalScore.innerText = mostRecentScore;

username.addEventListener("keyup", () =>
{
    saveScoreBtn.disabled = !username.value;       //if textbox is empty, make the save button disabled 
});

saveHighScore = (e) =>
{
    //console.log("Clicked save button");
    e.preventDefault();   //submit button in forms goes to new page by default, hence to keep it on same page

    const score = {               //score objetc created with 2 items score and name
        score : mostRecentScore,
        name : username.value
    };
    highScore.push(score);
    highScore.sort( (a,b) => b.score - a.score)      
    highScore.splice(numOfHighS);      //store only best 5 scores from all the players

    //everything that goes into LocalStorage should be of String type, hence the element is stringfied
    localStorage.setItem("highScore", JSON.stringify(highScore));
    return window.location.href = "quiz.html";
};




