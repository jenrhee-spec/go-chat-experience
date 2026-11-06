import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {dirname} from 'node:path';
const paths=JSON.parse(await readFile(new URL('./asset-manifest.json',import.meta.url),'utf8'));
const base='https://go-chat-experience.vercel.app/';
let completed=0;
for(const path of paths){
  const response=await fetch(new URL(path.split('/').map(encodeURIComponent).join('/'),base));
  if(!response.ok)throw new Error(`${response.status} ${path}`);
  await mkdir(dirname(path),{recursive:true});
  await writeFile(path,Buffer.from(await response.arrayBuffer()));
  if(++completed%50===0)console.log(`Downloaded ${completed}/${paths.length} assets`);
}
console.log(`Downloaded ${completed} assets.`);
