import {vec3, vec2, mat3, quat, glMatrix} from 'gl-matrix';
import Turtle from './turtle';
import TurtleStack from './turtleStack'
import Map from './map'
import Edge from './edge';
import Intersection from './intersection'
import {worley} from './noiseFunctions';
import { gl } from './globals';






class Road {
    turtleStack: TurtleStack = new TurtleStack();
    currTurtle: Turtle; 
    mapTexture: WebGLTexture;

    edges: Set<Edge> = new Set();
    intersections: Set<Intersection> = new Set();

    transformations: mat3[] = new Array();


    constructor (texture: WebGLTexture) {
        this.currTurtle = new Turtle(vec3.fromValues(Math.random(), Math.random(), 1), vec3.fromValues(0, 1, 0), vec3.fromValues(1, 0, 0), 1);
        this.mapTexture = texture;
    }



    placeEdge(length: number, width: number) {
        let newEdge = new Edge(this.currTurtle.position, length, this.currTurtle.forward, 1.0);
        let center = vec3.create();
        vec3.add(center, newEdge.origin, newEdge.endpoint); 
        vec3.multiply(center, vec3.fromValues(0.5, 0.5, 0.5), center);

        let translateMatrix = mat3.create();
        let identity = mat3.create();
        mat3.identity(identity);
        mat3.translate(translateMatrix, identity, vec2.fromValues(center[0], center[1]));

        let xScale = length;
        let yScale = width;
        let scaleMatrix = mat3.create();
        identity = mat3.create();
        mat3.identity(identity);
        mat3.scale(scaleMatrix, identity, vec2.fromValues(xScale, yScale));


        let baseDirection: vec2 = vec2.fromValues(0, 1);
        let forwardDir: vec2 = vec2.fromValues(newEdge.direction[0], newEdge.direction[1]);

        let theta = Math.acos(vec2.dot(baseDirection, forwardDir) / (vec2.length(baseDirection) * vec2.length(forwardDir)));
        identity = mat3.create();
        mat3.identity(identity);
        let rotMatrix = mat3.create();
        mat3.rotate(rotMatrix, identity, theta);

        let transform = mat3.create();
        mat3.multiply(transform, translateMatrix, rotMatrix);
        mat3.multiply(transform, transform, scaleMatrix);

        this.transformations.push(transform);
    }


}

export default Road;
