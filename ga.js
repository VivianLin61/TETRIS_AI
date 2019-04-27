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
        }}


        for(var i = 0; i < this.popsize; i++) {
            this.games[i].fitness /= maxfit;
        }

          this.matingpool = [];
    // Take rockets fitness make in to scale of 1 to 100
    // A rocket with high fitness will highly likely will be in the mating pool
    for (var i = 0; i < this.popsize; i++) {
      var n = this.games[i].fitness * 100;
      for (var j = 0; j < n; j++) {
        this.matingpool.push(this.games[i]);
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
      newRockets[i] = new Game(child);
    }
    // This instance of rockets are the new rockets
    this.rockets = newRockets;
  }


  this.run = function() {
    for (var i = 0; i < this.popsize; i++) {
        //play game
    }
  }

}




function DNA(genes) {
  // Recieves genes and create a dna object
  if (genes) {
    this.genes = genes;
  }
  // If no genes just create random dna
  else {
    this.genes = [];
    for (var i = 0; i < lifespan; i++) {
      // Gives random vectors
      this.genes[i] = {
        a : - Math.random();
        b : - Math.random();
        c : Math.random();
        d : -Math.random();
      }
      // Sets maximum force of vector to be applied to a rocket

    }
  }
  // Performs a crossover with another member of the species
  this.crossover = function(partner) {
    var newgenes = [];
    // Picks random midpoint
    var mid = floor(random(this.genes.length));
    for (var i = 0; i < this.genes.length; i++) {
      // If i is greater than mid the new gene should come from this partner
      if (i > mid) {
        newgenes[i] = this.genes[i];
      }
      // If i < mid new gene should come from other partners gene's
      else {
        newgenes[i] = partner.genes[i];
      }
    }
    // Gives DNA object an array
    return new DNA(newgenes);
  }

  // Adds random mutation to the genes to add variance.
  this.mutation = function() {
    for (var i = 0; i < this.genes.length; i++) {
      // if random number less than 0.01, new gene is then random vector
      if (random(1) < 0.01) {
        this.genes[i] = {
            a : - Math.random();
            b : - Math.random();
            c : Math.random();
            d : -Math.random();

        }
      }
    }
  }

}
