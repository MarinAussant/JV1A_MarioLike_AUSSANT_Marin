export default {

    addCollider(object, callback){
        this.scene.physics.add.collider(this, object, callback, null, this);
    },

    addOverlap(object, callback){
        this.scene.physics.add.overlap(this, object, callback, null, this);
    },

    addOverlapOnce(object, callback){
        const overlap = this.scene.physics.add.overlap(this, object,
            () => {callback();
            overlap.active = false;
        }
            , null, this);
    }, 
}