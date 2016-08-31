/*
* VoxelLoop Gaming BustaBit Bot (VLG-BB)
* Developed by CurtisVL
* voxelloop.co.uk
* Do not redistribute!
*
* Like the script? Consider donating me a few bits! :)
*
* Disclaimer: No one is responsible if you lose money whilst using this script!
*/

//Version
var version = 1.41;

//----------Site----------//
var BustaBit = true; 
// true = using BustaBit - false = using CS:GO Crash


//----------Bet amount----------//
var autoBaseBetEnabled = true; 
// Default: false - Enable/Disable auto base bet. Described below.

var maxLossCount = 8;
// Default: 5 - Max amount of loses to account for with autoBaseBetEnabled set to true.

var percentageOfTotal = 100;
// Default: 100 - Percentage of total balance to use when max loss is hit. (100 = 100%)

var baseBet = 10; 
// Default: 100 - Manual base bet, only used when autoBaseBetEnabled is false.

var cashOut = 1.35; 
// Default: 1.13 - Cash out at this amount. Some modes will have a locked cash out.

var maxBet = 99999999; 
// The max amount to bet - The lower this number, the slower you will earn back your loses.


//----------Crash Average----------//
//(Only used in modes 1 and 3)

var useCrashAverage = true; 
// Default: false - Enable editing current multiplier based on past 4 crash average. (Experimental!)

var highAverage = 1.85; 
// Default: 1.85 - Average multiplier to use the highAverageMultiplier.

var highAverageMultiplier = 2.0;
// Default: 2.0 - Multiplier to use when crash average is above highAverage.

var lowAverage = 1.70;
// Default: 1.60 - Average multiplier to use the lowAverageMultiplier.

var lowAverageMultiplier = 1.02;
// Default: 1.05 - Multiplier to use when crash average is below lowAverage.

var waitForBeforeRecoveryEnabled = true;
// Default: false - Wait for x multiplier to hit before placing the recovery bet.

var waitForBeforeRecovery = 1.30;
// Default: 1.60 - Amount to wait for before placing recovery bet.

//----------Mode 2 Settings----------//
var mode2multiplyBy = 1.16;
// Default: 1.16 - Amount to multiply the base by on each loss.

var mode2waitAfterWin = 8;
// Default: 8 - How many rounds to wait after a win before placing again. (0 to disable)

//----------Mode 3 Settings----------//
var mode3cashOut = 2.1;
// Default: 2.1 - Amount to cash out in mode 3.

//----------Misc----------//
var maxNegative = 99999999; 
// The max amount to allow the profit to drop to before the bot will stop.

var randomBreak = 0; 
// Default: 0 - When a round starts, the bot will generate a number between 1 and 100.
// If the generated number is smaller than the randomBreak, the bot will wait a game before betting.

var clearConsole = true;
// Default: true - Clear the console after 500 minutes, usefull for running the bot on systems with low RAM.

var experimentalFeatures = false;
// Default: false - Enable experimental web-based settings.

//----------Modes----------//
var mode = 3; 

// 1 = Default - Mode will place a bet at the base amount and base multiplier. On loss, it will raise the bet by 4x and increase the multiplier to a max of 1.33x.
// 2 = 9x Seeker - Mode will place the base amount and 9x multiplier. On loss, it will raise the bet by mode2multiplyBy until a 10x is reached.

//Do not edit below this line!

var user;
var startBalance = engine.getBalance();
var currentGame = -1;
var currentBet;
var lastBet;
var gameResult;
var gameInside;
var random;
var takingBreak = false;
var firstGame = true;
var lossCount = 0;
var winCount = 0;
var currentMultiplier;
var lossBalance = 0;
var firstLoss = true;
var currentLoss = 0;
var lastBet;
var promptBet;
var promptMultiplier;
var promptMaxBet;
var confirmSettings;
var lastResult;
var currency;
var startup = true;
var d = new Date();
var startTime = d.getTime();
var newdate;
var timeplaying;
var lastCrash;
var betPlaced = false;
var lastBalance;
var tempBet;
var profit;
var tempCrash;
var gameAverage = 0;
var currentGame = 0;
var game1;
var game2;
var game3;
var game4;
var resetLoss;
var waitTime = -1;
var lossStreak;
var alreadyRan;
var highLow;
var temptime = 500;
var jsonInc
var firstGrab = true;

