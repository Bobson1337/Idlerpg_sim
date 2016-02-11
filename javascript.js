function simulate() { //Main
	var playerOne = document.simulatorFields.player_one.value; 
	var playerTwo = document.simulatorFields.player_two.value;
	var playerOneSum = Number(document.simulatorFields.player1_sum.value);
	var playerTwoSum = Number(document.simulatorFields.player2_sum.value);
	var playerOneLife = Number(document.simulatorFields.player1_life.value)/100;
	var playerTwoLife = Number(document.simulatorFields.player2_life.value)/100;
	var playerOneRoll = Math.floor((Math.random() * (playerOneSum + 1)));
	var playerTwoRoll = Math.floor((Math.random() * (playerTwoSum + 1)));
	var characterOneClass = new character(0, playerOneSum, playerOneLife, playerOne);
	var characterTwoClass = new character(0, playerTwoSum, playerTwoLife, playerTwo);
	document.getElementById("result").innerHTML = "The " + playerOne + " rolls: " + playerOneRoll;
	document.getElementById("playerOneResults").innerHTML = 'The ' + playerTwo + " rolls: " + playerTwoRoll;

	classfunc(characterOneClass, characterTwoClass); //Add player one class modification
	classfunc(characterTwoClass, characterOneClass); //Add player two class modification
	calculator(characterOneClass, characterTwoClass);
}

function calculator(sum1, sum2) //Calculates and prints simulatio
{ 
	try
	{
		var totalOutcomes = ((sum1.maxSum+1)-sum1.minSum)*((sum2.maxSum+1)-sum2.minSum); //101 * 201
		var simulationResultsPlayerOne = "Chance of player one winning is:  ";
		var simulationResultsPlayerTwo = "Chance of player two winning is:  ";
		var gatheredResults = " Winner is: Player one";
		var modifier = 0.5;

	 	//src = "http://www.probabilityformula.org/"
		document.getElementById("chance").innerHTML = ""; //Resets previous text in "chance"
		var stalemate = 0;
		var i = sum1.minSum;
		while(i < sum1.maxSum) //Calculates the amount of equal rolls that can be made
		{
			if(i >= sum2.minSum && i <= sum2.maxSum)
				stalemate++;
			i++;
		}


		if(sum2.maxSum>sum1.maxSum) //placerar den med högst max sum som playerOne,detta för att förenkla algoritm för beräkning av vinstchans
		{
			var temp = sum2;
			sum2 = sum1;
			sum1 = temp;
			temp = simulationResultsPlayerOne;
			simulationResultsPlayerOne = simulationResultsPlayerTwo;
			simulationResultsPlayerTwo = temp;
			gatheredResults = " Winner is player two"; 
		}

		if(sum1.characterClass == "Rogue" && sum2.characterClass != "Rogue" && sum2.characterClass != "Creep") //Adds Rogue Modifier
		{
			modifier = 0.625;
		}
		else if(sum2.characterClass == "Rogue" && sum1.characterClass != "Rogue" && sum1.characterClass != "Creep") //Adds Rogue modifier
		{
			modifier = 0.375;
		}

		if(sum1.minSum>sum2.maxSum) //If rogue/certain dragons minsum is higher than opponent maxsum.
		{
			document.getElementById("chance").innerHTML = simulationResultsPlayerOne + "100% chance";
		}

		else
		{
			var winningOutcomes = (sum2.maxSum+1) * (sum1.maxSum-sum2.maxSum); 
			var outcomes = totalOutcomes - (stalemate+1); 
			var equalOutcomes = (outcomes - winningOutcomes)*modifier; 
			var winPercentage = (equalOutcomes + winningOutcomes)/totalOutcomes;
			var stalematePercentage = (stalemate+1)/totalOutcomes;
			var losePercentage = 100 - ((winPercentage * 100) + (stalematePercentage*100));
			document.getElementById("chance").innerHTML += simulationResultsPlayerOne + " " + (winPercentage * 100).toFixed(3) + " %<br>" + simulationResultsPlayerTwo + losePercentage.toFixed(3) + "%" + "<br> Chance of stalemate: " + (stalematePercentage*100).toFixed(3) + "%<br>" + gatheredResults;
		}
	}
	catch (err)
	{
		document.getElementById("chance").innerHTML = "Oppps, something went wrong. Try again."; 
	}
}

function classfunc(classOne, classTwo) //Function that adds class modifiers
{
	if(classOne.characterClass == "Creep"){}
	else if(classOne.characterClass == "Barbarian" && classTwo.characterClass != "Creep") //adds 30% to maximum roll
	{
		classOne.maxSum += (classOne.maxSum/100)*30;
		if(classTwo.characterClass == "Paladin")
			 classOne.maxSum += (classOne.maxSum/100)*30;
	}

	else if(classOne.characterClass == "Wizard" && classTwo.characterClass != "Creep") //subtracts 25% to opponents maximum roll
	{
		classTwo.maxSum -= (classTwo.maxSum/100)*25;
		if(classTwo.characterClass == "Barbarian")
			 classOne.maxSum += (classOne.maxSum/100)*30;
	}

	else if(classOne.characterClass == "Paladin" && classTwo.characterClass != "Creep")  //has a 80% chance to subtract 40% to opponents maximum roll
	{
		classTwo.maxSum -= (classTwo.maxSum/100)*(40*0.8);
		if(classTwo.characterClass == "Rogue")
			 classOne.maxSum += (classOne.maxSum/100)*30;
	}
	else if(classOne.characterClass == "Rogue" && classTwo.characterClass != "Creep")
    {
    	if(classTwo.characterClass == "Wizard")
			 classOne.maxSum += (classOne.maxSum/100)*30;
    	classOne.minSum = ((classOne.maxSum/100)*25);
    }
}

function character(minSum, maxSum, life, characterClass) 
{
    this.life = life;
    this.maxSum = maxSum*life;
 	this.characterClass = characterClass;
	this.minSum = minSum;
}