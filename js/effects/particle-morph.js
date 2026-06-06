/* MONOS - Particle Morph Footer */
/* Particles form shapes based on hovered link (igloo.inc inspired) */

(function() {
    'use strict';

    const SHAPES = {
        archives: () => {
            const points = [];
            const cols = 12, rows = 8;
            const w = 220, h = 100;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    points.push({
                        x: (c / (cols - 1) - 0.5) * w,
                        y: (r / (rows - 1) - 0.5) * h
                    });
                }
            }
            return points;
        },

        x: () => {
            const points = [];
            const size = 100;
            for (let i = 0; i < 200; i++) {
                const t = (i / 200) * size - size / 2;
                const offset = (Math.random() - 0.5) * 6;
                if (Math.random() < 0.5) {
                    points.push({ x: t + offset, y: t + offset });
                } else {
                    points.push({ x: t + offset, y: -t + offset });
                }
            }
            return points;
        },

        github: () => {
            const points = [];
            const cx = 0, cy = 0;
            const r1 = 80, r2 = 50;
            for (let i = 0; i < 250; i++) {
                const angle = (i / 250) * Math.PI * 2;
                const r = r1 + (Math.random() - 0.5) * 6;
                const x = cx + Math.cos(angle) * r * 0.9;
                const y = cy + Math.sin(angle) * r * 0.45;
                if (Math.abs(x) < r2 || Math.abs(y) < r2 * 0.4) {
                    points.push({ x, y });
                }
            }
            return points;
        },

        discord: () => {
            const points = [];
            const size = 90;
            for (let i = 0; i < 200; i++) {
                const t = (i / 200) * Math.PI * 2;
                const x = Math.cos(t) * size * 1.2;
                const y = Math.sin(t) * size * 0.7 - 10;
                points.push({ x: x + (Math.random() - 0.5) * 4, y: y + (Math.random() - 0.5) * 4 });
            }
            const eye1 = [], eye2 = [];
            for (let i = 0; i < 30; i++) {
                const a = (i / 30) * Math.PI * 2;
                eye1.push({ x: -30 + Math.cos(a) * 8, y: -10 + Math.sin(a) * 8 });
                eye2.push({ x: 30 + Math.cos(a) * 8, y: -10 + Math.sin(a) * 8 });
            }
            return [...points, ...eye1, ...eye2];
        }
    };

    class ParticleMorph {
        constructor() {
            this.container = document.getElementById('particleMorph');
            this.canvas = document.getElementById('morphCanvas');
            if (!this.container || !this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.targetPoints = [];
            this.currentPoints = [];
            this.particleCount = 0;
            this.activeShape = null;
            this.animating = false;

            this.init();
        }

        init() {
            this.resize();
            this.bindEvents();
            this.animate();
        }

        resize() {
            const rect = this.container.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio, 2);
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
            this.ctx.scale(dpr, dpr);
            this.width = rect.width;
            this.height = rect.height;
        }

        bindEvents() {
            window.addEventListener('resize', () => this.resize());

            const links = this.container.querySelectorAll('.morph-link');
            links.forEach(link => {
                link.addEventListener('mouseenter', () => {
                    const shape = link.dataset.shape;
                    if (SHAPES[shape]) this.setShape(shape);
                });
            });

            this.container.addEventListener('mouseleave', () => {
                this.setShape(null);
            });
        }

        setShape(shape) {
            if (shape === this.activeShape) return;
            this.activeShape = shape;

            if (!shape || !SHAPES[shape]) {
                this.spiralParticles();
                return;
            }

            const points = SHAPES[shape]();
            this.particleCount = points.length;

            if (this.particles.length < this.particleCount) {
                while (this.particles.length < this.particleCount) {
                    this.particles.push(this.createRandomParticle());
                }
            } else if (this.particles.length > this.particleCount) {
                this.particles.length = this.particleCount;
            }

            const cx = this.width / 2;
            const cy = this.height / 2;
            this.targetPoints = points.map(p => ({ x: cx + p.x, y: cy + p.y }));
        }

        createRandomParticle() {
            return {
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: 1 + Math.random() * 1.5,
                targetX: this.width / 2,
                targetY: this.height / 2
            };
        }

        spiralParticles() {
            const cx = this.width / 2;
            const cy = this.height / 2;
            const count = 200;
            for (let i = 0; i < count; i++) {
                if (!this.particles[i]) {
                    this.particles.push(this.createRandomParticle());
                }
                const angle = (i / count) * Math.PI * 8;
                const radius = 30 + (i / count) * 80;
                this.targetPoints[i] = {
                    x: cx + Math.cos(angle) * radius,
                    y: cy + Math.sin(angle) * radius
                };
            }
            this.particles.length = count;
        }

        animate() {
            this.animating = true;
            requestAnimationFrame(() => this.animate());

            this.ctx.clearRect(0, 0, this.width, this.height);

            this.particles.forEach((p, i) => {
                const target = this.targetPoints[i] || { x: this.width / 2, y: this.height / 2 };
                p.x += (target.x - p.x) * 0.08;
                p.y += (target.y - p.y) * 0.08;

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(255, 0, 50, 0.85)';
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = 'rgba(255, 0, 50, 0.6)';
                this.ctx.fill();
            });

            this.ctx.shadowBlur = 0;

            this.particles.forEach((p, i) => {
                const target = this.targetPoints[i] || { x: this.width / 2, y: this.height / 2 };
                for (let j = i + 1; j < Math.min(i + 6, this.particles.length); j++) {
                    const p2 = this.particles[j];
                    const t2 = this.targetPoints[j] || target;
                    const dx = (p2.x + t2.x - p.x - target.x);
                    const dy = (p2.y + t2.y - p.y - target.y);
                    if (Math.abs(dx) < 14 && Math.abs(dy) < 14) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = 'rgba(255, 0, 50, 0.15)';
                        this.ctx.lineWidth = 0.5;
                        this.ctx.stroke();
                    }
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const morph = new ParticleMorph();
            if (morph.animating) {
                setTimeout(() => morph.spiralParticles(), 100);
            }
        });
    } else {
        const morph = new ParticleMorph();
        if (morph.animating) {
            setTimeout(() => morph.spiralParticles(), 100);
        }
    }
})();
