import initialState from './initialState';
import { reducer as test } from './test';
import { reducer as test1 } from './test1';
import { reducer as test3 } from './test3';
import { reducer as test5 } from './test5';
import { reducer as test6 } from './test6';
import { reducer as test11 } from './test11';
import { reducer as testa } from './testa';
import { reducer as testb } from './testb';
import { reducer as testc } from './testc';
import { reducer as testd } from './testd';
import { reducer as teste } from './teste';
import { reducer as testt } from './testt';
import { reducer as testcc } from './testcc';
import { reducer as testab } from './testab';
import { reducer as testabe } from './testabe';
import { reducer as test123 } from './test123';
import { reducer as testa333 } from './testa333';
import { reducer as test2Fe } from './test2Fe';
import { reducer as test23F } from './test23F';
import { reducer as test23 } from './test23';
import { reducer as testbc } from './testbc';
import { reducer as test555 } from './test555';

const reducers = [
  test,
  test1,
  test3,
  test5,
  test6,
  test11,
  testa,
  testb,
  testc,
  testd,
  teste,
  testt,
  testcc,
  testab,
  testabe,
  test123,
  testa333,
  test2Fe,
  test23F,
  test23,
  testbc,
  test555,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
