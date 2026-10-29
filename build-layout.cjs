// No framework or dependencies: edit layout.json, then run node build-layout.cjs.
const fs=require('node:fs');const path=require('node:path');const root=__dirname;
const layout=JSON.parse(fs.readFileSync(path.join(root,'layout.json'),'utf8'));
for(const page of ['index','games','tools','about']){
 const file=path.join(root,page+'.html');let html=fs.readFileSync(file,'utf8');
 const nav=layout.nav.replace(`data-page="${page}"`,`data-page="${page}" aria-current="page"`);
 html=html.replace(/<nav\b[^>]*>.*?<\/nav>/s,nav).replace(/<footer>.*?<\/footer>/s,layout.footer);
 fs.writeFileSync(file,html);
}
