function Game(dna) {

    if (dna) {
        this.dna = dna;
    } else {
        this.dna = new DNA();
    }

    this.fitness = 0;
    this.lines = 0;
    this.gameOver = false;


    this.update = function() {
        if (moves == 500 || gameOver == true){

            this.lines = lines;
            this.gameOver = true;
        }
    }

    this.calcFitness = function() {
        this.fitness = this.lines;

    }
    this.startGame = function(gene) {
        if (gameplay) {
            endGame();
        }

        initialize();
        gameOver = false;
        weights = Object.assign({}, this.dna.genes);
        console.log(weights);
        run();

    }

}
