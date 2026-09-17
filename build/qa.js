const fs=require('fs'),path=require('path');
const OUT=path.join(__dirname,'..','site');
let files=[];
(function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);
 if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))files.push(p);}})(OUT);

const issues=[];const pageSet=new Set();const domainPending=new Set();
files.forEach(f=>{const rel='/'+path.relative(OUT,f).replace(/index\.html$/,'').replace(/\\/g,'/');pageSet.add(rel);});

files.forEach(f=>{
  const rel=path.relative(OUT,f);const h=fs.readFileSync(f,'utf8');
  // placeholders
  ['[CONFIRM','[BUSINESS_','[PHONE_','[EMAIL_','TODO','FIXME','lorem','undefined','NaN'].forEach(t=>{
    if(h.includes(t)) issues.push(`${rel}: contains "${t}"`);
  });
  if(h.includes('example.com')) domainPending.add(rel);
  // one h1
  const h1=(h.match(/<h1[ >]/g)||[]).length;
  if(h1!==1) issues.push(`${rel}: ${h1} <h1> tags`);
  // title/desc/canonical
  if(!/<title>.+<\/title>/.test(h)) issues.push(`${rel}: no title`);
  const d=h.match(/name="description" content="([^"]*)"/);
  if(!d||d[1].length<70) issues.push(`${rel}: description missing/short`);
  if(d&&d[1].length>165) issues.push(`${rel}: description ${d[1].length} chars (long)`);
  if(!/rel="canonical"/.test(h)) issues.push(`${rel}: no canonical`);
  // json-ld parse
  const blocks=[...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  blocks.forEach((b,i)=>{try{JSON.parse(b[1]);}catch(e){issues.push(`${rel}: JSON-LD block ${i} invalid: ${e.message}`);}});
  if(!blocks.length && !rel.includes('404')) issues.push(`${rel}: no structured data`);
  // links and assets, resolved relative to this file on disk
  const dir=path.dirname(f);
  const check=(raw,kind)=>{
    if(!raw) return;
    if(/^(https?:|mailto:|tel:|#|data:)/.test(raw)) return;
    if(raw==='#') issues.push(`${rel}: href="#"`);
    const clean=raw.split('#')[0].split('?')[0];
    if(!clean) return;
    if(clean.startsWith('/')) issues.push(`${rel}: ${kind} still root-absolute "${clean}" (breaks file:// and sub-path hosting)`);
    const target=path.resolve(dir,clean);
    if(!fs.existsSync(target)) issues.push(`${rel}: broken ${kind} -> ${clean}`);
  };
  [...h.matchAll(/href="([^"]+)"/g)].forEach(m=>check(m[1],'link'));
  [...h.matchAll(/(?:^|\s)src="([^"]+)"/g)].forEach(m=>check(m[1],'src'));
  [...h.matchAll(/poster="([^"]+)"/g)].forEach(m=>check(m[1],'poster'));
  [...h.matchAll(/data-src="([^"]+)"/g)].forEach(m=>check(m[1],'video'));
  [...h.matchAll(/srcset="([^"]+)"/g)].forEach(m=>{
    m[1].split(',').forEach(part=>{const u=part.trim().split(/\s+/)[0]; check(u,'srcset');});
  });
  // imgs need alt
  [...h.matchAll(/<img [^>]*>/g)].forEach(t=>{if(!/alt=/.test(t[0]))issues.push(`${rel}: img without alt`);});
  // tag balance rough check
  ['section','div','main','footer','header','nav','a'].forEach(tag=>{
    const o=(h.match(new RegExp(`<${tag}[ >]`,'g'))||[]).length;
    const c=(h.match(new RegExp(`</${tag}>`,'g'))||[]).length;
    if(o!==c) issues.push(`${rel}: <${tag}> ${o} open / ${c} close`);
  });
});
console.log(`Checked ${files.length} pages.`);
if(domainPending.size)console.log(`NOTE: ${domainPending.size} pages still carry the placeholder domain (expected until SITE.origin is set).`);
if(!issues.length)console.log('No issues.');
else{const u=[...new Set(issues)];console.log(`${u.length} issues:`);u.forEach(i=>console.log('  - '+i));}
