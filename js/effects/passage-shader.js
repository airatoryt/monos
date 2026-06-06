/* MONOS - The Passage (GLSL Tear Shader) */
/* Fullscreen canvas with custom fragment shader for the portal sequence */

(function() {
    'use strict';

    const VERTEX_SHADER = `
        attribute vec2 a_position;
        varying vec2 v_uv;
        void main() {
            v_uv = a_position * 0.5 + 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const FRAGMENT_SHADER = `
        precision highp float;

        uniform vec2 u_resolution;
        uniform float u_time;
        uniform float u_passage; // 0..1, the scroll-driven progress
        uniform sampler2D u_scene; // The Three.js canvas rendered as texture
        uniform float u_mode; // 0=normal, 1=tear, 2=scaffolding, 3=convergence

        varying vec2 v_uv;

        // Pseudo-random
        float rand(vec2 co) {
            return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
        }

        // Smooth noise
        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            float a = rand(i);
            float b = rand(i + vec2(1.0, 0.0));
            float c = rand(i + vec2(0.0, 1.0));
            float d = rand(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
        }

        // Fractal noise
        float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 5; i++) {
                v += a * noise(p);
                p *= 2.0;
                a *= 0.5;
            }
            return v;
        }

        void main() {
            vec2 uv = v_uv;
            float aspect = u_resolution.x / u_resolution.y;
            vec2 p = uv;
            p.x *= aspect;

            // ====================================================
            // MODE 0: NORMAL — pass through, but apply subtle ambient
            // ====================================================
            if (u_mode < 0.5) {
                vec3 col = texture2D(u_scene, uv).rgb;
                // Subtle vignette
                float vig = 1.0 - length(uv - 0.5) * 0.6;
                col *= mix(0.7, 1.0, vig);
                gl_FragColor = vec4(col, 1.0);
                return;
            }

            // ====================================================
            // MODE 1: THE TEAR
            // - Horizontal seams that split the world
            // - RGB chromatic aberration amplifies
            // - Scan lines
            // - "Data corruption" blocks
            // ====================================================
            if (u_mode < 1.5) {
                float tearIntensity = u_passage;

                // Sample scene with extreme chromatic aberration
                float caStrength = 0.04 * tearIntensity;
                vec2 caOffset = vec2(
                    sin(uv.y * 30.0 + u_time * 2.0) * caStrength,
                    cos(uv.x * 20.0 + u_time * 1.5) * caStrength * 0.5
                );

                vec3 col;
                col.r = texture2D(u_scene, uv + caOffset).r;
                col.g = texture2D(u_scene, uv).g;
                col.b = texture2D(u_scene, uv - caOffset).b;

                // Horizontal TEAR SEAMS
                // 3 main seams that move and widen
                float seam1 = smoothstep(0.495, 0.5, fract(uv.y * 4.0 + u_time * 0.3)) *
                              (1.0 - smoothstep(0.5, 0.505, fract(uv.y * 4.0 + u_time * 0.3)));
                seam1 *= tearIntensity;

                float seam2 = smoothstep(0.498, 0.5, fract(uv.y * 7.0 - u_time * 0.2)) *
                              (1.0 - smoothstep(0.5, 0.502, fract(uv.y * 7.0 - u_time * 0.2)));
                seam2 *= tearIntensity * 0.7;

                // Random "data corruption" blocks
                vec2 block = floor(uv * vec2(40.0, 20.0));
                float blockRand = rand(block + floor(u_time * 8.0));
                float corrupted = step(0.97, blockRand) * tearIntensity * 0.8;

                // Apply seam offsets (tears the image)
                if (seam1 > 0.3 || seam2 > 0.3) {
                    float displace = (rand(block) - 0.5) * 0.08 * tearIntensity;
                    vec3 tornCol;
                    tornCol.r = texture2D(u_scene, uv + vec2(displace, 0.0)).r;
                    tornCol.g = texture2D(u_scene, uv + vec2(-displace * 0.5, 0.0)).g;
                    tornCol.b = texture2D(u_scene, uv + vec2(-displace, 0.0)).b;
                    col = mix(col, tornCol, max(seam1, seam2));
                }

                // Data corruption: block-shifted pixels
                if (corrupted > 0.5) {
                    float shift = (rand(block + 1.0) - 0.5) * 0.15;
                    col = texture2D(u_scene, uv + vec2(shift, 0.0)).rgb;
                }

                // Scan lines
                float scan = sin(uv.y * u_resolution.y * 0.5) * 0.08 * tearIntensity;
                col -= scan;

                // Desaturate during tear
                float lum = dot(col, vec3(0.299, 0.587, 0.114));
                col = mix(col, vec3(lum), tearIntensity * 0.3);

                // Edge darkening at extreme tear
                col *= 1.0 - tearIntensity * 0.3;

                gl_FragColor = vec4(col, 1.0);
                return;
            }

            // ====================================================
            // MODE 2: THE SCAFFOLDING
            // - World rendered as if in debug mode
            // - Visible coordinate grid
            // - Vertex points overlay
            // - Black & white / inverted color
            // ====================================================
            if (u_mode < 2.5) {
                float scaffold = u_passage;

                // Sample the scene but heavily process it
                vec3 baseCol = texture2D(u_scene, uv).rgb;
                float lum = dot(baseCol, vec3(0.299, 0.587, 0.114));

                // Coordinate grid overlay
                vec2 grid = abs(fract(uv * vec2(40.0, 20.0)) - 0.5);
                float gridLine = step(0.48, max(grid.x, grid.y));
                vec3 gridCol = vec3(0.4, 0.5, 0.7) * gridLine * scaffold * 0.3;

                // Vertex dots at grid intersections
                vec2 grid2 = abs(fract(uv * vec2(40.0, 20.0) + 0.5) - 0.5);
                float dot = step(0.45, max(grid2.x, grid2.y));
                vec3 dotCol = vec3(0.6, 0.7, 0.9) * dot * scaffold * 0.2;

                // Invert brightness curve to make the world look "scaffolded"
                vec3 inverted = vec3(1.0) - baseCol;
                vec3 wireCol = mix(inverted, vec3(lum), 0.5);

                // Mix: starts normal, becomes wireframe-y
                vec3 col = mix(baseCol, wireCol, scaffold * 0.6);
                col += gridCol + dotCol;

                // Subtle red scan line (suggests "rendering" the world)
                float yPos = floor(uv.y * 200.0) / 200.0;
                float yProg = fract(yPos + u_time * 0.3);
                float scanGlow = exp(-yProg * 8.0) * 0.15 * scaffold;
                col += vec3(0.5, 0.0, 0.1) * scanGlow;

                gl_FragColor = vec4(col, 1.0);
                return;
            }

            // ====================================================
            // MODE 3: THE CONVERGENCE
            // - Everything converges to a single point
            // - Radial distortion
            // - Bright center pulse
            // ====================================================
            if (u_mode < 3.5) {
                float conv = u_passage;
                vec2 center = vec2(0.5, 0.5);

                // Radial displacement: image pulled toward center
                vec2 toCenter = center - uv;
                float dist = length(toCenter);
                float pull = conv * 0.6;
                vec2 warpedUV = uv + toCenter * pull;

                vec3 col = texture2D(u_scene, warpedUV).rgb;

                // Bright point at center
                float pulse = exp(-dist * 12.0) * (0.8 + 0.4 * sin(u_time * 3.0));
                col += vec3(1.0, 0.3, 0.4) * pulse * conv;

                // Radial "energy" lines
                float angle = atan(toCenter.y, toCenter.x);
                float energy = sin(angle * 24.0 + u_time * 4.0) * 0.5 + 0.5;
                energy *= smoothstep(0.0, 0.3, dist) * (1.0 - smoothstep(0.2, 0.5, dist));
                col += vec3(1.0, 0.2, 0.3) * energy * conv * 0.4;

                // Darken edges
                col *= 1.0 - conv * 0.5;

                gl_FragColor = vec4(col, 1.0);
                return;
            }

            // Fallback
            gl_FragColor = texture2D(u_scene, uv);
        }
    `;

    class PassageShader {
        constructor() {
            this.canvas = null;
            this.gl = null;
            this.program = null;
            this.sceneTexture = null;
            this.threeCanvas = null;
            this.passageProgress = 0;
            this.mode = 0;
            this.startTime = performance.now();

            this.init();
        }

        init() {
            this.createCanvas();
            this.compileShaders();
            this.setupGeometry();
            this.findThreeCanvas();
            this.start();
        }

        createCanvas() {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'passageCanvas';
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 4;
                mix-blend-mode: normal;
                opacity: 0;
                transition: opacity 0.4s ease;
            `;
            document.body.appendChild(this.canvas);

            this.gl = this.canvas.getContext('webgl', {
                preserveDrawingBuffer: true,
                premultipliedAlpha: false
            });

            if (!this.gl) {
                console.warn('WebGL not available for passage shader');
                return;
            }
        }

        compileShaders() {
            const gl = this.gl;
            const vs = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
            const fs = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
            this.program = gl.createProgram();
            gl.attachShader(this.program, vs);
            gl.attachShader(this.program, fs);
            gl.linkProgram(this.program);

            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                console.error('Shader link error:', gl.getProgramInfoLog(this.program));
            }

            this.uResolution = gl.getUniformLocation(this.program, 'u_resolution');
            this.uTime = gl.getUniformLocation(this.program, 'u_time');
            this.uPassage = gl.getUniformLocation(this.program, 'u_passage');
            this.uScene = gl.getUniformLocation(this.program, 'u_scene');
            this.uMode = gl.getUniformLocation(this.program, 'u_mode');

            this.aPosition = gl.getAttribLocation(this.program, 'a_position');
        }

        compileShader(type, source) {
            const gl = this.gl;
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            }
            return shader;
        }

        setupGeometry() {
            const gl = this.gl;
            const positions = new Float32Array([
                -1, -1,  1, -1,  -1,  1,
                -1,  1,  1, -1,   1,  1
            ]);
            this.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

            // Create texture for scene capture
            this.sceneTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.sceneTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }

        findThreeCanvas() {
            // The Three.js renderer creates a canvas inside #canvasContainer
            const container = document.getElementById('canvasContainer');
            if (container) {
                this.threeCanvas = container.querySelector('canvas');
            }
        }

        setPassage(progress) {
            // progress is 0..1 across the full page scroll
            this.passageProgress = progress;

            // Determine mode based on progress
            // 0-0.25: normal
            // 0.25-0.45: tear
            // 0.45-0.65: scaffolding
            // 0.65-0.85: convergence
            // 0.85-1.0: back to normal

            let mode = 0;
            let intensity = 0;
            let visible = false;

            if (progress < 0.25) {
                mode = 0;
                intensity = 0;
                visible = false;
            } else if (progress < 0.45) {
                mode = 1;
                intensity = (progress - 0.25) / 0.20;
                visible = true;
            } else if (progress < 0.65) {
                mode = 2;
                intensity = (progress - 0.45) / 0.20;
                visible = true;
            } else if (progress < 0.85) {
                mode = 3;
                intensity = 1.0 - (progress - 0.65) / 0.20;
                visible = true;
            } else {
                mode = 0;
                intensity = 0;
                visible = false;
            }

            this.mode = mode;
            this.intensity = intensity;
            this.visible = visible;

            if (this.canvas) {
                this.canvas.style.opacity = visible ? '1' : '0';
            }
        }

        start() {
            const resize = () => {
                if (!this.canvas || !this.gl) return;
                const dpr = Math.min(window.devicePixelRatio, 1.5);
                this.canvas.width = window.innerWidth * dpr;
                this.canvas.height = window.innerHeight * dpr;
                this.canvas.style.width = window.innerWidth + 'px';
                this.canvas.style.height = window.innerHeight + 'px';
            };
            resize();
            window.addEventListener('resize', resize);

            this.animate();
        }

        captureScene() {
            if (!this.threeCanvas || !this.gl) return;
            const gl = this.gl;
            try {
                gl.bindTexture(gl.TEXTURE_2D, this.sceneTexture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                gl.texImage2D(
                    gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
                    this.threeCanvas
                );
            } catch (e) {
                // Texture not ready
            }
        }

        animate() {
            requestAnimationFrame(() => this.animate());
            if (!this.gl || !this.visible) return;

            this.captureScene();

            const gl = this.gl;
            const time = (performance.now() - this.startTime) / 1000;

            gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.useProgram(this.program);

            gl.enableVertexAttribArray(this.aPosition);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.vertexAttribPointer(this.aPosition, 2, gl.FLOAT, false, 0, 0);

            gl.uniform2f(this.uResolution, this.canvas.width, this.canvas.height);
            gl.uniform1f(this.uTime, time);
            gl.uniform1f(this.uPassage, this.intensity);
            gl.uniform1f(this.uMode, this.mode);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.sceneTexture);
            gl.uniform1i(this.uScene, 0);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.monosPassage = new PassageShader();
            setTimeout(() => {
                if (window.monosPassage) {
                    window.monosPassage.findThreeCanvas();
                }
            }, 1500);
        });
    } else {
        window.monosPassage = new PassageShader();
        setTimeout(() => {
            if (window.monosPassage) {
                window.monosPassage.findThreeCanvas();
            }
        }, 1500);
    }
})();
