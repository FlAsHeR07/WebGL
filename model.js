'use strict';

class Model {
    constructor(name, glContext, shaderProgram) {
        this.name = name;
        this.gl = glContext;                 // Stores the WebGL context.
        this.shaderProgram = shaderProgram;  // Stores the shader program.
        this.iVertexBuffer = this.gl.createBuffer();
        this.count = 0;

        this.BufferData(this.CreateSurfaceData());  // Initializes the buffer with surface data.
    }

    // Equation for calculating the coordinates of the model's vertex
    CalculateCoordinateVertex(u, v) {
        const a = 1;  // fixed value for a
        const b = 2;  // fixed value for b
        const n = 2;  // fixed value for an

        // Calculating coordinates using equations
        let x = (a + b * Math.sin(n * u)) * Math.cos(u) - v * Math.sin(u);
        let y = (a + b * Math.sin(n * u)) * Math.sin(u) + v * Math.cos(u);
        let z = b * Math.cos(n * u);

        return [x, y, z];
    }

    // Generate surface data
    CreateSurfaceData(stepsU = 80, stepsV = 10) {
        const vertices = [];
        const uMin = 0, uMax = 2 * Math.PI;
        const vMin = 0.2, vMax = 1;
        const stepU = (uMax - uMin) / stepsU;
        const stepV = (vMax - vMin) / stepsV;

        // Create polylines using the U parameter
        for (let u = uMin; u <= uMax; u += stepU) {
            for (let v = vMin; v <= vMax; v += stepV) {
                const [x, y, z] = this.CalculateCoordinateVertex(u, v);
                vertices.push(x, y, z);
            }
            // Add a break in the line (use NaN)
            vertices.push(NaN, NaN, NaN);
        }


        // Creating polylines using the V parameter
        for (let v = vMin; v <= vMax; v += stepV) {
            let firstPoint = null; // To store the first point of the line
            for (let u = uMin; u <= uMax; u += stepU) {
                const [x, y, z] = this.CalculateCoordinateVertex(u, v);
                if (firstPoint === null) {
                    firstPoint = [x, y, z]; // Save the first point of the line
                }
                vertices.push(x, y, z);
            }
            // Close the line by adding the first point
            if (firstPoint) {
                vertices.push(...firstPoint);
            }
            // Add a break in the line (use NaN)
            vertices.push(NaN, NaN, NaN);
        }



        return vertices;
    }

    // Bind data to WebGL buffer
    BufferData(vertices) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.iVertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.count = vertices.length / 3;
    }

    // Display the model
    Draw() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.iVertexBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.iAttribVertex, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.LINE_STRIP, 0, this.count);
    }
}
