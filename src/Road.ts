import {vec3, vec2, mat3, vec4, quat, glMatrix} from 'gl-matrix';
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
    // mapTexture: Array<vec4>;
    mapTexture: Uint8Array;
    mapWidth: number;
    mapHeight: number;
    first1: boolean = true;

    edges: Array<Edge> = new Array<Edge>();
    intersections: Set<Intersection> = new Set();

    transformations: mat3[] = new Array();

    constructor (texture: Uint8Array, width: number, height: number) {

        this.currTurtle = new Turtle(vec3.fromValues(-0.8, -0.8, 1), vec3.fromValues(1, 0, 0), vec3.fromValues(1, 0, 0), 1);
        this.turtleStack.push(this.currTurtle);

        this.currTurtle = new Turtle(vec3.fromValues(-0.9, 0.9, 1), vec3.fromValues(1, -1, 0), vec3.fromValues(1, 0, 0), 1);
        this.turtleStack.push(this.currTurtle);

        this.currTurtle = new Turtle(vec3.fromValues(0.02, 0.15, 1), vec3.fromValues(0, 1, 0), vec3.fromValues(1, 0, 0), 1);

        this.turtleStack.push(this.currTurtle);



        // this.currTurtle = new Turtle(vec3.fromValues(-1.0,-1.0, 1), vec3.fromValues(0, 1, 0), vec3.fromValues(1, 0, 0), 1);
        this.mapTexture = new Uint8Array(texture.length);
        for (var i = 0; i < texture.length; i++) {
          this.mapTexture[i] = texture[i];
        }
        // this.mapTexture = vectorPixels;
        this.mapWidth = width;
        this.mapHeight = height;
        this.updateState();
    }

    updateState() {
        let counter = 0;

        while (this.turtleStack.stack.length != 0) {
            if (counter > 200) {
                return;
            }
            counter++;

            this.currTurtle = this.turtleStack.pop();
            if (this.first1) {
                this.currTurtle.branchNumber = 3;
                this.first1 = false;
            }
            if (this.currTurtle.branchNumber == 1) {
                let rotateAmt1 = (120 * Math.random() - 60);
                let rotateAmt2 = (120 * Math.random() - 60);
                let rotateAmt3 = (120 * Math.random() - 60);


                let testTurtle1 = new Turtle(vec3.fromValues(this.currTurtle.position[0], this.currTurtle.position[1], this.currTurtle.position[2]), 
                                             vec3.fromValues(this.currTurtle.forward[0], this.currTurtle.forward[1], this.currTurtle.forward[2]), 
                                             vec3.fromValues(this.currTurtle.right[0], this.currTurtle.right[1], this.currTurtle.right[2]),
                                             this.currTurtle.depth);
                let testTurtle2 = new Turtle(vec3.fromValues(this.currTurtle.position[0], this.currTurtle.position[1], this.currTurtle.position[2]), 
                                             vec3.fromValues(this.currTurtle.forward[0], this.currTurtle.forward[1], this.currTurtle.forward[2]), 
                                             vec3.fromValues(this.currTurtle.right[0], this.currTurtle.right[1], this.currTurtle.right[2]),
                                             this.currTurtle.depth);                
                                             
                let testTurtle3 = new Turtle(vec3.fromValues(this.currTurtle.position[0], this.currTurtle.position[1], this.currTurtle.position[2]), 
                                             vec3.fromValues(this.currTurtle.forward[0], this.currTurtle.forward[1], this.currTurtle.forward[2]), 
                                             vec3.fromValues(this.currTurtle.right[0], this.currTurtle.right[1], this.currTurtle.right[2]),
                                             this.currTurtle.depth);                
                
                testTurtle1.rotate(rotateAmt1);
                testTurtle2.rotate(rotateAmt2);
                testTurtle3.rotate(rotateAmt3);

                testTurtle1.moveForward(0.1);
                testTurtle2.moveForward(0.1);
                testTurtle3.moveForward(0.1);

                let pop1 = this.getPopulation(testTurtle1.position[0], testTurtle1.position[1]);
                let pop2 = this.getPopulation(testTurtle2.position[0], testTurtle2.position[1]);
                let pop3 = this.getPopulation(testTurtle3.position[0], testTurtle3.position[1]);

                if (pop1 > pop2 && pop1 > pop3) {
                    this.rotateTurtle(rotateAmt1);  
                } else if (pop2 > pop3) {
                    this.rotateTurtle(rotateAmt2);  
                } else {
                    this.rotateTurtle(rotateAmt3);
                }
                if (this.placeEdge(0.1, 0.005)) {
                    this.turtleStack.push(this.currTurtle);
                }

            } else if (this.currTurtle.branchNumber == 2) {
                let theta1 = 60 + (Math.random() * 60 - 30);
                let theta2 = -60 + (Math.random() * 60 - 30);

                let realTurtle1 = new Turtle(vec3.fromValues(this.currTurtle.position[0], this.currTurtle.position[1], this.currTurtle.position[2]), 
                                             vec3.fromValues(this.currTurtle.forward[0], this.currTurtle.forward[1], this.currTurtle.forward[2]), 
                                             vec3.fromValues(this.currTurtle.right[0], this.currTurtle.right[1], this.currTurtle.right[2]),
                                             this.currTurtle.depth);

                let realTurtle2 = new Turtle(vec3.fromValues(this.currTurtle.position[0], this.currTurtle.position[1], this.currTurtle.position[2]), 
                                             vec3.fromValues(this.currTurtle.forward[0], this.currTurtle.forward[1], this.currTurtle.forward[2]), 
                                             vec3.fromValues(this.currTurtle.right[0], this.currTurtle.right[1], this.currTurtle.right[2]),
                                             this.currTurtle.depth);
                realTurtle1.rotate(theta1);
                realTurtle2.rotate(theta2);

                this.currTurtle = realTurtle1;
                if (this.placeEdge(0.1, 0.005)) {
                    this.turtleStack.push(realTurtle1);
                }

                this.currTurtle = realTurtle2;
                if (this.placeEdge(0.1, 0.005)) {
                    this.turtleStack.push(realTurtle2);
                }

            } else {
                let theta1 = 120;
                let theta2 = 0;
                let theta3 = -120

                let realTurtle1 = new Turtle(vec3.fromValues(this.currTurtle.position[0], this.currTurtle.position[1], this.currTurtle.position[2]), 
                                             vec3.fromValues(this.currTurtle.forward[0], this.currTurtle.forward[1], this.currTurtle.forward[2]), 
                                             vec3.fromValues(this.currTurtle.right[0], this.currTurtle.right[1], this.currTurtle.right[2]),
                                             this.currTurtle.depth);

                let realTurtle2 = new Turtle(vec3.fromValues(this.currTurtle.position[0], this.currTurtle.position[1], this.currTurtle.position[2]), 
                                             vec3.fromValues(this.currTurtle.forward[0], this.currTurtle.forward[1], this.currTurtle.forward[2]), 
                                             vec3.fromValues(this.currTurtle.right[0], this.currTurtle.right[1], this.currTurtle.right[2]),
                                             this.currTurtle.depth);

                let realTurtle3 = new Turtle(vec3.fromValues(this.currTurtle.position[0], this.currTurtle.position[1], this.currTurtle.position[2]), 
                                             vec3.fromValues(this.currTurtle.forward[0], this.currTurtle.forward[1], this.currTurtle.forward[2]), 
                                             vec3.fromValues(this.currTurtle.right[0], this.currTurtle.right[1], this.currTurtle.right[2]),
                                             this.currTurtle.depth);                
                realTurtle1.rotate(theta1);
                realTurtle2.rotate(theta2);
                realTurtle3.rotate(theta3);

                this.currTurtle = realTurtle1;
                if (this.placeEdge(0.1, 0.005)) {
                    this.turtleStack.push(realTurtle1);
                }
                this.currTurtle = realTurtle2;
                if (this.placeEdge(0.1, 0.005)) {
                    this.turtleStack.push(realTurtle2);
                }
                this.currTurtle = realTurtle3;
                if (this.placeEdge(0.1, 0.005)) {
                    this.turtleStack.push(realTurtle3);
                }
                // this.turtleStack.push(realTurtle2);
                // this.turtleStack.push(realTurtle3);

            }
        }
    }

    outOfBounds(x: number, y: number) : boolean {
        if (x < -1 || x > 1 || y < -1 ||y > 1) {
            return true;
        }
        return false;
    }

    intersect(testEdge: Edge) {
        let minIntersection = new Intersection();
        let intersect: boolean = false;
        for (var i = 0; i < this.edges.length; i++) {
            let currIntersection = new Intersection();
            if (currIntersection.intersect(testEdge, this.edges[i])) {
                intersect = true;
                let currDist = vec2.distance(vec2.fromValues(testEdge.origin[0], testEdge.origin[1]), currIntersection.getPos()); 
                let prevDist = vec2.distance(vec2.fromValues(testEdge.origin[0], testEdge.origin[1]), minIntersection.getPos());
                if (currDist < prevDist) {
                    minIntersection.position = vec2.fromValues(currIntersection.position[0], currIntersection.position[1]);
                }
            }
        }
        if (!intersect) {
            return;
        }
        let distance = vec2.distance(vec2.fromValues(testEdge.origin[0], testEdge.origin[1]), minIntersection.getPos());
        if (distance < 0.00000001) {
            return;
        }
        testEdge.setLength(distance);
    }


    placeEdge(length: number, width: number) : boolean {
        let newEdge = new Edge(this.currTurtle.position, length, this.currTurtle.forward, width);
        let prevLength = newEdge.length;
        this.intersect(newEdge);
        let newLength = newEdge.length;
        let clipped = false;
        if (newLength < prevLength) {
            console.log("we clipped something" + newEdge.origin);
            clipped = true;
        }
        if (this.getTerrain(newEdge.origin[0], newEdge.origin[1]) < 0.5 || this.getTerrain(newEdge.endpoint[0], newEdge.endpoint[1]) < 0.5) {
            console.log("under the sea");
            return false;
        } else {
            if (this.outOfBounds(newEdge.endpoint[0], newEdge.endpoint[1])) {
                return false;
            }
            this.edges.push(newEdge);
            let translateMatrix = mat3.create();
            let identity = mat3.create();
            mat3.identity(identity);
            mat3.translate(translateMatrix, identity, vec2.fromValues(newEdge.origin[0], newEdge.origin[1]));

            let xScale = newEdge.width;
            let yScale = newEdge.length;
            let scaleMatrix = mat3.create();
            identity = mat3.create();
            mat3.identity(identity);
            mat3.scale(scaleMatrix, identity, vec2.fromValues(xScale, yScale));


            let baseDirection: vec3 = vec3.fromValues(0, 1, 0);
            let forwardDir: vec3 = vec3.fromValues(newEdge.direction[0], newEdge.direction[1], newEdge.direction[2]);

            var q = quat.fromValues(0, 0, 0, 0);
            quat.rotationTo(q, baseDirection, forwardDir);

            let rotMatrix = mat3.create();
            mat3.fromQuat(rotMatrix, q);

            let transform = mat3.create();
            mat3.multiply(transform, translateMatrix, rotMatrix);
            mat3.multiply(transform, transform, scaleMatrix);

            this.transformations.push(transform);

            this.currTurtle.moveForward(newEdge.length);
            if (clipped) {
                return false;
            }
            return true;
        }
    }

    saveTurtle() {
        this.turtleStack.push(this.currTurtle);
    }

    resetTurtle() {
        this.currTurtle = this.turtleStack.pop();
    }

    rotateTurtle(theta: number) {
        this.currTurtle.rotate(theta);
    }

    getTerrain(x: number, y: number) : number {
        x += 1.0;
        y += 1.0;
        x *= 0.5;
        y *= 0.5;

        x *= this.mapWidth;
        y *= this.mapHeight;
        x = Math.floor(x);
        y = Math.floor(y);
        let blue: number = this.mapTexture[4.0 * (x + this.mapWidth * y) + 2.0];
        let green: number = this.mapTexture[4.0 * (x + this.mapWidth * y) + 1.0];


        if (blue > green){
            console.log("Finding underwater")
            return 0; // Water
        } else {
            return 1; // Land
        }
    }

    getPopulation(x: number, y: number) : number {
        x += 1.0;
        y += 1.0;
        x *= 0.5;
        y *= 0.5;

        x *= this.mapWidth;
        y *= this.mapHeight;
        x = Math.floor(x);
        y = Math.floor(y);

        let population: number = this.mapTexture[4.0 * (x + this.mapWidth * y) + 3.0];
        return population;
    }
}

export default Road;
