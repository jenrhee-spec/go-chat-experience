import {build} from 'esbuild';
import {createHash} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
await build({absWorkingDir:process.cwd(),entryPoints:['src/app.jsx'],bundle:true,minify:true,outdir:'.',entryNames:'app',assetNames:'assets/[name]-[hash]',loader:{'.png':'file','.woff2':'file','.otf':'file'},define:{'process.env.NODE_ENV':'"production"'},jsx:'automatic'});
const [html,js,css]=await Promise.all(['index.html','app.js','app.css'].map(file=>readFile(file)));
const version=createHash('sha256').update(js).update(css).digest('hex').slice(0,12);
await writeFile('index.html',html.toString().replace(/(app\.(?:js|css)\?v=)[^"']+/g,`$1${version}`));
console.log('Built Go chat prototype.');
