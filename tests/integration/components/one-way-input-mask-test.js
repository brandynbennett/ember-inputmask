import { module, test } from 'qunit';	
import { setupRenderingTest } from 'ember-qunit';	
import { fillIn, find, triggerKeyEvent, render } from '@ember/test-helpers';	
import hbs from 'htmlbars-inline-precompile';	

module('Integration | Component | one-way-input-mask', function(hooks) {	
  setupRenderingTest(hooks);	

  test('It masks a passed in value', async function(assert) {	
    this.set('value', 123)	
    await render(hbs`{{one-way-input-mask value mask='9-9+9'}}`);	
    assert.dom('input').hasValue('1-2+3');	
  });	

  test('The mask updates if the passed value is mutated in the parent', async function(assert) {	
    this.set('value', 123)	
    await render(hbs`{{one-way-input-mask value mask='9-9+9'}}`);	
    assert.dom('input').hasValue('1-2+3');	
    this.set('value', 456)	
    assert.dom('input').hasValue('4-5+6');	
  });	

  test('The parent can receive the updated value via the `update` action', async function(assert) {	
    this.set('value', 123)	
    await render(hbs`{{one-way-input-mask value mask='9-9+9' update=(action (mut value))}}`);	
    await fillIn('input', '456');	
    assert.equal(this.value, '456');	
  });	

  test('Update action works when `value` begins as undefined', async function(assert) {	
    await render(hbs`{{one-way-input-mask value mask='9-9+9' update=(action (mut value))}}`);	
    await fillIn('input', '456');	
    assert.equal(this.value, '456');	
  });	

  test('The parent can receive the masked value via the `update` action', async function(assert) {	
    this.set('update', (unmasked, masked) => {	
      this.set('masked', masked)	
    })	
    await render(hbs`{{one-way-input-mask value mask='9-9+9' update=update}}`);	
    await fillIn('input', '456');	
    assert.equal(this.masked, '4-5+6');	
  });	

  test('It can accept options', async function(assert) {	
    this.set('value', 1)	
    this.set('options', { placeholder: '*' });	
    await render(hbs`{{one-way-input-mask value mask='9-9+9' options=options}}`);	
    assert.dom('input').hasValue('1-*+*');	
  });	

  test('mask and options are not bound attributes', async function(assert) {	
    this.set('options', { placeholder: '*' });	
    await render(hbs`{{one-way-input-mask value mask='9-9+9' options=options}}`);	
    assert.notOk(find('input').getAttribute('mask'), 'mask is not bound');	
    assert.notOk(find('input').getAttribute('options'), 'options is not bound');	
  });	

  test('mask can dynamically be changed', async function(assert) {	
    this.set('mask', '9-9+9');	
    this.set('value', 123);	
    await render(hbs`{{one-way-input-mask value mask=mask}}`);	
    assert.dom('input').hasValue('1-2+3');	

    this.set('mask', '9_9_9');	
    assert.dom('input').hasValue('1_2_3');	
  });	

  test('options can dynamically be changed', async function(assert) {	
    this.set('value', 1)	
    this.set('options', { placeholder: '*' });	
    await render(hbs`{{one-way-input-mask value mask='9-9+9' options=options}}`);	
    assert.dom('input').hasValue('1-*+*');	

    this.set('options', { placeholder: '_' });	
    assert.dom('input').hasValue('1-_+_');	
  });	

  test('It can have classes', async function(assert) {	
    this.set('value', 123)	
    await render(hbs`{{one-way-input-mask value mask='9-9+9' class='foo'}}`);	
    assert.dom('.foo').hasValue('1-2+3');	
  });	

  test('It does not throw errors if key event methods are not passed in', async function(assert) {	
    this.set('value', 123)	
    await render(hbs`{{one-way-input-mask value mask='9-9+9'}}`);	
    await triggerKeyEvent('input', 'keyup', 13);	
    await triggerKeyEvent('input', 'keyup', 27);	
    assert.dom('input').hasValue('1-2+3', 'no errors thrown');	
  });	

  test('Shows the correct value in input if modified in `update` action', async function(assert) {	
    this.set('num', 15)	
    this.set('update', unmaskedValue => {	
      let number = parseInt(unmaskedValue, 10);	
      if (number > 15) {	
        this.set('num', '15');	
      } else {	
        this.set('num', number);	
      }	
    });	
    await render(hbs`{{one-way-input-mask num mask='999999' update=update	
      options=(hash	
        showMaskOnFocus=false	
        showMaskOnHover=false	
        jitMasking=true)}}`);	
    assert.dom('input').hasValue('15');	

    await fillIn('input', '155');	
    assert.dom('input').hasValue('15');	
  });

  test('Inputs value correcly even when input have multiple masks', async function(assert) {
    this.set('masks', ['9.9.9', '99.9-9']);
    this.set('data', null);
    this.set('update', (unmasked) => {
      this.set('data', unmasked)
    })

    await render(hbs`<OneWayInputMask @value={{data}} @mask={{this.masks}} @update={{update}} />`);

    await focus('input');
    await triggerKeyEvent('input', 'keypress', '1');
    await triggerKeyEvent('input', 'keydown', '1');
    await triggerKeyEvent('input', 'keyup', '1');

    await triggerKeyEvent('input', 'keypress', '3');
    await triggerKeyEvent('input', 'keydown', '3');
    await triggerKeyEvent('input', 'keyup', '3');

    await triggerKeyEvent('input', 'keypress', '4');
    await triggerKeyEvent('input', 'keydown', '4');
    await triggerKeyEvent('input', 'keyup', '4');

    assert.dom('input').hasValue("1.3.4");

    await triggerKeyEvent('input', 'keypress', '5');
    await triggerKeyEvent('input', 'keydown', '5');
    await triggerKeyEvent('input', 'keyup', '5');

    assert.dom('input').hasValue("13.4-5");
  });	
});