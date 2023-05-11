export default class State {
    constructor(player, scene, name) {
      this.player = player;
      this.scene = scene;
      this.name = name;
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