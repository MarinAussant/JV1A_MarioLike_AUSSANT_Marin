export default class State {
    constructor(player, scene) {
      this.player = player;
      this.scene = scene;
    }
  
    enter() {
      // code pour entrer dans l'état "saut"
    }
  
    exit() {
      // code pour sortir de l'état "saut"
    }
  
    update() {
      // code spécifique à l'état "saut" pour mettre à jour l'état du joueur pendant un saut
    }
}