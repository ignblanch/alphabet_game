// Create ranking in local storage if it does not exist
if(!(JSON.parse(localStorage.getItem("ranking")))){
	var ranking = [];
	localStorage.setItem("ranking", JSON.stringify(ranking));
}
else{
	var ranking = JSON.parse(localStorage.getItem("ranking"));
}

//var images = ['atat.jpg', 'emp.jpg', 'xwing.jpg'];

// User constructor
var User = function(name){
	this.name = name,
	this.points = 0,
	this.errors = 0
}

// to create temporary user for ranking
var temp = {};

// keeps track of the number of answered questions
var answered = 0;

// to track which question goes next
var tracker = 0;

// to randomize questions and answers
const rand =  Math.floor((Math.random() * data[0].questions.length));

// // iterates background images
// setBackground(images[rand]);
// function setBackground(img) {
// 	get('top').style.backgroundImage = `url(images/${img})`;
// }

var input;

// Get the modal and hide it by default
var modal = get('endModal');
modal.style.display = "none";

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

//Shortcut
function get(id) {
	return document.getElementById(id);
}

doLogin();
//Asks for username, creates new user and stores it in the raking array. Welcomes user
function doLogin() {
	userName = prompt('Please Enter your user name:');
	temp = new User(userName);
	ranking.push(temp);
	get('js_user').innerHTML = userName;
}

// Sets timer for the game
var startTime = new Date();
var endTime; 
var elapsed = 0;
var interv;

////BUTTON EVENT LISTENERS /////////////
get('answerButton').addEventListener("click", function() {
	input = get('js_answer').value;
	get('js_answer').value = '';
	if(input){
		return checkAnswer(input, data[tracker]);
	}
});

get('pasaButton').addEventListener("click", function() {
	paintLetter('js'+(tracker), "#0066cc");
	tracker++;
	return gameOn();
});

get('endButton').addEventListener("click", function() {
	clearInterval(interv);
	buildRanking();
});
//////////////////////////////////////////

function paintLetter(id, color) {
	var letter = get(id);
	letter.style.backgroundColor = color;
}
	
gameOn();
// Controls the flow of the game
function gameOn() {
	if (answered === data.length){
		clearInterval(interv);
		return buildRanking();
	}	
	if(tracker === data.length){tracker = 0}
	if(data[tracker].answered) {
		//skips question if answered
		tracker++;
		gameOn();
	}
	displayScores();
	displayQuestion(data[tracker]);			
}

timer();
// Controls the time. Ends game when time is over
function timer() {
	interv = setInterval (function(){
		endTime = new Date();
		elapsed = endTime.getTime() - startTime.getTime();
		if (elapsed >130000) {
			alert('TIME IS OVER!!');
			clearInterval(interv);
			return buildRanking();
		}
		get('js_time').innerHTML = 130 - (Math.floor(elapsed/1000));
	}, 1000);
}

// Controls the display of scores
function displayScores() {
	get('js_score').innerHTML = temp.points;
	get('js_answered').innerHTML = answered;
	get('js_error').innerHTML = temp.errors;
	get('js_left').innerHTML = data.length-answered;
}

// Controls the questions displayed
function displayQuestion(obj) {
	paintLetter('js'+tracker, '#ffff1a');
	get('question').innerHTML=(`LETTER ${obj.letter}: ${obj.questions[rand]}`);	
}

// Checks correct or incorrect answers. Updates scores and counters
function checkAnswer (answer, obj) {
	if(answer.toUpperCase() === obj.answers[rand]) {
		alert('CORRECT!');
		input = '';
		obj.answered = true;
		temp.points++;
		answered++;
		paintLetter('js'+tracker, '#33cc33');
		tracker++;
		return gameOn();
	} else {
		alert(`NOOO SORRY ABOUT THAT. THE CORRECT ANSWER WAS: ${obj.answers[rand]}`);
		input='';
		obj.answered = true;
		temp.errors++;
		answered++;
		paintLetter('js'+tracker, '#cc0000');
		tracker++;
		return gameOn();
	}	
}

//Triggers modal with ranking. 
function buildRanking() {
	displayScores();

	//Store users in local storage to persist within sessions
	localStorage.setItem("ranking", JSON.stringify(ranking));

	//Create paragraph with final game score
	var paragraph = document.createElement('p');
	var textp = document.createTextNode(`correct: ${temp.points} / errors: ${temp.errors}`);
	paragraph.appendChild(textp);
	get("summary").appendChild(paragraph);

	//Create a list with ranking sorted by top 5 scorers
	var sorted = ranking.sort((a, b) => (b.points - a.points));
	// we only want to display the first 5!
	sorted.slice(0, 5).forEach (function (item, index) {
		var node = document.createElement("LI");
		var textnode = document.createTextNode(`${index+1} - ${item.name}: ${item.points}`);
		node.appendChild(textnode);
		get("rank").appendChild(node);	
	});

	// Show the modal
	modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}