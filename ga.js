initialize_training_varaibles();

function initialize_training_varaibles() {
  POPSIZE = 100;
  generation = 1;
  maxFitness = 0;
  maxLines = 0;
  num_of_games = 1;
  mutation_rate = 0.05;
  //How much the mutation affects the child
  //fitness_limit = ;
  move_limit = 500;
  mutation_multiplier = 0.2;
  alpha_multiplier = 0.8;
  beta_multiplier = 0.2;
  best_weights = {
    a:0,
    b:0,
    c:0,
    d:0,
    e:0,
  }
  weights = {
    a:0,
    b:0,
    c:0,
    d:0,
    e:0,
  }
}

function setup() {
  initialize_training_varaibles();
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
  if (ga == true ) {
    requestAnimationFrame(genetic_algorithm);
  }
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
    maxLines = this.games[0].lines;
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

  this.selection = function() {
    var newGames = [];
    for (var i = 0; i < (this.games.length/2); i++) {
      // Picks random dna
      var parentA = this.pickOne(this.games);
      var parentB = this.pickOne(this.games);
      // Creates child by using crossover function
      var child = parentA.dna.crossover(parentB.dna, parentA, parentB);
      child.mutation();

      newGames[i] = new Game(child);
    }
    //replace the bottom half of the population with newGames.
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
      b : Math.random() - 0.5,
      c : Math.random() - 0.5,
      d : Math.random() - 0.5,
      e : Math.random() - 0.5
    }
  }

  this.crossover = function(partner, pA, pB) {
    //child will have most of the genes from the parent with the better fitness. 
    //if A has a larger fitness it's genes will be close to A.
    let alpha = this.genes;
    let beta = partner.genes;
    if ( pA.fitness < pB.fitness) {
      alpha = partner.genes;
      beta = this.genes;
    }
     var newgenes = {
     a: (alpha.a * alpha_multiplier + beta.a * beta_multiplier),
     b: (alpha.b * alpha_multiplier + beta.b * beta_multiplier),
     c: (alpha.c * alpha_multiplier + beta.c * beta_multiplier),
     d: (alpha.d * alpha_multiplier + beta.d * beta_multiplier),
     e: (alpha.e * alpha_multiplier + beta.e * beta_multiplier)
   }
    return new DNA(newgenes);
  }
  // Adds random mutation to the genes to add variance.
  this.mutation = function() {
    if (Math.random() < mutation_rate) {
      this.genes.a = this.genes.a + Math.random() * mutation_multiplier;
     }
    if (Math.random() < mutation_rate) {
      this.genes.b = this.genes.b + Math.random() * mutation_multiplier;
     }
    if (Math.random() < mutation_rate) {
      this.genes.c = this.genes.c + Math.random() * mutation_multiplier;
     }
    if (Math.random() < mutation_rate) {
      this.genes.d = this.genes.d + Math.random() * mutation_multiplier;
     }
    if (Math.random() < mutation_rate) {
      this.genes.e = this.genes.e + Math.random() * mutation_multiplier;
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
        if (moves == move_limit || gameOver == true){
          gameOver = true;
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

