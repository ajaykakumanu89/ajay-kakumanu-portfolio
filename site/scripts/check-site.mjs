#!/usr/bin/env node

/** Validate the generated local portfolio without making any network requests. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const expectedPages = [
  'index.html',
  'about.html',
  'resume.html',
  'work/developer-api/index.html',
  'work/developer-api/api-reference.html',
  'work/documentation-validator/index.html',
  'work/ai-assisted-documentation/index.html',
];
const errors = [];
const documents = new Map();
let checkedReferences = 0;
let checkedFragments = 0;
let ignoredExternalReferences = 0;

const relativeName = (file) => path.relative(dist, file).split(path.sep).join('/');
const error = (file, message) => errors.push(`${relativeName(file)}: ${message}`);

function decodeEntities(value) {
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (match, entity) => {
    if (entity[0] !== '#') return named[entity.toLowerCase()] ?? match;
    const hexadecimal = entity[1]?.toLowerCase() === 'x';
    const point = Number.parseInt(entity.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : match;
  });
}

function attributes(source) {
  const result = new Map();
  const pattern = /([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  for (const match of source.matchAll(pattern)) {
    result.set(match[1].toLowerCase(), decodeEntities(match[2] ?? match[3] ?? match[4] ?? ''));
  }
  return result;
}

function withoutNonContent(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
}

async function collectHtml(folder) {
  const entries = await fs.readdir(folder, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtml(file));
    else if (entry.isFile() && /\.html?$/i.test(entry.name)) files.push(file);
  }
  return files.sort();
}

function inspectDocument(file, html) {
  const content = withoutNonContent(html);
  const ids = new Set();
  const references = [];
  const tags = [];
  for (const match of content.matchAll(/<([a-z][\w:-]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi)) {
    const name = match[1].toLowerCase();
    const attrs = attributes(match[2]);
    tags.push({ name, attrs });
    if (attrs.has('id')) {
      const id = attrs.get('id');
      if (!id.trim()) error(file, 'An element has an empty id.');
      else if (ids.has(id)) error(file, `Duplicate id "${id}".`);
      ids.add(id);
    }
    for (const attribute of ['href', 'src']) {
      if (attrs.has(attribute)) references.push({ attribute, value: attrs.get(attribute) });
    }
  }

  const title = content.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i)?.[1];
  if (!title || !decodeEntities(title.replace(/<[^>]*>/g, '')).trim()) {
    error(file, 'Missing or empty <title>.');
  }
  const viewport = tags.find(({ name, attrs }) => name === 'meta' && attrs.get('name')?.toLowerCase() === 'viewport');
  if (!viewport || !/\bwidth\s*=\s*device-width\b/i.test(viewport.attrs.get('content') ?? '')) {
    error(file, 'Missing responsive viewport (width=device-width).');
  }
  for (const landmark of ['main', 'nav', 'footer']) {
    if (!tags.some(({ name }) => name === landmark)) error(file, `Missing <${landmark}> landmark.`);
  }
  if (!tags.some(({ name }) => name === 'h1')) error(file, 'Missing <h1> heading.');

  const visibleText = decodeEntities(content.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ');
  const excludedTerms = [
    [/\bzebu\b/i, 'Historical employer product name "ZeBu"'],
    [/\btransactors\b/i, 'Historical employer product name "transactors"'],
    [/confidential\s*[-–—]\s*internal/i, 'Confidential – Internal marking'],
    [/\bdocfusion\b/i, 'Unapproved DocFusion material'],
    [/\blorem\s+ipsum\b/i, 'Placeholder lorem ipsum text'],
  ];
  for (const [pattern, label] of excludedTerms) {
    if (pattern.test(visibleText)) error(file, `${label} appears in visible content.`);
  }
  if (/\{\{\s*[^{}]+\s*\}\}/.test(content)) error(file, 'Unresolved {{template token}}.');
  return { ids, references };
}

function isOutsideDist(file) {
  const relative = path.relative(dist, file);
  return relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative);
}

async function checkReference(source, { attribute, value }) {
  const reference = value.trim();
  if (!reference || reference.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(reference)) {
    if (reference) ignoredExternalReferences++;
    return;
  }

  let targetUrl;
  try {
    // Root-relative site links resolve within dist, not at the host filesystem root.
    const base = reference.startsWith('/') ? pathToFileURL(path.join(dist, 'index.html')) : pathToFileURL(source);
    targetUrl = new URL(reference.startsWith('/') ? reference.slice(1) : reference, base);
  } catch {
    error(source, `Invalid ${attribute} "${reference}".`);
    return;
  }

  let target;
  try {
    target = fileURLToPath(targetUrl);
  } catch {
    error(source, `Invalid local ${attribute} "${reference}".`);
    return;
  }
  if (isOutsideDist(target)) {
    error(source, `${attribute} "${reference}" points outside site/dist.`);
    return;
  }

  checkedReferences++;
  try {
    const stat = await fs.stat(target);
    if (stat.isDirectory()) target = path.join(target, 'index.html');
    if (!(await fs.stat(target)).isFile()) throw new Error('Not a file');
  } catch {
    error(source, `Broken ${attribute} "${reference}" (expected ${relativeName(target)}).`);
    return;
  }

  // HTML fragments are checked; SVG fragments may refer to symbols rather than HTML ids.
  if (targetUrl.hash && /\.html?$/i.test(target)) {
    let fragment;
    try {
      fragment = decodeURIComponent(targetUrl.hash.slice(1));
    } catch {
      error(source, `Invalid fragment encoding in "${reference}".`);
      return;
    }
    // Text-fragment directives are browser features, not element IDs.
    fragment = fragment.split(':~:text=')[0];
    if (fragment) {
      checkedFragments++;
      if (!documents.get(target)?.ids.has(fragment)) {
        error(source, `Broken fragment "${reference}" (no id "${fragment}" in ${relativeName(target)}).`);
      }
    }
  }
}

async function main() {
  let files;
  try {
    files = await collectHtml(dist);
  } catch (cause) {
    console.error(`Cannot read generated site at ${dist}\nBuild the site before running this check.\n${cause.message}`);
    process.exitCode = 1;
    return;
  }

  for (const expected of expectedPages) {
    const file = path.join(dist, ...expected.split('/'));
    if (!files.includes(file)) error(file, 'Required generated page is missing.');
  }
  for (const file of files) documents.set(file, inspectDocument(file, await fs.readFile(file, 'utf8')));
  for (const [file, document] of documents) {
    for (const reference of document.references) await checkReference(file, reference);
  }

  if (errors.length) {
    console.error(`Site validation failed (${errors.length} ${errors.length === 1 ? 'issue' : 'issues'}):`);
    for (const item of errors) console.error(`- ${item}`);
    process.exitCode = 1;
  } else {
    console.log('Site validation passed.');
  }
  console.log(`Checked ${files.length} HTML pages, ${checkedReferences} local file references, and ${checkedFragments} HTML fragments.`);
  console.log(`Ignored ${ignoredExternalReferences} external/protocol references; no network requests were made.`);
}

await main();
