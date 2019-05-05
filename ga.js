let generation = 1;
let maxFitness = 0;
let num_of_games = 1;
let best_weights = {
  a : 0,
  b : 0,
  c : 0,
  d : 0
}

let weights = {
  a : 0,
  b : 0,
  c : 0,
  d : 0
}

const MAX_GENERATION = 5;
const POPSIZE = 5;

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

  if (generation < MAX_GENERATION) {
    requestAnimationFrame(genetic_algorithm);
  }
}

//POPULATION OBJECT
function Population() {
  this.games = [];

  this.matingpool = [];

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
    for(var i = 0; i < POPSIZE; i++) {
      this.games[i].fitness /= maxfit;
    }

    this.matingpool = [];
    for (var i = 0; i < POPSIZE; i++) {
      var n = this.games[i].fitness * 100;
      for (var j = 0; j < n; j++) {
        this.matingpool.push(this.games[i]);
      }
    }
  }

  // Selects appropriate genes for child
  this.selection = function() {
    var newGames = [];
    for (var i = 0; i < this.games.length; i++) {
      // Picks random dna
      var parentA = this.matingpool[Math.floor(Math.random() * this.matingpool.length)].dna;
      var parentB = this.matingpool[Math.floor(Math.random() * this.matingpool.length)].dna;
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
      d : -Math.random(),
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
    if (Math.random() < 0.01) {
      this.genes = {
       a : - Math.random(),
       b : - Math.random(),
       c : Math.random(),
       d : -Math.random(),

     }
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

