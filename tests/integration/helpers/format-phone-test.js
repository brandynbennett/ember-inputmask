import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | format-phone', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders with default mask', async function(assert) {
    this.set('inputValue', '1234567890');

    await render(hbs`{{format-phone inputValue}}`);

    assert.equal(this.element.textContent.trim(), '(123) 456-7890');
  });

  test('it renders with a specific mask', async function(assert) {
    this.set('inputValue', '1234567890');
    this.set('mask', '999-999-9999');

    await render(hbs`{{format-phone inputValue mask}}`);

    assert.equal(this.element.textContent.trim(), '123-456-7890');
  });
});
