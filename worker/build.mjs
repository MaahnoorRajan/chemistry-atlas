import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { createHash } from 'node:crypto';

const read = file => readFile(new URL(file, import.meta.url), 'utf8');
const assets = {};
assets['/atom-logo.png'] = {
  type: 'image/png',
  base64: (await readFile(new URL('../dist/atom-logo.png', import.meta.url))).toString('base64')
};
for (const name of ['style.css', 'content.js', 'lab-sheets.js', 'lesson-details.js', 'auth.js', 'classroom.js', 'atlas.js', 'dashboard.js', 'learning.js', 'app.js']) {
  assets['/' + name] = {
    type: name.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/javascript; charset=utf-8',
    body: await read('../dist/' + name)
  };
}
let page = await read('../dist/index.html');
for (const [path,asset] of Object.entries(assets)) {
  if (!path.endsWith('.js') && !path.endsWith('.css')) continue;
  const revision=createHash('sha256').update(asset.body).digest('hex').slice(0,12);
  page=page.replaceAll('".'+path+'"','".'+path+'?v='+revision+'"');
}
const durations = JSON.parse(await read('./video-durations.json'));
const quizCatalog = runInNewContext(
  ['/content.js','/lab-sheets.js','/lesson-details.js','/atlas.js'].map(path => assets[path].body).join('\n') + `
  Object.fromEntries(atlasVideos.map(({id}) => {
    const keys = questionsFor(id,'en').map(question => question[2]);
    if (keys.length !== 5 || ['ky','ru','en'].some(lang => {
      const sheet = labSheets[id]?.[lang];
      const questions = questionsFor(id,lang);
      return !sheet?.slice(0,4).every(value => value && value.trim()) ||
        sheet[2].split(' | ').length < 2 || !sheet[3].trim() ||
        questions.some(([title,options]) => !title || options.length !== 3 || options.some(option=>!option)) ||
        JSON.stringify(questions.map(question=>question[2])) !== JSON.stringify(keys);
    })) {
      throw new Error('Missing or inconsistent quiz for ' + id);
    }
    const sheet = labSheets[id].en;
    const readingKeys = sheet[3].split(' | ').flatMap((_,row)=>sheet[2].split(' | ').slice(1).map((_,col)=>row+'-'+col));
    return [id, { keys, readingKeys }];
  }));`
);
for (const [id,quiz] of Object.entries(quizCatalog)) {
  if (!Number.isInteger(durations[id])||durations[id]<1) throw new Error('Missing trusted video duration '+id);
  quiz.duration=durations[id];
}
const worker = (await read('./accounts.mjs')) + (await read('./learning.mjs')) + (await read('./classroom.mjs')) + (await read('./demo.mjs')) + (await read('./index.mjs'));
await mkdir(new URL('../dist/server/', import.meta.url), { recursive: true });
await mkdir(new URL('../dist/.openai/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/server/index.js', import.meta.url),
  'const page = ' + JSON.stringify(page) + ';\nconst assets = ' + JSON.stringify(assets) +
  ';\nconst quizCatalog = ' + JSON.stringify(quizCatalog) + ';\n' + worker);
await copyFile(new URL('../.openai/hosting.json', import.meta.url), new URL('../dist/.openai/hosting.json', import.meta.url));