//JSON Grabber
var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "json";
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
};

if(startup == true){
	if(mode == 3 && maxLossCount < 10){
		window.alert("We suggest you set Max Loss Count to more than 10 for Martingale!");
		engine.stop();
	}
	
    printStartup();
	jsonInc = randNum(1,999999);
	startup = false;
}

if(BustaBit == true){
	user = engine.getUsername();
	currency = "bits";
}
else{
	user = engine.getSteamID();
	currency = "coins";
}

//Game Starting
engine.on('game_starting', function(info){
	currentGameID = info.game_id;
	var random = randNum(1,100);
    
	if(experimentalFeatures == true){
		getJSON(("https://crossorigin.me/http://vl1.voxelloop.co.uk/bustabit/" + user + "?" + jsonInc),
		function(err, data) {
		if (err != null) {
			console.log("Something went wrong whilst grabbing the JSON: Error " + err);
			console.log("Stopping bot!");
			engine.stop();
		} else {
			jsonInc += 1;
		
			if(firstGrab == true){
				//Insert stuff only to be grabbed once here
				firstGrab = false;
			}
			
			autoBaseBetEnabled = data.autoBaseBetEnabled;
			maxLossCount = data.maxLossCount;
			percentageOfTotal = data.percentageOfTotal;
			baseBet = data.baseBet;
			cashOut = data.cashOut;
			maxBet = data.maxBet;
			useCrashAverage = data.useCrashAverage;
			highAverage = data.highAverage;
			highAverageMultiplier = data.highAverageMultiplier;
			waitForBeforeRecoveryEnabled = data.waitForBeforeRecoveryEnabled;
			waitForBeforeRecovery = data.waitForBeforeRecovery;
			mode2multiplyBy = data.mode2multiplyBy;
			mode2waitAfterWin = data.mode2waitAfterWin;
			maxNegative = data.maxNegative;
			randomBreak = data.randomBreak;
			clearConsole = data.clearConsole;
			mode = data.mode;
			console.log("User data loaded!");
		}
		});
	}
	
	if(game4 != null){
		gameAverage = (((game1 + game2) + (game3 + game4)) / 4);
	}
	else{
		gameAverage = 0;
	}
	
	if(random < randomBreak){
		takingBreak = true;
		console.log("Taking a random break this round!");
	}
	else{
		takingBreak = false;
	}
	
	if(gameAverage != 0){
		console.log("Crash average: " + gameAverage + "x");
	}
	
	//Auto base bet
	if(autoBaseBetEnabled == true && lastResult == "WON" || firstGame == true){
		var divider = 100;
		for (i = 0; i < maxLossCount; i++) {
			if(mode == 1 || mode == 5){
				divider += (100 * Math.pow(4, (i + 1)));
			}
			if(mode == 2){
				divider += (100 * Math.pow(mode2multiplyBy, (i + 1)));
			}
			if(mode == 3){
				divider += (100 * Math.pow(2, (i + 1)));
			}
		}
		baseBet = Math.min(Math.max(1, Math.floor((percentageOfTotal/100) * engine.getBalance() / divider)), maxBet * 100);
	}
	
	if(takingBreak == false){
		
		//Gamemode 1 (Default)
		if(mode == 1){
			
			//Shutdown on max loss
			if(lossCount > maxLossCount){
				console.log("Max loss count reached! Shutting down...");
				engine.stop();
			}
			
			//Reset cooldown
			if (resetLoss == true) {
				if (lossCount == 0) {
				resetLoss = false;
			}
			else {
				lossCount--;
				console.log('Waiting a few games! Games remaining: ' + lossCount);
				return;
				}
			}
			
			//First Game
			if(firstGame == true && betPlaced == false){
				currentBet = baseBet;
				currentMultiplier = cashOut;
				if(game4 == null){
					currentMultiplier = 1.02;
				}
				firstGame = false;
				placeBet();
				newdate = new Date();
				timeplaying = ((newdate.getTime() - startTime) / 1000) / 60;
				betPlaced = true;
			}
			
			//On Lost
			if(lastResult == "LOST" && betPlaced == false && firstGame == false){
				
				if(firstLoss == true){
					lossBalance = 0;
					lossStreak = 0;
					firstLoss = false;
				}
				
				if(lastCrash >= waitForBeforeRecovery && waitForBeforeRecoveryEnabled == true){
					var lastLoss = currentBet;
					lossBalance += lastLoss;
					lastLoss /= 4;
					lossStreak++;
					
					currentBet *= 4;
					currentMultiplier = 1 + (lossBalance / currentBet);
					console.log("Bet changed to: " + currentBet);
					if(game4 == null){
						currentMultiplier = 1.02;
					}
					placeBet();
					betPlaced = true;
				}
				else if (waitForBeforeRecoveryEnabled == true){
					console.log("Waiting for " + waitForBeforeRecovery + "x before placing recovery bet.");
					console.log("----------------------------");
				}
			}
			
			//On Win
			if(lastResult == "WON" && betPlaced == false){
				
				currentBet = baseBet;
				currentMultiplier = cashOut;
				firstLoss = true;
				
				if(lossCount == 0 && useCrashAverage == true && gameAverage != 0){
					if(gameAverage < highAverage){
						currentMultiplier = cashOut;
					}
					if(gameAverage >= highAverage){
						currentMultiplier = highAverageMultiplier;
					}
					
					if(gameAverage < lowAverage){
						currentMultiplier = lowAverageMultiplier;
					}
				}
				
				if(game4 == null){
					currentMultiplier = 1.02;
				}
			
				placeBet();
				betPlaced = true;
			}
		}
		
		//Gamemode 2 (9x Seeker)
		if(mode == 2){
			
			if(cashOut < 7){
				window.alert("Cash Out must be 7 or higher for this gamemode! (Suggested 7-9x)");
				console.log("Cash Out must be 7 or higher for this gamemode! (Suggested 7-9x)");
				engine.stop();
			}
			
			if(maxLossCount < 10){
				window.alert("Max Loss Count must be 10 or higher for this gamemode! (Suggested 20+)");
				console.log("Max Loss Count must be 10 or higher for this gamemode! (Suggested 20+)");
				engine.stop();
			}
			
			if(lossCount >= maxLossCount){
				console.log("Max Loss Count reached! Stopping bot...");
				engine.stop();
			}
			
			//First Game
			if(firstGame == true && betPlaced == false){
				currentBet = baseBet;
				currentMultiplier = cashOut;
				firstGame = false;
				newdate = new Date();
				timeplaying = ((newdate.getTime() - startTime) / 1000) / 60;
				placeBet();
				betPlaced = true;
			}
			
			//On Loss
			if(lastResult == "LOST" && betPlaced == false && firstGame == false){
				
				if(firstLoss == true){
					firstLoss = false;
					lossBalance = 0;
					lossBalance = (currentBet * mode2multiplyBy);
					//currentBet = Math.floor(lossBalance.toFixed(1));
					currentBet = Math.round(lossBalance.toFixed(1));
					currentMultiplier = cashOut;
					console.log("Bet changed to: " + currentBet);
					placeBet();
					betPlaced = true;
				}
				
				else{
					lossBalance *= mode2multiplyBy;
					//currentBet = Math.floor(lossBalance.toFixed(1));
					currentBet = Math.round(lossBalance.toFixed(1));
					currentMultiplier = cashOut;
					console.log("Bet changed to: " + currentBet);
					placeBet();
					betPlaced = true;
				}
			}
			
			//On Win
			if(lastResult == "WON" && betPlaced == false){
				
				if(mode2waitAfterWin > 0){
					if(waitTime == -1){
						waitTime = mode2waitAfterWin;
					}
					else{
						waitTime -= 1;
						console.log("Cooldown remaining: " + waitTime);
					}
					if(waitTime == 0){
						waitTime = -1;
						console.log("Cooldown finished!");
						currentBet = baseBet;
						currentMultiplier = cashOut;
						firstLoss = true;
						placeBet();
						betPlaced = true;
					}
				}
				else{
					currentBet = baseBet;
					currentMultiplier = cashOut;
					firstLoss = true;
					placeBet();
					betPlaced = true;
				}
			}
		}
		
		//Gamemode 3 (Martingale)
		if(mode == 3){
			
			//Shutdown on max loss
			if(lossCount > maxLossCount){
				console.log("Max loss count reached! Shutting down...");
				engine.stop();
			}
			
			//Reset cooldown
			if (resetLoss == true) {
				if (lossCount == 0) {
				resetLoss = false;
			}
			else {
				lossCount--;
				console.log('Waiting a few games! Games remaining: ' + lossCount);
				return;
				}
			}
			
			//First Game
			if(firstGame == true && betPlaced == false){
				currentBet = baseBet;
				currentMultiplier = mode3cashOut;
				firstGame = false;
				placeBet();
				newdate = new Date();
				timeplaying = ((newdate.getTime() - startTime) / 1000) / 60;
				betPlaced = true;
			}
			
			//On Lost
			if(lastResult == "LOST" && betPlaced == false && firstGame == false){
				
				if(firstLoss == true){
					lossBalance = 0;
					lossStreak = 0;
					firstLoss = false;
				}
				
				lossStreak++;
				currentBet *= 2;
				currentMultiplier = mode3cashOut;
				console.log("Bet changed to: " + currentBet);
				placeBet();
				betPlaced = true;
			}
			
			//On Win
			if(lastResult == "WON" && betPlaced == false){
				
				currentBet = baseBet;
				currentMultiplier = mode3cashOut;
				firstLoss = true;
			
				placeBet();
				betPlaced = true;
			}
		}
	}
});

