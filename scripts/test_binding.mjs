import assert from 'node:assert';
import { isBindingExpression, normalizeBindingPath, resolveBinding, setBindingValue } from '../web/src/core/binding.js';
import { BindingError } from '../web/src/core/errors.js';

console.log('Testing binding engine...');

// 1. isBindingExpression
assert.strictEqual(isBindingExpression('{MS_USER.NAME}'), true);
assert.strictEqual(isBindingExpression('{/MS_USER/NAME}'), true);
assert.strictEqual(isBindingExpression('ms_user-name'), true);
assert.strictEqual(isBindingExpression('MS_USER/NAME'), true);
assert.strictEqual(isBindingExpression('ms_user.name'), true);
assert.strictEqual(isBindingExpression('Submit Form'), false);
assert.strictEqual(isBindingExpression(123), false);

// 2. normalizeBindingPath
assert.strictEqual(normalizeBindingPath('{MS_USER.NAME}'), 'MS_USER.NAME');
assert.strictEqual(normalizeBindingPath('{/MS_USER/NAME}'), 'MS_USER.NAME');
assert.strictEqual(normalizeBindingPath('ms_user-name'), 'ms_user.name');
assert.strictEqual(normalizeBindingPath('/MS_USER/NAME'), 'MS_USER.NAME');
assert.strictEqual(normalizeBindingPath('ms_user/name'), 'ms_user.name');

// 3. resolveBinding with case-insensitivity
const mockState = {
  MS_USER: {
    NAME: 'Furkan',
    EMAIL: 'furkan@example.com',
    PROFILE: {
      ROLE: 'Admin'
    }
  },
  MV_COUNTER: 42
};

const res1 = resolveBinding('{MS_USER.NAME}', mockState);
assert.strictEqual(res1.isBound, true);
assert.strictEqual(res1.value, 'Furkan');
assert.strictEqual(res1.error, null);

const res2 = resolveBinding('ms_user.name', mockState);
assert.strictEqual(res2.isBound, true);
assert.strictEqual(res2.value, 'Furkan');

const res3 = resolveBinding('ms_user-name', mockState);
assert.strictEqual(res3.isBound, true);
assert.strictEqual(res3.value, 'Furkan');

const res4 = resolveBinding('ms_user.profile.role', mockState);
assert.strictEqual(res4.isBound, true);
assert.strictEqual(res4.value, 'Admin');

const res5 = resolveBinding('{MV_COUNTER}', mockState);
assert.strictEqual(res5.isBound, true);
assert.strictEqual(res5.value, 42);

// 4. Zero fallback verification (missing path produces BindingError)
const errRes = resolveBinding('ms_user.non_existent', mockState);
assert.strictEqual(errRes.isBound, true);
assert.strictEqual(errRes.value, undefined);
assert(errRes.error instanceof BindingError);
assert.strictEqual(errRes.error.missingKey, 'non_existent');
assert.deepStrictEqual(errRes.error.availableKeys, ['NAME', 'EMAIL', 'PROFILE']);
assert(errRes.error.message.includes("missing property: 'non_existent'"));
assert(errRes.error.message.includes('Available properties in object'));
assert(errRes.error.message.includes('Troubleshooting & Usage Guide:'));

// 5. setBindingValue immutable updates
const nextState = setBindingValue(mockState, 'ms_user.name', 'New Name');
assert.strictEqual(nextState.MS_USER.NAME, 'New Name');
assert.strictEqual(mockState.MS_USER.NAME, 'Furkan');
assert.strictEqual(nextState.MS_USER.EMAIL, 'furkan@example.com');
assert.strictEqual(nextState.MV_COUNTER, 42);

console.log('✅ All binding engine tests passed successfully!');
