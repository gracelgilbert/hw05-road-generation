import {vec3, vec4, mat4, quat, glMatrix, vec2} from 'gl-matrix';

class Intersection {
    position: vec2;

    constructor (pos: vec2) {
        this.position = pos;
    }

    getPos() : vec2 {
        return vec2.fromValues(this.position[0], this.position[1]);
    }

    setPos(newPos: vec2) {
        let input: vec2 = vec2.fromValues(newPos[0], newPos[1]);
        this.position =  input;
    }


}

export default Intersection;
