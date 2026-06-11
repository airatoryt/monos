import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMonosDate(date: Date | string): string {
  const d = new Date(date);
  const months = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const day = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} . ${month} . ${year}`;
}

export function renderMarkdown(md: string): string {
  if (!md) return '';

  let html = md
    // Escape HTML tags
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Restore code block tags
    .replace(/&lt;\/?code&gt;/g, (m) => m === '&lt;code&gt;' ? '<code>' : '</code>')
    .replace(/&lt;\/?pre&gt;/g, (m) => m === '&lt;pre&gt;' ? '<pre>' : '</pre>')
    .replace(/&lt;\/?h(\d)&gt;/g, (_, d) => {
      const tag = ['h1','h2','h3','h4','h5','h6'][parseInt(d)-1] || 'p';
      return `<${tag}>`;
    })
    // Actually, let's just parse markdown syntax directly
    ;

  // Reset - raw markdown parsing
  html = md;

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');

  // Unordered lists
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Numbered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, (match) => {
    if (!match.startsWith('<ul>')) return '<ol>' + match + '</ol>';
    return match;
  });

  // Paragraphs
  html = html.split(/\n\n+/).map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (trimmed.match(/^<(h\d|ul|ol|li|blockquote|pre|hr|p)/)) return trimmed;
    return '<p>' + trimmed.replace(/\n/g, '<br>') + '</p>';
  }).join('\n');

  return html;
}
