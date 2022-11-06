const highScoreList = document.getElementById("highScoreList");
const highScore = JSON.parse(localStorage.getItem("highScore")) || [];

//this creates a list of all the scores along with the name and correspondins scores
// highScore.map(list => {
//     console.log(`<li class="listOfScore">${list.name}-${list.score}`) 
// });


//map function connects the players name to their corresponding scores
//map does not change the original array it just makes some changes to each element of that array 

//the highScoreList will be have the list of all the players and the scores which are joined one after the other
//without spaces  
highScoreList.innerHTML = highScore.map(score => {
    return `<li class="listOfScores">${score.name} -> ${score.score}`;
}).join("");