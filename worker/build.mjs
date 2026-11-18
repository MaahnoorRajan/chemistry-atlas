import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const read = file => readFile(new URL(file, import.meta.url), 'utf8');
const assets = {};
assets['/atom-logo.png'] = {
  type: 'image/png',
  base64: (await readFile(new URL('../dist/atom-logo.png', import.meta.url))).toString('base64')
};
for (const name of ['style.css', 'content.js', 'lesson-details.js', 'auth.js', 'classroom.js', 'atlas.js', 'app.js']) {
  assets['/' + name] = {
    type: name.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/javascript; charset=utf-8',
    body: await read('../dist/' + name)
  };
}
const page = await read('../dist/index.html');
const quizCatalog = runInNewContext(
  ['/content.js','/lesson-details.js','/atlas.js'].map(path => assets[path].body).join('\n') + `
  Object.fromEntries(atlasVideos.map(({id}) => {
    const keys = questionsFor(id,'en').map(question => question[2]);
    if (!keys.length || ['ky','ru'].some(lang => JSON.stringify(questionsFor(id,lang).map(question=>question[2])) !== JSON.stringify(keys))) {
      throw new Error('Missing or inconsistent quiz for ' + id);
    }
    return [id, { keys }];
  }));`
);
const worker = (await read('./classroom.mjs')) + (await read('./index.mjs'));
await mkdir(new URL('../dist/server/', import.meta.url), { recursive: true });
await mkdir(new URL('../dist/.openai/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/server/index.js', import.meta.url),
  'const page = ' + JSON.stringify(page) + ';\nconst assets = ' + JSON.stringify(assets) +
  ';\nconst quizCatalog = ' + JSON.stringify(quizCatalog) + ';\n' + worker);
await copyFile(new URL('../.openai/hosting.json', import.meta.url), new URL('../dist/.openai/hosting.json', import.meta.url));
