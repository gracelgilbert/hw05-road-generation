import {vec3, vec4, mat4, quat, glMatrix} from 'gl-matrix';

class Edge {
    origin: vec3;
    length: number;
    direction: vec3;
    endpoint: vec3;
    width: number;

    constructor (origin: vec3, length: number, direction: vec3, width: number) {
        this.origin = origin;
        this.length = length;
        this.direction = direction;
        this.width = width;
        vec3.multiply(this.endpoint, vec3.fromValues(this.length, this.length, this.length), this.direction);
        vec3.add(this.endpoint, this.origin, this.endpoint);
    }

    getWidth() : number {
        return this.width;
    }

    setWidth(newWidth: number) {
        this.width = newWidth;
    }

    getOrigin() : vec3 {
        let output: vec3 = vec3.fromValues(this.origin[0], this.origin[1], this.origin[2]);
        return output;
    }

    setOrigin(newOrig: vec3) {
        let input: vec3 = vec3.fromValues(newOrig[0], newOrig[1], newOrig[2]);
        this.origin =  input;
        vec3.multiply(this.endpoint, vec3.fromValues(this.length, this.length, this.length), this.direction);
        vec3.add(this.endpoint, this.origin, this.endpoint);
    }

    getLength() : number {
        return this.length;
    }

    setLength(newLen: number) {
        this.length = newLen;
        vec3.multiply(this.endpoint, vec3.fromValues(this.length, this.length, this.length), this.direction);
        vec3.add(this.endpoint, this.origin, this.endpoint);
    }

    getDirection() : vec3 {
        let output: vec3 = vec3.fromValues(this.direction[0], this.direction[1], this.direction[2]);
        return output;    
    }

    setDirection(newDir: vec3) {
        let input: vec3 = vec3.fromValues(newDir[0], newDir[1], newDir[2]);
        this.direction =  input;
        vec3.multiply(this.endpoint, vec3.fromValues(this.length, this.length, this.length), this.direction);
        vec3.add(this.endpoint, this.origin, this.endpoint);
    }

    intersect(testPiece: Edge, intersection: vec3) : boolean {


        return false;
    }

}

export default Edge;
