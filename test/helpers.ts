import {assert} from 'chai';

export async function shouldThrow(fn: () => void) {
    try {
        await fn();
    } catch (error) {
        return;
    }
    assert.fail({}, {}, 'Should have reverted');
}