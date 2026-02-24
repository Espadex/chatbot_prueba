import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked, Tokens } from 'marked';
import hljs from 'highlight.js';

@Pipe({
    name: 'markdown',
    standalone: true
})
export class MarkdownPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) { }

    transform(value: string | undefined): SafeHtml {
        if (!value) return '';

        // Convert markdown to HTML logic
        // Add target="_blank" to links so they open in a new tab
        const renderer = new marked.Renderer();
        renderer.link = (tokens: Tokens.Link) => {
            return `<a target="_blank" href="${tokens.href}" style="color: #60a5fa; text-decoration: underline;">${tokens.text}</a>`;
        };

        // Make sure images resize properly in the chat bubble
        renderer.image = (tokens: Tokens.Image) => {
            return `<img src="${tokens.href}" alt="${tokens.text}" style="max-width: 100%; border-radius: 8px; margin: 0.5rem 0;" />`;
        };

        // Use highlight.js to colorize code blocks
        renderer.code = (tokens: Tokens.Code) => {
            const lang = tokens.lang || 'code';
            const code = tokens.text;

            // Highlight logic
            let highlightedCode = code;
            if (tokens.lang && hljs.getLanguage(tokens.lang)) {
                try {
                    highlightedCode = hljs.highlight(code, { language: tokens.lang }).value;
                } catch (__) { }
            }

            // Encode the raw text to safely place it inside a data attribute
            const encodedCode = encodeURIComponent(code);

            // Structure with header & copy button
            return `
            <div class="code-wrapper" style="margin: 0.8rem 0; background: #0d1117; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 1rem; background: #161b22; color: #8b949e; font-size: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="font-family: monospace; text-transform: uppercase;">${lang}</span>
                    <button class="copy-btn" data-code="${encodedCode}" style="background: none; border: none; color: #8b949e; cursor: pointer; display: flex; align-items: center; gap: 0.3rem; font-size: 0.75rem;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Copy
                    </button>
                </div>
                <pre style="margin: 0; padding: 1rem; overflow-x: auto;"><code class="hljs language-${lang}">${highlightedCode}</code></pre>
            </div>`;
        };

        marked.setOptions({ renderer: renderer, breaks: true });

        const html = marked.parse(value) as string;

        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
