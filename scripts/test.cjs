const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');fs.mkdirSync(path.join(root,'tests/screenshots'),{recursive:true});
for(const test of fs.readdirSync(path.join(root,'tests')).filter(f=>f.endsWith('-check.cjs')).sort()){
 console.log(`\nChecking ${test}`);const r=spawnSync(process.execPath,[path.join(root,'tests',test)],{cwd:root,stdio:'inherit',env:process.env});if(r.error){console.error(r.error.message);process.exit(1);}if(r.status!==0)process.exit(r.status||1);
}
console.log('\nAll Coffee Master checks passed.');
