/* MONOS - Particle Systems */
/* Starfield, crimson dust, and cosmic particles */

(function() {
    'use strict';
    
    // ========== PARTICLE CONFIGURATION ==========
    const PARTICLE_CONFIG = {
        starfield: {
            count: 2000,
            size: { min: 0.5, max: 2 },
            speed: 0.0002,
            colors: [0xFFFFFF, 0xDDD3E3, 0xFF4444],
            opacity: { min: 0.3, max: 1 }
        },
        crimsonDust: {
            count: 300,
            size: { min: 1, max: 3 },
            speed: 0.0005,
            colors: [0xFF0000, 0x8B0000, 0x511720],
            opacity: { min: 0.4, max: 0.8 }
        },
        thornShards: {
            count: 50,
            size: { min: 2, max: 5 },
            speed: 0.0003,
            colors: [0xFF0000, 0xFF4444],
            opacity: { min: 0.6, max: 1 }
        },
        wingFragments: {
            count: 80,
            size: { min: 1, max: 4 },
            speed: 0.001,
            colors: [0xFF0000, 0x511720, 0xDDD3E3],
            opacity: { min: 0.5, max: 0.9 }
        }
    };
    
    // ========== PARTICLE CLASS ==========
    class Particle {
        constructor(config, bounds) {
            this.config = config;
            this.bounds = bounds;
            
            // Position
            this.x = (Math.random() - 0.5) * bounds.width;
            this.y = (Math.random() - 0.5) * bounds.height;
            this.z = (Math.random() - 0.5) * bounds.depth;
            
            // Velocity
            this.vx = (Math.random() - 0.5) * config.speed;
            this.vy = (Math.random() - 0.5) * config.speed;
            this.vz = (Math.random() - 0.5) * config.speed * 0.5;
            
            // Properties
            this.size = config.size.min + Math.random() * (config.size.max - config.size.min);
            this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
            this.opacity = config.opacity.min + Math.random() * (config.opacity.max - config.opacity.min);
            this.twinkleSpeed = 0.01 + Math.random() * 0.02;
            this.twinkleOffset = Math.random() * Math.PI * 2;
        }
        
        update(time) {
            // Update position
            this.x += this.vx;
            this.y += this.vy;
            this.z += this.vz;
            
            // Wrap around bounds
            if (this.x > this.bounds.width / 2) this.x = -this.bounds.width / 2;
            if (this.x < -this.bounds.width / 2) this.x = this.bounds.width / 2;
            if (this.y > this.bounds.height / 2) this.y = -this.bounds.height / 2;
            if (this.y < -this.bounds.height / 2) this.y = this.bounds.height / 2;
            if (this.z > this.bounds.depth / 2) this.z = -this.bounds.depth / 2;
            if (this.z < -this.bounds.depth / 2) this.z = this.bounds.depth / 2;
            
            // Twinkle effect
            this.currentOpacity = this.opacity * (0.7 + 0.3 * Math.sin(time * this.twinkleSpeed + this.twinkleOffset));
        }
    }
    
    // ========== PARTICLE SYSTEM ==========
    class ParticleSystem {
        constructor(container, scene) {
            this.container = container;
            this.scene = scene;
            this.particles = [];
            this.geometry = null;
            this.material = null;
            this.mesh = null;
            
            this.bounds = {
                width: window.innerWidth * 1.5,
                height: window.innerHeight * 1.5,
                depth: 1000
            };
        }
        
        init(config) {
            this.config = config;
            this.createParticles();
            this.createMesh();
        }
        
        createParticles() {
            this.particles = [];
            for (let i = 0; i < this.config.count; i++) {
                this.particles.push(new Particle(this.config, this.bounds));
            }
        }
        
        createMesh() {
            this.geometry = new THREE.BufferGeometry();
            
            const positions = new Float32Array(this.particles.length * 3);
            const colors = new Float32Array(this.particles.length * 3);
            const sizes = new Float32Array(this.particles.length);
            const opacities = new Float32Array(this.particles.length);
            
            this.particles.forEach((particle, i) => {
                positions[i * 3] = particle.x;
                positions[i * 3 + 1] = particle.y;
                positions[i * 3 + 2] = particle.z;
                
                const color = new THREE.Color(particle.color);
                colors[i * 3] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;
                
                sizes[i] = particle.size;
                opacities[i] = particle.opacity;
            });
            
            this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            this.geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
            
            this.material = new THREE.PointsMaterial({
                size: 1,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true
            });
            
            this.mesh = new THREE.Points(this.geometry, this.material);
            this.scene.add(this.mesh);
        }
        
        update(time) {
            const positions = this.geometry.attributes.position.array;
            const opacities = this.geometry.attributes.opacity ? this.geometry.attributes.opacity.array : null;
            
            this.particles.forEach((particle, i) => {
                particle.update(time);
                
                positions[i * 3] = particle.x;
                positions[i * 3 + 1] = particle.y;
                positions[i * 3 + 2] = particle.z;
                
                if (opacities) {
                    opacities[i] = particle.currentOpacity || particle.opacity;
                }
            });
            
            this.geometry.attributes.position.needsUpdate = true;
            if (this.geometry.attributes.opacity) {
                this.geometry.attributes.opacity.needsUpdate = true;
            }
        }
        
        resize() {
            this.bounds.width = window.innerWidth * 1.5;
            this.bounds.height = window.innerHeight * 1.5;
            this.createParticles();
        }
        
        dispose() {
            this.geometry.dispose();
            this.material.dispose();
            this.scene.remove(this.mesh);
        }
    }
    
    // ========== EXPORT ==========
    window.monosParticles = {
        ParticleSystem,
        PARTICLE_CONFIG
    };
})();
