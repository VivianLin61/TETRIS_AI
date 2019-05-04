let generation = 1;
let maxFitness = 0;
let num_of_games = 0;

function setup() {
  population = new Population();
  population.games[num_of_games].startGame();
  genetic_algorithm();
}

function genetic_algorithm() {
   population.games[num_of_games].update();
    if (population.games[num_of_games].gameOver == true) {
      moves = 0;
      num_of_games ++;
      population.games[num_of_games].startGame();
    }
    //  if (num_of_games > 49) {
    //   population.evaluate();
    //   population.selection();
    //   num_of_games = 0;
    //   population.games[num_of_games].startGame();
    //   generation ++;
    // }

  if (num_of_games < 5) {
      myReq = requestAnimationFrame(genetic_algorithm);

  }

}



function Population() {
    this.games = [];
    this.popsize = 50;

    this.matingpool = [];

    for (var i = 0; i < this.popsize; i++) {
        this.games[i] = new Game();
    }

    this.evaluate = function() {
        var maxfit = 0;

        for (var i = 0; i < this.popsize; i++) {
            this.games[i].calcFitness();

            if (this.games[i].fitness > maxfit) {
                maxfit = this.games[i].fitness;
            }
        }
        maxFitness = maxfit;

        for(var i = 0; i < this.popsize; i++) {
            this.games[i].fitness /= maxfit;
        }

          this.matingpool = [];
    for (var i = 0; i < this.popsize; i++) {
      var n = this.games[i].fitness * 100;
      for (var j = 0; j < n; j++) {
        this.matingpool.push(this.games[i]);
      }
    }
  }
  // Selects appropriate genes for child
  this.selection = function() {
    var newGames = [];
    for (var i = 0; i < this.rockets.length; i++) {
      // Picks random dna
      var parentA = random(this.matingpool).dna;
      var parentB = random(this.matingpool).dna;
      // Creates child by using crossover function
      var child = parentA.crossover(parentB);
      child.mutation();
      // Creates new rocket with child dna
      newGames[i] = new Game(child);
    }
    // This instance of rockets are the new rockets
    this.games = newGames
     }

}




function DNA(genes) {
  // Recieves genes and create a dna object
  if (genes) {
    this.genes = genes;
  }
  // If no genes just create random dna
  else {
      this.genes = {
        a : - Math.random(),
        b : - Math.random(),
        c : Math.random(),
        d : -Math.random(),
      }
    }

  this.crossover = function(partner) {
    var newgenes = {
      a: (partner.dna.genes.a + this.genes.a)/2,
      b: (partner.dna.genes.b + this.genes.b)/2,
      c: (partner.dna.genes.c + this.genes.c)/2,
      d: (partner.dna.genes.d + this.genes.d)/2
    }

    return new DNA(newgenes);
  }

  // Adds random mutation to the genes to add variance.
  this.mutation = function() {
      if (random(1) < 0.01) {
    this.genes = {
       a : - Math.random(),
       b : - Math.random(),
       c : Math.random(),
       d : -Math.random(),

    }
  }
}

}
