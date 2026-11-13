'use strict';
/** Maps scientific records to verified in-app links, never guessing a public domain. */
function buildLibraryLinks(records, {baseUrl, allowedIds}={}) {
  if (typeof baseUrl!=='string' || !baseUrl.trim()) throw new Error('library baseUrl must be configured');
  const url=new URL(baseUrl);
  if (!['https:','http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('invalid library baseUrl');
  const ids=new Set(allowedIds || records.map(r=>r.id));
  const links={};
  for (const record of records) {
    if (!record || !/^[a-z0-9_]+$/.test(record.id||'') || !ids.has(record.id)) continue;
    if (!Array.isArray(record.source_refs) || !record.source_refs.length || !record.title) continue;
    const destination=new URL(url.href);
    destination.pathname=url.pathname.replace(/\/$/,'')+'/'+encodeURIComponent(record.id);
    links[record.id]=destination.href;
  }
  return links;
}
module.exports={buildLibraryLinks};
