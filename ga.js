let generation = 1;
let maxFitness = 0;
let num_of_games = 1;
let mutation_rate = 0.1;
let best_weights = {
  a : -0.612107043230623,
  b : -0.8379243317418958,
  c : 0.323387373920562,
  d : -0.3229463534592629

}

// //Max Fit 317
// a : -0.48949459378873994,
//   b : -0.8745234125736482,
//   c : 0.3223501755056043,
//   d : -0.29128689535437063

// //Max Fit 328
// Height:-0.612107043230623
// Holes: -0.8379243317418958
// Cleared: 0.323387373920562
// Bumpiness: -0.3229463534592629





let weights = {
  a : 0,
  b : 0,
  c : 0,
  d : 0
}

const MAX_GENERATION = 5;
const POPSIZE = 50;

function setup() {
  population = new Population();
  population.games[num_of_games-1].startGame();
  genetic_algorithm();
}

function genetic_algorithm() {
   population.games[num_of_games-1].update();

   if (population.games[num_of_games-1].endGame == true) {
    moves = 0;
    num_of_games ++;
    population.games[num_of_games-1].startGame();
  }

  if (num_of_games == POPSIZE) {
    population.evaluate();
    population.selection();
    num_of_games = 1;
    population.games[num_of_games-1].startGame();
    generation ++;
  }

    requestAnimationFrame(genetic_algorithm);

}

//POPULATION OBJECT
function Population() {
  this.games = [];


  for (var i = 0; i < POPSIZE; i++) {
    this.games[i] = new Game();
  }

  this.evaluate = function() {
    var maxfit = 0;

    for (var i = 0; i < POPSIZE; i++) {
      this.games[i].calcFitness();

      if (this.games[i].fitness > maxfit) {
        maxfit = this.games[i].fitness;
        best_weights = Object.assign({}, this.games[i].dna.genes);
      }
    }
    maxFitness = maxfit;

    let sum_of_scores = 0;
    for (var i = 0; i < POPSIZE; i++) {
      sum_of_scores += this.games[i].fitness
    }

    for (var i = 0; i < POPSIZE; i++) {
      this.games[i].prob = this.games[i].fitness/sum_of_scores;
    }
  }


  this.pickOne = function(list) {
    var index = 0;
    var r = Math.random();

    while( r > 0) {
      r = r - list[index].prob;
      index ++;
    }
    index --;
    return list[index];
  }

  // Selects appropriate genes for child
  this.selection = function() {
    var newGames = [];
    for (var i = 0; i < this.games.length; i++) {
      // Picks random dna
      var parentA = this.pickOne(this.games).dna;
      var parentB = this.pickOne(this.games).dna;
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

//DNA OBJECT
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
      d : -Math.random()
    }
  }

  this.crossover = function(partner) {
    var newgenes = {
      a: (partner.genes.a + this.genes.a)/2,
      b: (partner.genes.b + this.genes.b)/2,
      c: (partner.genes.c + this.genes.c)/2,
      d: (partner.genes.d + this.genes.d)/2
    }

    return new DNA(newgenes);
  }
  // Adds random mutation to the genes to add variance.
  this.mutation = function() {
    if (Math.random() < mutation_rate) {
      this.genes.a = this.genes.a + Math.random() - 0.5;
     }
    if (Math.random() < mutation_rate) {
      this.genes.b = this.genes.b + Math.random() - 0.5;
     }
    if (Math.random() < mutation_rate) {
      this.genes.c = this.genes.c + Math.random() - 0.5;
     }
    if (Math.random() < mutation_rate) {
      this.genes.d = this.genes.d + Math.random() - 0.5;
     }
   }
 }

//GAME OBJECT
function Game(dna) {
    if (dna) {
        this.dna = dna;
    } else {
        this.dna = new DNA();
    }

    this.fitness = 0;
    this.prob = 0;
    this.lines = 0;
    this.game_score = 0;
    this.endGame = false;

    this.update = function() {
        if (moves == 500 || gameOver == true){
            this.lines = lines;
            this.game_score = game_score;
            this.endGame = true;
        }
    }

    this.calcFitness = function() {
        this.fitness = this.game_score;
    }

    this.startGame = function(gene) {
        if (gameplay) {
            endGame();
        }
        initialize();
        gameOver = false;
        weights = Object.assign({}, this.dna.genes);
        run();
    }
}

