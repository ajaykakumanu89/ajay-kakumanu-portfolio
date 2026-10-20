import { readFile, writeFile, mkdir, cp, readdir, lstat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repository = path.resolve(site, '..');
const output = path.join(site, 'dist');
const github = 'https://github.com/ajaykakumanu89/ajay-kakumanu-portfolio';
const moduleFlag = process.argv.indexOf('--marked-module');
// A supplied module path supports the bundled local runtime without installing packages.
const { Marked, Renderer } = moduleFlag >= 0
  ? await import(pathToFileURL(path.resolve(process.argv[moduleFlag + 1])).href)
  : await import('marked');

const pages = [
  { source: 'ABOUT.md', file: 'about.html', title: 'About my approach', group: 'Background', description: 'How Ajay Kakumanu approaches developer documentation, validation automation, structured content, and source-grounded AI.', status: '' },
  { source: 'resume.md', file: 'resume.html', title: 'Experience & resume', group: 'Background', description: 'Ajay Kakumanu’s technical-writing experience, documentation engineering projects, skills, and education.', status: 'Professional summary from the public portfolio repository. This is an HTML resume, not a downloadable copy of the private source document.' },
  { source: 'samples/developer-api/README.md', file: 'work/developer-api/index.html', title: 'Task API quickstart', group: 'Writing samples', description: 'A task-based developer quickstart with prerequisites, tested PowerShell requests, expected results, and troubleshooting.', status: 'Independent synthetic demonstration. Initial code and documentation were AI-assisted; Ajay’s editorial review and revisions are pending. Not an employer deliverable.' },
  { source: 'samples/developer-api/api-reference.md', file: 'work/developer-api/api-reference.html', title: 'Task API reference', group: 'Writing samples', description: 'Request contracts, response examples, exact errors, and limitations for the local Task API demonstration.', status: 'Independent synthetic demonstration. Initial code and documentation were AI-assisted; Ajay’s editorial review and revisions are pending. Not an employer deliverable.' },
  { source: 'samples/documentation-validator/README.md', file: 'work/documentation-validator/index.html', title: 'Documentation validator', group: 'Writing samples', description: 'A documentation-automation career case study and a separate reproducible Python link-checking demonstration.', status: 'Original synthetic demonstration available. The professional case study is a draft; its evidence review is pending. The public demo does not implement the complete professional validation workflow.' },
  { source: 'samples/ai-assisted-documentation/README.md', file: 'work/ai-assisted-documentation/index.html', title: 'AI-assisted documentation', group: 'In progress', description: 'A transparent plan for an AI-assisted documentation case study, including source verification and authentic revision evidence.', status: 'Draft project brief only. The proposed guide, AI session, evaluation, and measured results are not completed artifacts.' },
];
const pageBySource = new Map(pages.map(page => [page.source, page]));

async function filesIn(directory, prefix = '') {
  let entries;
  try { entries = await readdir(directory, { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const files = [];
  for (const entry of entries) {
    if (entry.isSymbolicLink()) throw new Error(`Refusing symbolic link: ${path.join(directory, entry.name)}`);
    const name = prefix + entry.name;
    if (entry.isDirectory()) files.push(...await filesIn(path.join(directory, entry.name), name + '/'));
    else files.push(name);
  }
  return files;
}

function ownedOutputFile(filename) {
  if (typeof filename !== 'string' || path.isAbsolute(filename)) throw new Error('Invalid generated-file manifest.');
  const resolved = path.resolve(output, filename);
  if (!resolved.startsWith(output + path.sep)) throw new Error('Generated path leaves site/dist.');
  return resolved;
}

// Only prune files recorded by our previous successful build. Never recursively delete dist.
const manifestName = '.portfolio-build.json';
const home = (await readFile(path.join(site, 'templates', 'home.html'), 'utf8')).replaceAll('{{BASE}}', './');
const assetFiles = await filesIn(path.join(site, 'assets'));
const generatedFiles = [...pages.map(page => page.file), 'index.html', '.nojekyll', ...assetFiles.map(file => `assets/${file}`)];
try { if ((await lstat(output)).isSymbolicLink()) throw new Error('site/dist must not be a symbolic link.'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
let previousFiles = [];
try { previousFiles = JSON.parse(await readFile(path.join(output, manifestName), 'utf8')).files; }
catch (error) { if (error.code !== 'ENOENT') throw error; }
if (!Array.isArray(previousFiles)) throw new Error('Invalid generated-file manifest.');
previousFiles.forEach(ownedOutputFile);
for (const file of await filesIn(output)) {
  if (file !== manifestName && !previousFiles.includes(file)) {
    throw new Error(`Unrecognized file in generated output: ${file}. Move it out of site/dist before building.`);
  }
}
await mkdir(output, { recursive: true });
await writeFile(path.join(output, manifestName), JSON.stringify({ files: [...new Set([...previousFiles, ...generatedFiles])] }, null, 2) + '\n');

function escape(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function plain(value) {
  return value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function relative(from, to) {
  const result = path.posix.relative(path.posix.dirname(from), to);
  return result || './';
}

function localLink(href, page) {
  if (/^(https?:|mailto:|tel:)/i.test(href) || href.startsWith('#')) return href;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) return '#content';
  const [location, fragment = ''] = href.split('#');
  const [filename, query = ''] = location.split('?');
  const source = path.posix.normalize(path.posix.join(path.posix.dirname(page.source), decodeURIComponent(filename)));
  const mapped = pageBySource.get(source);
  const target = mapped ? relative(page.file, mapped.file) : `${github}/blob/main/${source.split('/').map(encodeURIComponent).join('/')}`;
  return target + (query ? `?${query}` : '') + (fragment ? `#${fragment}` : '');
}

function navigation(base, active = '') {
  return `<a class="skip-link" href="#content">Skip to content</a>
  <header class="site-header"><a class="brand" href="${base}index.html" aria-label="Ajay Kakumanu, home"><span class="brand-mark">AK<span aria-hidden="true">.</span></span><span class="brand-name">Ajay Kakumanu<span>Technical writing &amp; DocOps</span></span></a>
  <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
  <nav id="site-nav" class="site-nav" aria-label="Main navigation"><div class="nav-links"><a href="${base}index.html#work">Selected work</a><a href="${base}about.html"${active === 'about.html' ? ' aria-current="page"' : ''}>About</a><a href="${base}resume.html"${active === 'resume.html' ? ' aria-current="page"' : ''}>Resume</a><a class="nav-contact" href="${base}index.html#contact">Get in touch <span aria-hidden="true">↗</span></a></div></nav></header>`;
}

function footer(base) {
  return `<footer class="site-footer"><a class="brand" href="${base}index.html">Ajay Kakumanu<span aria-hidden="true">.</span></a><p>Clear writing. Verified sources. Useful documentation.</p><a href="${github}">View the source on GitHub <span aria-hidden="true">↗</span></a></footer>`;
}

function sidebar(page, base) {
  return `<aside class="doc-sidebar" aria-label="Portfolio pages"><a class="back-link" href="${base}index.html#work">← Portfolio overview</a>${['Writing samples', 'In progress', 'Background'].map(group => `<div class="doc-nav-group"><p class="doc-kicker">${group}</p><nav aria-label="${group}">${pages.filter(item => item.group === group).map(item => `<a href="${relative(page.file, item.file)}"${item.file === page.file ? ' aria-current="page"' : ''}>${escape(item.title)}</a>`).join('')}</nav></div>`).join('')}</aside>`;
}

for (const page of pages) {
  const base = '../'.repeat(page.file.split('/').length - 1) || './';
  const headings = [];
  const used = new Map();
  const renderer = new Renderer();
  renderer.heading = function ({ tokens, depth }) {
    const html = this.parser.parseInline(tokens);
    let slug = plain(html).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
    const count = used.get(slug) || 0;
    used.set(slug, count + 1);
    if (count) slug += `-${count + 1}`;
    if (depth === 2) headings.push({ slug, text: plain(html) });
    return `<h${depth} id="${slug}">${html}<a class="heading-anchor" href="#${slug}" aria-label="Link to ${escape(plain(html))}">#</a></h${depth}>\n`;
  };
  renderer.link = function ({ href, title, tokens }) {
    const destination = localLink(href, page);
    const external = /^https?:/i.test(destination);
    return `<a href="${escape(destination)}"${title ? ` title="${escape(title)}"` : ''}${external ? ' rel="noopener noreferrer"' : ''}>${this.parser.parseInline(tokens)}</a>`;
  };
  // These source documents are trusted portfolio content, but raw HTML is displayed, not executed.
  renderer.html = ({ text }) => escape(text);
  renderer.image = ({ text }) => `<span class="image-description">${escape(text)}</span>`;
  renderer.table = function (token) {
    return `<div class="table-scroll" tabindex="0" role="region" aria-label="Scrollable table">${Renderer.prototype.table.call(this, token)}</div>`;
  };
  const parser = new Marked({ renderer, gfm: true, breaks: false });
  const markdown = (await readFile(path.join(repository, page.source), 'utf8')).replace(/^# [^\r\n]+\r?\n/, '');
  const content = parser.parse(markdown);
  const toc = headings.length ? `<aside class="doc-toc"><nav aria-label="On this page"><p class="doc-kicker">On this page</p>${headings.map(heading => `<a href="#${heading.slug}">${escape(heading.text)}</a>`).join('')}</nav></aside>` : '';
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${escape(page.description)}"><meta name="theme-color" content="#f6f3ed"><title>${escape(page.title)} — Ajay Kakumanu</title><link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${base}assets/styles.css"><script src="${base}assets/site.js" defer></script></head><body>${navigation(base, page.file)}
<div class="doc-layout">${sidebar(page, base)}<main id="content" class="doc-main"><header class="doc-header"><p class="doc-kicker">${escape(page.group)}</p><h1>${escape(page.title)}</h1><p class="doc-meta">${escape(page.description)}</p><a class="source-link" href="${github}/blob/main/${page.source}">View Markdown source ↗</a></header>${page.status ? `<div class="notice"><strong>Scope &amp; status</strong><p>${escape(page.status)}</p></div>` : ''}<article class="doc-prose">${content}</article></main>${toc}</div>${footer(base)}</body></html>`;
  const target = path.join(output, page.file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html);
}

await mkdir(output, { recursive: true });
await cp(path.join(site, 'assets'), path.join(output, 'assets'), { recursive: true });
await writeFile(path.join(output, 'index.html'), home);
await writeFile(path.join(output, '.nojekyll'), '');
for (const stale of previousFiles.filter(file => !generatedFiles.includes(file))) {
  try { await unlink(ownedOutputFile(stale)); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
await writeFile(path.join(output, manifestName), JSON.stringify({ files: generatedFiles }, null, 2) + '\n');
console.log(`Built ${pages.length + 1} static pages in ${output}`);
