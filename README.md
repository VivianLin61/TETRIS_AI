#tetris_ai



The Genetic Algorithm
1. Create a random initial population of games.
2. Then the algorithm creates a sequence of new populations using games from the previous population.
	a. Use the game_score of each game to compute its fitness value.
	b. Select two members from the previous population based on their fitness score. (Games with higher fitness scores are more likely 		to be picked)
	c. Produce a child game using crossover or mutation.
		Crossover- combine two parents games. The genes of the offspring will lean towards the fitter parent.
    		Mutation- each child has a 10% chance to mutate. If it does mutate then multiply each weight by a random decimal 			multiplied by the mutation multiplier.
	d.When the number of off-springs equal half the population, replace the weakest 50% of the current population with the newly 			produced children.
3.Repeat step 2 until the generation is equal to 25. 

