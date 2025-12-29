// Checks for duplicate entries in data/hsk1_words.json
// Duplicate criterion: same `hanzi`. Also reports duplicates by (hanzi,pinyin).

const fs = require('fs');
const path = require('path');

function main() {
  const file = path.join(__dirname, '..', 'data', 'hsk1_words.json');
  const raw = fs.readFileSync(file, 'utf8');
  const list = JSON.parse(raw);

  const byHanzi = new Map();
  const byPair = new Map(); // hanzi|pinyin key

  for (const it of list) {
    const hz = it.hanzi;
    const py = (it.pinyin || '').trim();
    const pairKey = `${hz}|${py}`;

    if (!byHanzi.has(hz)) byHanzi.set(hz, []);
    byHanzi.get(hz).push(it);

    if (!byPair.has(pairKey)) byPair.set(pairKey, []);
    byPair.get(pairKey).push(it);
  }

  const dupHanzi = [...byHanzi.entries()].filter(([, arr]) => arr.length > 1);
  const dupPairs = [...byPair.entries()].filter(([, arr]) => arr.length > 1);

  console.log(`Total items: ${list.length}`);
  console.log(`Duplicate hanzi groups: ${dupHanzi.length}`);
  console.log(`Duplicate (hanzi,pinyin) groups: ${dupPairs.length}`);

  if (dupHanzi.length > 0) {
    console.log('\nDuplicated hanzi:');
    for (const [hz, arr] of dupHanzi.slice(0, 50)) {
      const pinyins = arr.map(x => x.pinyin).join(', ');
      console.log(`- ${hz} (${arr.length}) -> pinyin: ${pinyins}`);
    }
    if (dupHanzi.length > 50) {
      console.log(`...and ${dupHanzi.length - 50} more hanzi groups.`);
    }
  }

  if (dupPairs.length > 0) {
    console.log('\nDuplicated (hanzi,pinyin):');
    for (const [key, arr] of dupPairs.slice(0, 50)) {
      const [hz, py] = key.split('|');
      console.log(`- ${hz} | ${py} (${arr.length})`);
    }
    if (dupPairs.length > 50) {
      console.log(`...and ${dupPairs.length - 50} more (hanzi,pinyin) groups.`);
    }
  }
}

if (require.main === module) {
  main();
}
