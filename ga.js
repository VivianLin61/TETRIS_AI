let generation = 1;
let maxFitness = 0;
let num_of_games = 1;
let mutation_rate = 0.1;
let best_weights = {
   a:-0.014256034486687462,
b: -0.21329081648452253,
c: 0.39685599040127945,
d: -0.1241000033786885,
e: 0
}

let weights = {
  a:0,
b: 0,
c: 0,
d: 0,
e: 0,
}

const MAX_GENERATION = Infinity;
const POPSIZE = 50;

function setup() {
  population = new Population();
  population.games[num_of_games-1].startGame();
  genetic_algorithm();
}

function genetic_algorithm() {
   population.games[num_of_games-1].update();

   if (gameOver == true) {
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
    this.games.sort(function (a,b) {return b.fitness - a.fitness});


    maxFitness = this.games[0].fitness;
    best_weights = Object.assign({}, this.games[0].dna.genes);

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
    for (var i = 0; i < (this.games.length/2); i++) {
      // Picks random dna
      var parentA = this.pickOne(this.games);
      var parentB = this.pickOne(this.games);
      // Creates child by using crossover function
      var child = parentA.dna.crossover(parentB.dna, parentA, parentB);
      child.mutation();
      // Creates new rocket with child dna
      newGames[i] = new Game(child);
    }
    // This instance of rockets are the new rockets
    this.games.splice(this.games.length/2);
    this.games = this.games.concat(newGames);

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
      a : Math.random() - 0.5,
      b : Math.random() -0.5,
      c : Math.random() - 0.5,
      d : Math.random() -0.5,
      e : Math.random() - 0.5
    }
  }

  this.crossover = function(partner, pA, pB) {
    //which ever has a bigger fitness
    //if A has a larger fitness it's genes will be close to A.
    let alpha = this.genes;
    let beta = partner.genes;
    if ( pA.fitness < pB.fitness) {
      alpha = partner.genes;
      beta = this.genes;
    }
     var newgenes = {
     a: (alpha.a * .9 + beta.a * .1),
     b: (alpha.b * .9 + beta.b * .1),
     c: (alpha.c * .9 + beta.c * .1),
     d: (alpha.d * .9 + beta.d * .1),
      e: (alpha.e * .9 + beta.e * .1)
   }

    return new DNA(newgenes);
  }
  // Adds random mutation to the genes to add variance.
  this.mutation = function() {
    if (Math.random() < mutation_rate) {
      this.genes.a = this.genes.a + Math.random() * 0.4 ;
     }
    if (Math.random() < mutation_rate) {
      this.genes.b = this.genes.b + Math.random() * 0.4;
     }
    if (Math.random() < mutation_rate) {
      this.genes.c = this.genes.c + Math.random() * 0.4 ;
     }
    if (Math.random() < mutation_rate) {
      this.genes.d = this.genes.d + Math.random() * 0.4 ;
     }
        if (Math.random() < mutation_rate) {
      this.genes.e = this.genes.e + Math.random() * 0.4 ;
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

    this.update = function() {
        if (moves == 500 || gameOver == true){
            this.lines = lines;
            this.fitness = game_score;
        }
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

