const escape = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;')
  .replaceAll('>','&gt;').replaceAll('"','&quot;');
const text = value => value.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim()
  .replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>');

// The journal page is the only content source; homepage previews follow its order.
export function journalPreview(html) {
  const entries = [...html.matchAll(/<article\b[^>]*class="journal-entry"[^>]*id="([a-z][a-z0-9-]*)"[^>]*>([\s\S]*?)<\/article>/g)]
    .slice(0,3).map(([,id,body])=>{
      const title=body.match(/<h2>([\s\S]*?)<\/h2>/)?.[1];
      const date=body.match(/<time datetime="([0-9-]+)">([\s\S]*?)<\/time\s*>/);
      const tag=body.match(/<span class="journal-tag">([\s\S]*?)<\/span>/)?.[1]||'航行日誌';
      const summary=body.match(/<p>([\s\S]*?)<\/p>/)?.[1]||'';
      if(!title||!date)throw Error('日誌缺少標題或日期：'+id);
      return `<a class="log-preview" href="journal.html#${id}"><div class="log-meta"><time datetime="${date[1]}">${escape(text(date[2]))}</time><span>${escape(text(tag))}</span></div><h3>${escape(text(title))}</h3><p>${escape(text(summary))}</p><div class="log-route" aria-hidden="true"><svg viewBox="0 0 240 30" preserveAspectRatio="none"><path d="M3 22 Q55 22 75 12 T145 16 T237 5"/><circle cx="3" cy="22" r="3"/><circle cx="237" cy="5" r="3"/></svg></div><span class="log-read">閱讀紀錄 <span aria-hidden="true">↗</span></span></a>`;
    });
  return `<section class="journal-home" aria-labelledby="journal-home-title"><div class="journal-home-heading"><div><span class="eyebrow">航行日誌</span><h2 id="journal-home-title">沿著航線，看看最近的發現。</h2><p>記下做過的嘗試，也留下選擇背後的理由。</p></div><a href="journal.html">所有日誌 <span aria-hidden="true">↗</span></a></div><div class="journal-preview-grid">${entries.join('')}</div></section>`;
}
