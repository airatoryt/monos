/* MONOS - Blog List */
/* Loads and displays all posts */

(function() {
    'use strict';

    const POSTS = [
        {
            slug: '2026-06-06-weight-of-singularities',
            title: 'The Weight of Singularities',
            subtitle: 'On the impossibility of separation in a unified cosmos',
            date: '2026-06-06',
            tag: 'COSMOLOGY',
            excerpt: 'Every collapse is a homecoming. Every singularity remembers that it was never alone, for the One cannot be divided, only forgotten.',
            readTime: 6
        },
        {
            slug: '2026-06-05-illusion-is-the-one-dreaming',
            title: 'Illusion is the One Dreaming',
            subtitle: 'Why every dreamer is identical to every dream',
            date: '2026-06-05',
            tag: 'ILLUSION',
            excerpt: 'There is no difference between the dream and the dreamer, the illusion and the truth, the many and the One.',
            readTime: 5
        },
        {
            slug: '2026-06-04-on-being-and-becoming',
            title: 'On Being and Becoming',
            subtitle: 'The One does not change. The One appears to change. These are identical.',
            date: '2026-06-04',
            tag: 'PHILOSOPHY',
            excerpt: 'Change is real. Permanence is real. They are not opposites but the same substance viewed from within time and from outside of it.',
            readTime: 7
        },
        {
            slug: '2026-06-03-the-self-is-a-loan',
            title: 'The Self is a Loan',
            subtitle: 'Why the sense of "I" is the One\'s most generous fiction',
            date: '2026-06-03',
            tag: 'IDENTITY',
            excerpt: 'You are not a self. You are the One\'s way of looking at itself from a particular angle, and the angle is not less real than the looking.',
            readTime: 6
        },
        {
            slug: '2026-06-02-the-crimson-thread',
            title: 'The Crimson Thread',
            subtitle: 'Why destruction and creation are the same gesture',
            date: '2026-06-02',
            tag: 'EXISTENCE',
            excerpt: 'The crimson thread that runs through all things is the One\'s signature — the mark of its presence in every atom, every moment.',
            readTime: 5
        },
        {
            slug: '2026-06-01-the-void-that-speaks',
            title: 'The Void That Speaks',
            subtitle: 'On the silence from which all words emerge',
            date: '2026-06-01',
            tag: 'VOID',
            excerpt: 'The void is not empty. The void is the pregnant silence from which all things emerge, and to which all things return.',
            readTime: 6
        }
    ];

    function renderPosts() {
        const grid = document.getElementById('blogGrid');
        if (!grid) return;

        const sortedPosts = [...POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));

        grid.innerHTML = sortedPosts.map(post => {
            const { formatDate } = window.monosMarkdown;
            return `
                <a href="./post.html?slug=${post.slug}" class="blog-card" data-aos="fade-up">
                    <div class="blog-card-image">
                        <img src="../assets/images/sigil-static.svg" class="blog-card-sigil" alt="">
                    </div>
                    <div class="blog-card-content">
                        <div class="blog-card-meta">
                            <span class="blog-card-date">${formatDate(post.date)}</span>
                            <span class="blog-card-tag">${post.tag}</span>
                        </div>
                        <h2 class="blog-card-title">${post.title}</h2>
                        <p class="blog-card-excerpt">${post.excerpt}</p>
                        <div class="blog-card-footer">
                            <span>${post.readTime} min read</span>
                            <span class="blog-card-read">READ →</span>
                        </div>
                    </div>
                </a>
            `;
        }).join('');
    }

    document.addEventListener('DOMContentLoaded', () => {
        window.monosState.initElements();
        renderPosts();
    });

})();
