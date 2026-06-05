/* MONOS - Three.js Scene */
/* 3D universe, black hole, and geometric elements */

(function() {
    'use strict';
    
    // ========== SCENE CONFIGURATION ==========
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
        universe: {
            count: window.innerWidth < 768 ? 5 : 10,
            radius: 200,
            colors: [0xFF0000, 0x511720, 0x8B0000, 0xDDD3E3]
        },
        blackHole: {
            radius: 50,
            rotationSpeed: 0.001,
            glowIntensity: 1.5
        }
    };
    
    // ========== MAIN SCENE CLASS ==========
    class MonosScene {
        constructor() {
            this.container = document.getElementById('canvasContainer');
            this.scene = null;
            this.camera = null;
            this.renderer = null;
            this.clock = new THREE.Clock();
            
            this.particleSystems = [];
            this.universeSpheres = [];
            this.blackHole = null;
            this.thornRing = null;
            
            this.scrollProgress = 0;
            this.targetScrollProgress = 0;
            
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
            this.camera.position.set(
                SCENE_CONFIG.camera.position.x,
                SCENE_CONFIG.camera.position.y,
                SCENE_CONFIG.camera.position.z
            );
        }
        
        createRenderer() {
            this.renderer = new THREE.WebGLRenderer({
                antialias: SCENE_CONFIG.renderer.antialias,
                alpha: SCENE_CONFIG.renderer.alpha,
                powerPreference: SCENE_CONFIG.renderer.powerPreference
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.setClearColor(0x14151E, 1);
        }
        
        createLights() {
            // Ambient light
            const ambient = new THREE.AmbientLight(0x404040, 0.5);
            this.scene.add(ambient);
            
            // Crimson point light
            const crimsonLight = new THREE.PointLight(0xFF0000, 1, 1000);
            crimsonLight.position.set(0, 0, 200);
            this.scene.add(crimsonLight);
            
            // Silver rim light
            const rimLight = new THREE.DirectionalLight(0xDDD3E3, 0.3);
            rimLight.position.set(-100, 100, 100);
            this.scene.add(rimLight);
        }
        
        createParticleSystems() {
            const { ParticleSystem, PARTICLE_CONFIG } = window.monosParticles;
            
            // Starfield
            const starfield = new ParticleSystem(this.container, this.scene);
            starfield.init(PARTICLE_CONFIG.starfield);
            this.particleSystems.push(starfield);
            
            // Crimson dust
            const crimsonDust = new ParticleSystem(this.container, this.scene);
            crimsonDust.init(PARTICLE_CONFIG.crimsonDust);
            crimsonDust.mesh.position.z = -100;
            this.particleSystems.push(crimsonDust);
        }
        
        createUniverseSpheres() {
            const { count, radius, colors } = SCENE_CONFIG.universe;
            
            for (let i = 0; i < count; i++) {
                const sphere = this.createWireframeSphere(
                    15 + Math.random() * 25,
                    colors[i % colors.length]
                );
                
                // Position in circular arrangement
                const angle = (i / count) * Math.PI * 2;
                const distance = 100 + Math.random() * 100;
                sphere.position.x = Math.cos(angle) * distance;
                sphere.position.y = (Math.random() - 0.5) * 200;
                sphere.position.z = -50 - Math.random() * 200;
                
                sphere.userData = {
                    originalPosition: sphere.position.clone(),
                    rotationSpeed: 0.001 + Math.random() * 0.002,
                    orbitSpeed: 0.0005 + Math.random() * 0.001,
                    orbitRadius: distance,
                    orbitAngle: angle
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
                opacity: 0.6
            });
            
            const sphere = new THREE.Mesh(geometry, material);
            
            // Add glow ring
            const ringGeometry = new THREE.RingGeometry(radius * 1.1, radius * 1.2, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xFF0000,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            sphere.add(ring);
            
            return sphere;
        }
        
        createBlackHole() {
            // Event horizon
            const horizonGeometry = new THREE.SphereGeometry(
                SCENE_CONFIG.blackHole.radius,
                32,
                32
            );
            const horizonMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    glowColor: { value: new THREE.Color(0xFF0000) },
                    coreColor: { value: new THREE.Color(0x000000) }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    varying vec3 vPosition;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 glowColor;
                    uniform vec3 coreColor;
                    varying vec3 vNormal;
                    varying vec3 vPosition;
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
            
            // Accretion disk
            this.createAccretionDisk();
        }
        
        createAccretionDisk() {
            const diskGroup = new THREE.Group();
            
            // Create multiple rings
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
            const thornCount = window.innerWidth < 768 ? 12 : 24;
            
            for (let i = 0; i < thornCount; i++) {
                const thornGeometry = new THREE.ConeGeometry(3, 40, 4);
                const thornMaterial = new THREE.MeshBasicMaterial({
                    color: 0xFF0000,
                    transparent: true,
                    opacity: 0.7
                });
                
                const thorn = new THREE.Mesh(thornGeometry, thornMaterial);
                
                // Position in ring
                const angle = (i / thornCount) * Math.PI * 2;
                const radius = 100;
                thorn.position.x = Math.cos(angle) * radius;
                thorn.position.z = Math.sin(angle) * radius;
                thorn.rotation.z = -angle + Math.PI / 2;
                
                thornGroup.add(thorn);
            }
            
            thornGroup.position.z = -300;
            this.thornRing = thornGroup;
            this.scene.add(thornGroup);
        }
        
        updateScrollProgress(progress) {
            this.targetScrollProgress = progress;
        }
        
        updateUniverseSpheres(time) {
            this.universeSpheres.forEach((sphere, i) => {
                // Rotate
                sphere.rotation.x += sphere.userData.rotationSpeed;
                sphere.rotation.y += sphere.userData.rotationSpeed * 0.7;
                
                // Orbit
                sphere.userData.orbitAngle += sphere.userData.orbitSpeed;
                const angle = sphere.userData.orbitAngle;
                const radius = sphere.userData.orbitRadius;
                
                // Collapse toward center based on scroll
                const collapseFactor = this.scrollProgress;
                const targetX = Math.cos(angle) * radius * (1 - collapseFactor);
                const targetY = sphere.position.y * (1 - collapseFactor);
                const targetZ = sphere.position.z + collapseFactor * 200;
                
                sphere.position.x += (targetX - sphere.position.x) * 0.02;
                sphere.position.y += (targetY - sphere.position.y) * 0.02;
                sphere.position.z += (targetZ - sphere.position.z) * 0.02;
                
                // Scale down during collapse
                const scale = 1 - collapseFactor * 0.5;
                sphere.scale.set(scale, scale, scale);
            });
        }
        
        updateBlackHole(time) {
            if (!this.blackHole) return;
            
            // Update shader
            this.blackHole.material.uniforms.time.value = time;
            
            // Rotate
            this.blackHole.rotation.y += SCENE_CONFIG.blackHole.rotationSpeed;
            
            // Pulse glow based on scroll
            const glowIntensity = 1 + this.scrollProgress * 2;
            this.blackHole.scale.set(glowIntensity, glowIntensity, glowIntensity);
            
            // Update accretion disk
            if (this.accretionDisk) {
                this.accretionDisk.rotation.z += 0.002;
                this.accretionDisk.children.forEach(ring => {
                    ring.material.uniforms.time.value = time;
                });
            }
            
            // Rotate thorn ring
            if (this.thornRing) {
                this.thornRing.rotation.y -= 0.003;
                this.thornRing.rotation.x = this.scrollProgress * Math.PI;
            }
        }
        
        updateCamera() {
            // Smooth scroll interpolation
            this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.05;
            
            // Move camera based on scroll
            const targetZ = SCENE_CONFIG.camera.position.z - this.scrollProgress * 300;
            this.camera.position.z += (targetZ - this.camera.position.z) * 0.05;
            
            // Subtle camera sway
            const time = this.clock.getElapsedTime();
            this.camera.position.x = Math.sin(time * 0.1) * 10;
            this.camera.position.y = Math.cos(time * 0.15) * 5;
            
            // Look at center
            this.camera.lookAt(0, 0, -100);
        }
        
        animate() {
            requestAnimationFrame(() => this.animate());
            
            const time = this.clock.getElapsedTime();
            
            // Update particle systems
            this.particleSystems.forEach(system => system.update(time));
            
            // Update 3D objects
            this.updateUniverseSpheres(time);
            this.updateBlackHole(time);
            this.updateCamera();
            
            // Render
            this.renderer.render(this.scene, this.camera);
        }
        
        resize() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(width, height);
            
            // Resize particle systems
            this.particleSystems.forEach(system => system.resize());
        }
        
        initEventListeners() {
            window.addEventListener('resize', () => this.resize());
            
            // Scroll listener
            window.addEventListener('scroll', () => {
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = window.scrollY / scrollHeight;
                this.updateScrollProgress(progress);
            });
        }
        
        dispose() {
            this.particleSystems.forEach(system => system.dispose());
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
    }
    
    // ========== INITIALIZATION ==========
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for loading screen
        setTimeout(() => {
            window.monosScene = new MonosScene();
        }, 500);
    });
})();