engine.on('cashed_out', function(data){
	
});

engine.on('game_crash', function(data){
	betPlaced = false;
	gameResult = engine.lastGamePlay();
	gameInside = engine.lastGamePlayed();
	lastCrash = (data.game_crash / 100);
	
	newdate = new Date();
	timeplaying = ((newdate.getTime() - startTime) / 1000) / 60;
	
	if(takingBreak == true)
	{
		takingBreak = false;
	}
	
	if(gameResult == "WON" && gameInside == true){
		lastResult = "WON";
		winCount += 1;
		lossCount = 0;
		printResults();
	}
	else if(gameResult == "LOST" && gameInside == true){
		lastResult = "LOST";
		lossCount += 1;
		winCount = 0;
		printResults();
	}
	
	if(clearConsole == true){
		if(timeplaying == temptime){
			temptime += 500;
			console.clear();
		}
	}
	
	currentGame++;
	tempCrash = (data.game_crash / 100);
	if (tempCrash >= 2.0){
		tempCrash = 2.0;
	}
	if (tempCrash < 1.0){
		tempCrash = 1.0;
	}
	if (currentGame == 1){
		game1 = tempCrash;
	}
	else if(currentGame == 2){
		game2 = tempCrash;
	}
	else if(currentGame == 3){
		game3 = tempCrash;
	}
	else if(currentGame == 4){
		game4 = tempCrash;
	}
	else if(currentGame >= 5){
		currentGame = 1;
		game1 = tempCrash;
	}
});

