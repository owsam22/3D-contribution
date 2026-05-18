import { useState } from 'react';

interface SharePanelProps {
  username: string;
  onClose: () => void;
}

export function SharePanel({ username, onClose }: SharePanelProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const baseUrl = window.location.origin + window.location.pathname;

  const shareUrl = `${baseUrl}?user=${username}`;
  const embedUrl = `${baseUrl}?user=${username}&embed=1`;

  const iframeEmbed = `<iframe
  src="${embedUrl}"
  width="100%"
  height="500"
  style="border:none;border-radius:12px;overflow:hidden;"
  title="${username}'s GitHub City"
  loading="lazy"
></iframe>`;

  const markdownEmbed = `## 🏙️ My GitHub City
> Built with [GitCity](${baseUrl})

<a href="${shareUrl}" target="_blank">
  <img src="https://img.shields.io/badge/View%20My-GitHub%20City-2ea44f?style=for-the-badge&logo=github" />
</a>`;

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0d1f12] border border-green-500/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl shadow-green-900/40">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            🔗 Share Your City
          </h2>
          <button
            onClick={onClose}
            className="text-green-400/60 hover:text-green-300 text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Direct Link */}
          <div>
            <label className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
              🌐 Direct Link
            </label>
            <div className="flex gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 bg-black/50 border border-green-500/20 rounded-lg text-green-300 text-xs font-mono"
              />
              <button
                onClick={() => copyToClipboard(shareUrl, 'link')}
                className="px-3 py-2 bg-green-700/50 hover:bg-green-600/50 border border-green-500/30 rounded-lg text-green-300 text-xs transition-colors whitespace-nowrap"
              >
                {copied === 'link' ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* iframe Embed */}
          <div>
            <label className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
              🖼️ Embed (iframe)
            </label>
            <div className="relative">
              <textarea
                readOnly
                value={iframeEmbed}
                rows={4}
                className="w-full px-3 py-2 bg-black/50 border border-green-500/20 rounded-lg text-green-300/80 text-xs font-mono resize-none"
              />
              <button
                onClick={() => copyToClipboard(iframeEmbed, 'iframe')}
                className="absolute top-2 right-2 px-2 py-1 bg-green-700/70 hover:bg-green-600/70 border border-green-500/30 rounded text-green-300 text-xs transition-colors"
              >
                {copied === 'iframe' ? '✓' : 'Copy'}
              </button>
            </div>
          </div>

          {/* GitHub README */}
          <div>
            <label className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
              📄 GitHub README Badge
            </label>
            <div className="relative">
              <textarea
                readOnly
                value={markdownEmbed}
                rows={4}
                className="w-full px-3 py-2 bg-black/50 border border-green-500/20 rounded-lg text-green-300/80 text-xs font-mono resize-none"
              />
              <button
                onClick={() => copyToClipboard(markdownEmbed, 'readme')}
                className="absolute top-2 right-2 px-2 py-1 bg-green-700/70 hover:bg-green-600/70 border border-green-500/30 rounded text-green-300 text-xs transition-colors"
              >
                {copied === 'readme' ? '✓' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-green-500/10 text-center text-green-400/40 text-xs">
          Share your contribution city with the world 🌍
        </div>
      </div>
    </div>
  );
}
