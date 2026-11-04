import assert from 'node:assert/strict';
import { encounters,zones,normalizeAtlas,discoveryCount,unlocked,chooseEncounter,recordEncounter } from '../src/features/ocean/atlas-data.js';

assert.equal(encounters.length,12);
assert.equal(new Set(encounters.map(item=>item.id)).size,12);
for(const zone of zones) assert.equal(encounters.filter(item=>item.zone===zone.id).length,4);
let state=normalizeAtlas({counts:{flying:-1,dolphin:'2',turtle:Infinity},misses:{surface:99,reef:-8}});
assert.equal(discoveryCount(state),0);
assert.equal(state.misses.surface,3);
assert.equal(state.misses.reef,0);
assert.equal(normalizeAtlas({counts:{flying:999999999}}).counts.flying,999999);
assert.equal(chooseEncounter(state,'deep',null),null);
assert.equal(chooseEncounter(state,'invalid',null),null);
assert.equal(recordEncounter(state,'angler'),state);
state=normalizeAtlas(null);
for(const item of encounters.filter(item=>item.zone==='surface').slice(0,3))state=recordEncounter(state,item.id);
assert.equal(discoveryCount(state),3);
assert.ok(unlocked(state,'reef'));
assert.ok(!unlocked(state,'deep'));
const original=structuredClone(state);
state=recordEncounter(state,'flying');
assert.deepEqual(original.counts.flying,1);
assert.equal(state.counts.flying,2);
assert.equal(discoveryCount(state),3);
state=recordEncounter(state,'dolphin');state=recordEncounter(state,'flying');
assert.equal(state.misses.surface,3);
assert.equal(chooseEncounter(state,'surface','flying',()=>0).id,'whale');
state=recordEncounter(state,'whale');
assert.equal(state.misses.surface,0);
for(const item of encounters.filter(item=>item.zone==='reef').slice(0,3))state=recordEncounter(state,item.id);
assert.equal(discoveryCount(state),7);
assert.ok(unlocked(state,'deep'));
for(const item of encounters)state=recordEncounter(state,item.id);
assert.equal(discoveryCount(state),12);
assert.deepEqual(normalizeAtlas(JSON.parse(JSON.stringify(state))),state);
for(const region of zones) {
  const first=encounters.find(item=>item.zone===region.id);
  assert.notEqual(chooseEncounter(state,region.id,first.id,()=>0).id,first.id);
}
// A deliberately repetitive random source must still let a visitor finish.
let simulation=normalizeAtlas(null), previous=null;
for(let turn=0;turn<100&&discoveryCount(simulation)<12;turn++) {
  const zone=zones.find(region=>unlocked(simulation,region.id)&&encounters.some(item=>item.zone===region.id&&!simulation.counts[item.id]));
  const selected=chooseEncounter(simulation,zone.id,previous,()=>0);
  previous=selected.id;simulation=recordEncounter(simulation,selected.id);
}
assert.equal(discoveryCount(simulation),12);
console.log('通過：12 種事件、3／7 解鎖、重複保底、不連續重複、損毀存檔、次數上限與全收集可達性。');