function placeBet(){
	if(((engine.getBalance() / 100) - currentBet) < ((startBalance / 100) - maxNegative)){
		console.log('Max negative reached! Stopping bot.');
		engine.stop();
	}
	if(currentBet > maxBet){
		console.log("Max bet reached!");
		currentBet = maxBet;
	}
	engine.placeBet(currentBet * 100, Math.round(currentMultiplier * 100), false);
	console.log("----------------------------");
	console.log("Betting " + currentBet + " " + currency + ", cash out at " + currentMultiplier + "x");
	lastBet = currentBet;
}

function printStartup(){
	console.log("Bot started!");
	console.log(" ");
	console.log("VoxelLoop Bet-Bot");
	console.log("Version " + version);
	console.log("Start balance: ", (startBalance / 100));
	console.log(" ");
}

function printResults(){
	if(currentGameID != null){
		console.log("Game ID: ", currentGameID);
	}
	console.log("Crashed at: " + lastCrash + "x"); 
	if(lastResult == "LOST"){
		console.log("Result: %c LOST", 'background: #ffffff; color: #ff0000');
	}
	else{
		console.log("Result: %c WON", 'background: #ffffff; color: #339933');
	}
	console.log("Win Count: ", winCount);
	console.log("Loss Count: ", lossCount);
	console.log(" ");
	console.log('Session profit: ' + ((engine.getBalance() - startBalance) / 100).toFixed(2) + ' ' + currency + ' in ' + Math.round(timeplaying) + ' minutes.');
	console.log(" ");
}

function randNum(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}