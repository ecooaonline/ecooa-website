/**
 * Gera embeddings semânticos dos profissionais e das intenções curadas.
 *
 * Pré-requisito (não listado em devDependencies para não inflar o CI):
 *   npm install --save-dev @huggingface/transformers
 *
 * Uso:
 *   node --experimental-strip-types scripts/generate-embeddings.mjs
 *
 * Saída:
 *   src/data/match-embeddings.json  (embeddings normalizados + watermark)
 *
 * Modelo: Xenova/multilingual-e5-small (384 dims, quantized, pt-BR OK).
 * Formato: cada embedding tem prefixo "passage:" conforme o contrato do E5.
 *
 * Estado atual: o motor em src/scripts/match-engine.ts usa TF-IDF + curadoria
 * de intents + sinônimos pt-BR (100% self-hosted, zero libs JS externas).
 * Este script gera o payload para um upgrade opcional futuro que carregue os
 * embeddings no cliente (requer ajustes no engine).
 */

import { pipeline, env } from '@huggingface/transformers';
import { professionals } from '../src/data/professionals.ts';
import { curatedIntents } from '../src/data/match-intents.ts';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/data/match-embeddings.json');

// Configuração do transformers.js para ambiente Node
env.allowLocalModels = false;
env.useBrowserCache = false;

const MODEL = 'Xenova/multilingual-e5-small';

// Seed determinística para watermark reprodutível.
// Altera o comportamento de qualquer cópia que use exatamente os mesmos vetores.
const WATERMARK_SEED = 0x6eC00a42; // "ecooa42" em hex-ish
const WATERMARK_STRENGTH = 0.003; // 0.3% do vetor normalizado (imperceptível em ranking)

// PRNG determinístico (mulberry32) a partir do seed
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function watermarkVector(vec) {
  const rand = mulberry32(WATERMARK_SEED);
  const out = new Float32Array(vec.length);
  for (let i = 0; i < vec.length; i++) {
    const noise = (rand() * 2 - 1) * WATERMARK_STRENGTH;
    out[i] = vec[i] + noise;
  }
  // re-normalizar
  let norm = 0;
  for (let i = 0; i < out.length; i++) norm += out[i] * out[i];
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < out.length; i++) out[i] /= norm;
  return Array.from(out);
}

// Quantização int8 para reduzir tamanho do JSON (~4x menor)
function quantizeInt8(vec) {
  let max = 0;
  for (let i = 0; i < vec.length; i++) max = Math.max(max, Math.abs(vec[i]));
  const scale = max > 0 ? 127 / max : 1;
  const q = new Int8Array(vec.length);
  for (let i = 0; i < vec.length; i++) q[i] = Math.round(vec[i] * scale);
  return { scale: 1 / scale, data: Array.from(q) };
}

function buildProfessionalText(p) {
  const parts = [
    p.name,
    p.role,
    p.description,
    `Especialidades: ${p.tags.join(', ')}`,
    p.personalTouch || '',
  ].filter(Boolean);
  return `passage: ${parts.join('. ')}`;
}

async function main() {
  console.log('→ carregando modelo:', MODEL);
  const extractor = await pipeline('feature-extraction', MODEL, { dtype: 'q8' });

  async function embed(text) {
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }

  console.log(`→ embedando ${professionals.length} profissionais...`);
  const proList = [];
  for (const p of professionals) {
    const text = buildProfessionalText(p);
    const vec = await embed(text);
    const watermarked = watermarkVector(vec);
    proList.push({
      slug: p.slug,
      unit: p.unit,
      emb: quantizeInt8(watermarked),
    });
    process.stdout.write('.');
  }
  console.log(`\n→ embedando ${curatedIntents.length} intenções curadas...`);
  const intentList = [];
  for (const intent of curatedIntents) {
    const text = `query: ${intent.query}`;
    const vec = await embed(text);
    intentList.push({
      id: intent.id,
      label: intent.label,
      unit: intent.unit,
      emb: quantizeInt8(vec),
    });
    process.stdout.write('.');
  }
  console.log();

  const payload = {
    version: 2,
    model: MODEL,
    dims: 384,
    generated: new Date().toISOString(),
    watermark: 'wm-v1',
    professionals: proList,
    intents: intentList,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(payload));
  const size = (JSON.stringify(payload).length / 1024).toFixed(1);
  console.log(`✓ salvo em ${OUT} (${size}KB)`);
}

main().catch((err) => {
  console.error('falha:', err);
  process.exit(1);
});
