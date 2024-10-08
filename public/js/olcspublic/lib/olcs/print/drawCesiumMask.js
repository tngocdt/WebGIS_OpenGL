let postUnlistener = null;
// CC0 from https://github.com/mdn/dom-examples/tree/main/webgl-examples/tutorial/sample2
export class MaskDrawer {
    gl;
    programInfo;
    positionBuffer;
    constructor(gl) {
        this.gl = gl;
        const shaderProgram = this.initShaderProgram();
        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
            },
            uniformLocations: {
                uScaling: gl.getUniformLocation(shaderProgram, 'uScaling')
            }
        };
        this.positionBuffer = gl.createBuffer();
        const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    }
    getVertexShaderSource() {
        return `
      attribute vec4 aVertexPosition;
      uniform vec2 uScaling;
      void main() {
        gl_Position = vec4(aVertexPosition[0] * uScaling[0], aVertexPosition[1] * uScaling[1], -1.0, 1.0);
      }
    `;
    }
    getFragmentShaderSource() {
        return `
      precision highp float;
      void main() {
        gl_FragColor = vec4(.5, .5, .5, .6);
      }
  `;
    }
    /**
     *
     */
    initShaderProgram() {
        const gl = this.gl;
        const vsSource = this.getVertexShaderSource();
        const fsSource = this.getFragmentShaderSource();
        const vertexShader = MaskDrawer.loadShader(gl, gl.VERTEX_SHADER, vsSource), fragmentShader = MaskDrawer.loadShader(gl, gl.FRAGMENT_SHADER, fsSource), shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            throw new Error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
        }
        return shaderProgram;
    }
    /**
     *
     * @param {number[]} scaling scaling
     */
    drawMask(scaling) {
        const gl = this.gl;
        const programInfo = this.programInfo;
        // Blend
        gl.enable(gl.BLEND);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        gl.useProgram(programInfo.program);
        // Draw a first time to fill the stencil area while keeping the destination color
        gl.enable(gl.STENCIL_TEST);
        gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        gl.uniform2fv(programInfo.uniformLocations.uScaling, scaling);
        gl.blendFunc(gl.ZERO, gl.ONE);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        // Now draw again the whole viewport and darken the pixels that are not on the stencil
        gl.stencilFunc(gl.EQUAL, 0, 0xFF);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        gl.uniform2fv(programInfo.uniformLocations.uScaling, [1, 1]);
        gl.blendFunc(gl.ZERO, gl.SRC_ALPHA);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    /**
     */
    static loadShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
            // gl.deleteShader(shader);
        }
        return shader;
    }
}
/**
 *
 */
export function autoDrawMask(scene, getScalings) {
    const canvas = scene.canvas;
    const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (getScalings) {
        if (!postUnlistener) {
            const drawer = new MaskDrawer(ctx);
            postUnlistener = scene.postRender.addEventListener(() => {
                drawer.drawMask(getScalings());
            });
        }
    }
    else if (postUnlistener) {
        postUnlistener();
        // FIXME: destroy program
        postUnlistener = null;
    }
    scene.requestRender();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd0Nlc2l1bU1hc2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvb2xjcy9wcmludC9kcmF3Q2VzaXVtTWFzay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxJQUFJLGNBQWMsR0FBYSxJQUFJLENBQUM7QUFhcEMseUZBQXlGO0FBR3pGLE1BQU0sT0FBTyxVQUFVO0lBSUQ7SUFIWixXQUFXLENBQWM7SUFDekIsY0FBYyxDQUFjO0lBRXBDLFlBQW9CLEVBQWtEO1FBQWxELE9BQUUsR0FBRixFQUFFLENBQWdEO1FBQ3BFLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBRS9DLElBQUksQ0FBQyxXQUFXLEdBQUc7WUFDakIsT0FBTyxFQUFFLGFBQWE7WUFDdEIsZUFBZSxFQUFFO2dCQUNmLGNBQWMsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDO2FBQ3ZFO1lBQ0QsZ0JBQWdCLEVBQUU7Z0JBQ2hCLFFBQVEsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQzNCLGFBQWEsRUFDYixVQUFVLENBQ2I7YUFDRjtTQUNGLENBQUM7UUFFRixJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN4QyxNQUFNLFNBQVMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRS9ELEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDcEQsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLElBQUksWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FB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