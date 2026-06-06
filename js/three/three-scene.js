/* MONOS - Three.js Scene */
/* 3D universe, black hole, and geometric elements */

(function() {
    'use strict';

    const SCENE_CONFIG = {
        camera: {
            fov: 60,
            near: 0.1,
            far: 2000,
            position: { x: 0, y: 0, z: 500 }
        },
        renderer: {
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        },
        blackHole: {
            radius: 50,
            rotationSpeed: 0.001
        }
    };

    class MonosScene {
        constructor() {
            this.container = document.getElementById('canvasContainer');
            if (!this.container) return;

            this.scene = null;
            this.camera = null;
            this.renderer = null;
            this.clock = new THREE.Clock();

            this.particleSystems = [];
            this.universeSpheres = [];
            this.blackHole = null;
            this.thornRing = null;
            this.accretionDisk = null;

            this.scrollProgress = 0;
            this.targetScrollProgress = 0;

            // Passage state
            this.passageProgress = 0;
            this.passageMode = 0; // 0=normal, 1=tear, 2=scaffold, 3=converge

            this.init();
        }

        init() {
            this.createScene();
            this.createCamera();
            this.createRenderer();
            this.createLights();
            this.createParticleSystems();
            this.createUniverseSpheres();
            this.createBlackHole();
            this.createThornRing();

            this.container.appendChild(this.renderer.domElement);

            this.animate();
            this.initEventListeners();
        }

        createScene() {
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.FogExp2(0x14151E, 0.0008);
        }

        createCamera() {
            const aspect = window.innerWidth / window.innerHeight;
            this.camera = new THREE.PerspectiveCamera(
                SCENE_CONFIG.camera.fov,
                aspect,
                SCENE_CONFIG.camera.near,
                SCENE_CONFIG.camera.far
            );
            this.camera.position.set(0, 0, 500);
        }

        createRenderer() {
            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance'
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.setClearColor(0x14151E, 1);
        }

        createLights() {
            const ambient = new THREE.AmbientLight(0x404040, 0.5);
            this.scene.add(ambient);

            const crimsonLight = new THREE.PointLight(0xFF0000, 1, 1000);
            crimsonLight.position.set(0, 0, 200);
            this.scene.add(crimsonLight);

            const rimLight = new THREE.DirectionalLight(0xDDD3E3, 0.3);
            rimLight.position.set(-100, 100, 100);
            this.scene.add(rimLight);
        }

        createParticleSystems() {
            if (!window.monosParticles) return;

            const { ParticleSystem, PARTICLE_CONFIG } = window.monosParticles;

            const starfield = new ParticleSystem(this.container, this.scene);
            starfield.init(PARTICLE_CONFIG.starfield);
            this.particleSystems.push(starfield);

            const crimsonDust = new ParticleSystem(this.container, this.scene);
            crimsonDust.init(PARTICLE_CONFIG.crimsonDust);
            crimsonDust.mesh.position.z = -100;
            this.particleSystems.push(crimsonDust);
        }

        createUniverseSpheres() {
            const count = 12;
            const radius = 200;
            const goldenRatio = (1 + Math.sqrt(5)) / 2;
            const angleIncrement = Math.PI * 2 * goldenRatio;

            const colors = [0xFF0000, 0x511720, 0x8B0000, 0xDDD3E3, 0xC81E1E];

            for (let i = 0; i < count; i++) {
                const sphereRadius = 12 + Math.random() * 20;
                const sphere = this.createWireframeSphere(sphereRadius, colors[i % colors.length]);

                // Fibonacci sphere distribution for even spacing
                const t = i / count;
                const inclination = Math.acos(1 - 2 * t);
                const azimuth = angleIncrement * i;

                const x = Math.sin(inclination) * Math.cos(azimuth) * radius;
                const y = Math.sin(inclination) * Math.sin(azimuth) * radius;
                const z = Math.cos(inclination) * radius;

                sphere.position.set(x, y, z - 100);

                sphere.userData = {
                    originalPosition: sphere.position.clone(),
                    mass: 0.5 + Math.random() * 1.5,
                    rotationSpeed: 0.001 + Math.random() * 0.002,
                    orbitSpeed: 0.0003 + Math.random() * 0.0008,
                    orbitRadius: Math.sqrt(x * x + y * y + z * z),
                    orbitAngle: Math.atan2(y, x),
                    inclination: inclination
                };

                this.scene.add(sphere);
                this.universeSpheres.push(sphere);
            }
        }

        createWireframeSphere(radius, color) {
            const geometry = new THREE.IcosahedronGeometry(radius, 1);
            const material = new THREE.MeshBasicMaterial({
                color: color,
                wireframe: true,
                transparent: true,
                opacity: 0.7
            });

            const sphere = new THREE.Mesh(geometry, material);

            const ringGeometry = new THREE.RingGeometry(radius * 1.15, radius * 1.25, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xFF0000,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            sphere.add(ring);

            return sphere;
        }

        createBlackHole() {
            const horizonGeometry = new THREE.SphereGeometry(SCENE_CONFIG.blackHole.radius, 32, 32);
            const horizonMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    glowColor: { value: new THREE.Color(0xFF0000) },
                    coreColor: { value: new THREE.Color(0x000000) }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 glowColor;
                    uniform vec3 coreColor;
                    varying vec3 vNormal;
                    void main() {
                        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                        vec3 color = mix(coreColor, glowColor, intensity);
                        gl_FragColor = vec4(color, 1.0);
                    }
                `,
                side: THREE.BackSide
            });

            this.blackHole = new THREE.Mesh(horizonGeometry, horizonMaterial);
            this.blackHole.position.z = -300;
            this.scene.add(this.blackHole);

            this.createAccretionDisk();
        }

        createAccretionDisk() {
            const diskGroup = new THREE.Group();

            for (let i = 0; i < 3; i++) {
                const innerRadius = 60 + i * 20;
                const outerRadius = innerRadius + 15;

                const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
                const ringMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        time: { value: 0 },
                        color1: { value: new THREE.Color(0xFF0000) },
                        color2: { value: new THREE.Color(0x511720) }
                    },
                    vertexShader: `
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform float time;
                        uniform vec3 color1;
                        uniform vec3 color2;
                        varying vec2 vUv;
                        void main() {
                            float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
                            float dist = length(vUv - 0.5);
                            float blend = sin(angle * 3.0 + time * 2.0) * 0.5 + 0.5;
                            vec3 color = mix(color1, color2, blend);
                            float alpha = smoothstep(0.5, 0.3, dist);
                            gl_FragColor = vec4(color, alpha * 0.6);
                        }
                    `,
                    transparent: true,
                    side: THREE.DoubleSide,
                    blending: THREE.AdditiveBlending
                });

                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = Math.PI / 2.5;
                ring.rotation.z = i * 0.1;
                diskGroup.add(ring);
            }

            diskGroup.position.z = -300;
            this.accretionDisk = diskGroup;
            this.scene.add(diskGroup);
        }

        createThornRing() {
            const thornGroup = new THREE.Group();
            const thornCount = 24;
            const ringRadius = 100;

            for (let i = 0; i < thornCount; i++) {
                const thornGeometry = new THREE.ConeGeometry(3, 40, 4);
                const thornMaterial = new THREE.MeshBasicMaterial({
                    color: 0xFF0000,
                    transparent: true,
                    opacity: 0.8
                });

                const thorn = new THREE.Mesh(thornGeometry, thornMaterial);

                const angle = (i / thornCount) * Math.PI * 2;
                thorn.position.x = Math.cos(angle) * ringRadius;
                thorn.position.z = Math.sin(angle) * ringRadius;
                thorn.rotation.z = -angle + Math.PI / 2;

                thornGroup.add(thorn);
            }

            thornGroup.position.z = -300;
            this.thornRing = thornGroup;
            this.scene.add(thornGroup);
        }

        updateUniverseSpheres(time) {
            const collapseFactor = this.scrollProgress;
            const isScaffolding = this.passageMode === 2;
            const isConverging = this.passageMode === 3;

            this.universeSpheres.forEach((sphere) => {
                sphere.rotation.x += sphere.userData.rotationSpeed;
                sphere.rotation.y += sphere.userData.rotationSpeed * 0.7;

                sphere.userData.orbitAngle += sphere.userData.orbitSpeed;
                const angle = sphere.userData.orbitAngle;
                const radius = sphere.userData.orbitRadius;
                const originalPos = sphere.userData.originalPosition;

                // Scaffolding: particles reverse direction (outward flow)
                // Converging: collapse into center
                let expansionFactor = collapseFactor;
                if (isScaffolding) {
                    expansionFactor = 1 + (this.passageProgress - 0.45) / 0.20 * 0.4;
                }
                if (isConverging) {
                    expansionFactor = 1 - (this.passageProgress - 0.65) / 0.20 * 0.95;
                }

                const targetX = Math.cos(angle) * radius * (1 - expansionFactor * 0.9);
                const targetY = Math.sin(angle) * radius * (1 - expansionFactor * 0.9);
                const targetZ = originalPos.z + expansionFactor * 250;

                const lerpFactor = 0.05;
                sphere.position.x += (targetX - sphere.position.x) * lerpFactor;
                sphere.position.y += (targetY - sphere.position.y) * lerpFactor;
                sphere.position.z += (targetZ - sphere.position.z) * lerpFactor;

                const targetScale = 1 - Math.abs(expansionFactor) * 0.4;
                sphere.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);

                // Scaffolding: dim, wireframe-y look
                if (sphere.material) {
                    if (isScaffolding) {
                        sphere.material.opacity = 0.3;
                    } else if (isConverging) {
                        sphere.material.opacity = 0.6;
                    } else {
                        sphere.material.opacity = 0.7;
                    }
                }
            });
        }

        updateBlackHole(time) {
            if (!this.blackHole) return;

            this.blackHole.material.uniforms.time.value = time;
            this.blackHole.rotation.y += SCENE_CONFIG.blackHole.rotationSpeed;

            // Glow intensifies with scroll, explodes during passage convergence
            let glowIntensity = 1 + this.scrollProgress * 1.5;
            if (this.passageMode === 3) {
                glowIntensity *= 1 + (this.passageProgress - 0.65) / 0.20 * 0.8;
            }
            this.blackHole.scale.set(glowIntensity, glowIntensity, glowIntensity);

            if (this.accretionDisk) {
                this.accretionDisk.rotation.z += 0.002;
                if (this.passageMode === 2) {
                    this.accretionDisk.rotation.z += 0.008;
                }
                this.accretionDisk.children.forEach(ring => {
                    ring.material.uniforms.time.value = time;
                    if (this.passageMode === 2) {
                        ring.material.uniforms.time.value = time * 2.5;
                    }
                });
            }

            if (this.thornRing) {
                this.thornRing.rotation.y -= 0.003;
                this.thornRing.rotation.x = this.scrollProgress * Math.PI;

                // During scaffolding, thorn ring becomes a "clockwork"
                if (this.passageMode === 2) {
                    this.thornRing.rotation.y -= 0.012;
                    this.thornRing.rotation.z += 0.004;
                }
                if (this.passageMode === 3) {
                    this.thornRing.rotation.x += 0.02;
                }
            }
        }

        updateCamera() {
            this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.05;

            const time = this.clock.getElapsedTime();

            // Mouse-driven depth parallax (igloo.inc signature)
            const targetX = this.mouseX * 35 + Math.sin(time * 0.1) * 6;
            const targetY = this.mouseY * 25 + Math.cos(time * 0.15) * 4;
            const lookOffsetX = this.mouseX * -15;
            const lookOffsetY = this.mouseY * -10;

            this.camera.position.x += (targetX - this.camera.position.x) * 0.04;
            this.camera.position.y += (targetY - this.camera.position.y) * 0.04;

            // Camera Z follows scroll, but DIVES into the black hole during passage
            let targetZ = SCENE_CONFIG.camera.position.z - this.scrollProgress * 300;
            if (this.passageMode === 2) {
                // Scaffolding: camera is at the black hole, slightly past
                targetZ = -150;
            }
            if (this.passageMode === 3) {
                // Converging: camera dives into the point
                const diveProgress = (this.passageProgress - 0.65) / 0.20;
                targetZ = -150 - diveProgress * 200;
            }
            if (this.passageMode === 0 && this.passageProgress > 0.85) {
                // Emerge: camera retreats back to normal
                const emergeProgress = (this.passageProgress - 0.85) / 0.15;
                const normalZ = SCENE_CONFIG.camera.position.z - this.scrollProgress * 300;
                targetZ = -150 + (normalZ - (-150)) * emergeProgress;
            }

            this.camera.position.z += (targetZ - this.camera.position.z) * 0.05;

            this.camera.lookAt(lookOffsetX, lookOffsetY, -100);

            // FOV pulse during passage
            if (this.passageMode === 2) {
                this.camera.fov += (90 - this.camera.fov) * 0.05;
            } else {
                this.camera.fov += (60 - this.camera.fov) * 0.05;
            }
            this.camera.updateProjectionMatrix();
        }

        animate() {
            requestAnimationFrame(() => this.animate());

            const time = this.clock.getElapsedTime();

            this.particleSystems.forEach(system => system.update(time));
            this.updateUniverseSpheres(time);
            this.updateBlackHole(time);
            this.updateMouse();
            this.updateCamera();

            this.renderer.render(this.scene, this.camera);
        }

        resize() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);

            this.particleSystems.forEach(system => system.resize());
        }

        initEventListeners() {
            this.mouseX = 0;
            this.mouseY = 0;
            this.targetMouseX = 0;
            this.targetMouseY = 0;

            window.addEventListener('resize', () => this.resize());

            window.addEventListener('mousemove', (e) => {
                this.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
                this.targetMouseY = -((e.clientY / window.innerHeight) * 2 - 1);
            });

            window.addEventListener('scroll', () => {
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = window.scrollY / scrollHeight;
                this.updateScrollProgress(progress);
            });
        }

        updateMouse() {
            this.mouseX += (this.targetMouseX - this.mouseX) * 0.06;
            this.mouseY += (this.targetMouseY - this.mouseY) * 0.06;
        }

        updateScrollProgress(progress) {
            this.targetScrollProgress = progress;
        }

        setPassage(progress) {
            // progress 0..1 across the page
            this.passageProgress = progress;

            // Mode determination
            if (progress < 0.25) this.passageMode = 0;
            else if (progress < 0.45) this.passageMode = 1;
            else if (progress < 0.65) this.passageMode = 2;
            else if (progress < 0.85) this.passageMode = 3;
            else this.passageMode = 0;
        }

        dispose() {
            this.particleSystems.forEach(system => system.dispose());
            this.renderer.dispose();
            if (this.container) {
                this.container.removeChild(this.renderer.domElement);
            }
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.monosScene = new MonosScene();
        }, 500);
    });

})();
