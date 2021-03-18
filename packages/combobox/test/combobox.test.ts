/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { fixture, elementUpdated, expect, html } from '@open-wc/testing';

import '../sp-combobox.js';
import '../sp-combobox-item.js';
import { Combobox, ComboboxItem } from '..';
import {
    arrowDownEvent,
    arrowUpEvent,
    arrowLeftEvent,
    escapeEvent,
    enterEvent,
    homeEvent,
    endEvent,
} from '../../../test/testing-helpers.js';
import { executeServerCommand } from '@web/test-runner-commands';

describe('Combobox', () => {
    it('loads default combobox accessibly', async () => {
        const el = await fixture<Combobox>(
            html`
                <sp-combobox></sp-combobox>
            `
        );

        await elementUpdated(el);

        await expect(el).to.be.accessible();
    });
    it('loads with list closed', async () => {
        const el = await fixture<Combobox>(
            html`
                <sp-combobox></sp-combobox>
            `
        );

        await elementUpdated(el);

        expect(el.open).to.be.false;
    });
    describe('manages focus', () => {
        it('responds to focus()', async () => {
            const el = await fixture<Combobox>(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);

            el.focus();

            await elementUpdated(el);
            expect(el.shadowRoot.activeElement).to.equal(el.focusElement);
        });
        it('responds to click()', async () => {
            const el = await fixture<Combobox>(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.open).to.be.false;

            el.click();

            await elementUpdated(el);
            expect(el.shadowRoot.activeElement).to.equal(el.focusElement);
            expect(el.open).to.be.true;

            el.click();

            await elementUpdated(el);
            expect(el.shadowRoot.activeElement).to.equal(el.focusElement);
            expect(el.open).to.be.false;
        });
    });
    describe('keyboard events', () => {
        it('opens on ArrowDown', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: ComboboxItem;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);

            el.focusElement.focus();

            el.focusElement.dispatchEvent(arrowDownEvent);

            await elementUpdated(el);
            expect(el.open).to.be.true;
            expect(el.activeDescendent).to.not.be.undefined;
        });
        it('opens on Alt+ArrowDown', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: ComboboxItem;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);

            el.focusElement.focus();

            await executeServerCommand('send-keys', {
                press: 'Alt+ArrowDown',
            });

            await elementUpdated(el);
            expect(el.open).to.be.true;
            expect(el.activeDescendent).to.be.undefined;
        });
        it('opens on ArrowUp', async () => {
            const el = await fixture<Combobox>(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);

            el.focusElement.focus();

            el.focusElement.dispatchEvent(arrowUpEvent);

            await elementUpdated(el);
            expect(el.open).to.be.true;
        });
        it('does not open on ArrowLeft', async () => {
            const el = await fixture<Combobox>(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);

            el.focusElement.focus();

            el.focusElement.dispatchEvent(arrowLeftEvent);

            await elementUpdated(el);
            expect(el.open).to.be.false;
        });
        it('does not close on ArrowLeft', async () => {
            const el = await fixture<Combobox>(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);

            el.open = true;

            el.focusElement.focus();

            el.focusElement.dispatchEvent(arrowLeftEvent);

            await elementUpdated(el);
            expect(el.open).to.be.true;
        });
        it('moves the carat/removes activeDescendent on ArrowLeft', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);

            el.open = true;
            el.value = 'test';
            await elementUpdated(el);

            el.focusElement.setSelectionRange(4, 4);
            el.focusElement.focus();
            expect(el.focusElement.selectionStart).to.equal(4);

            el.focusElement.dispatchEvent(arrowDownEvent);
            await elementUpdated(el);

            expect(el.activeDescendent.id).to.equal('thing1');
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );
            expect(el.open).to.be.true;

            await executeServerCommand('send-keys', {
                press: 'ArrowLeft',
            });

            await elementUpdated(el);
            expect(el.focusElement.selectionStart).to.equal(3);
            expect(el.activeDescendent).to.be.undefined;
            expect(el.open).to.be.true;
        });
        it('moves the carat/removes activeDescendent on ArrowRight', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);

            el.open = true;
            el.value = 'test';
            await elementUpdated(el);

            el.focusElement.setSelectionRange(1, 1);
            el.focusElement.focus();
            expect(el.focusElement.selectionStart).to.equal(1);

            el.focusElement.dispatchEvent(arrowDownEvent);
            await elementUpdated(el);

            expect(el.activeDescendent.id).to.equal('thing1');
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );
            expect(el.open).to.be.true;

            await executeServerCommand('send-keys', {
                press: 'ArrowRight',
            });

            await elementUpdated(el);
            expect(el.focusElement.selectionStart).to.equal(2);
            expect(el.activeDescendent).to.be.undefined;
            expect(el.open).to.be.true;
        });
        it('moves carat to 0 with Home key', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);

            el.open = true;
            el.value = 'test';

            await elementUpdated(el);
            el.focusElement.focus();
            el.focusElement.setSelectionRange(4, 4);
            await elementUpdated(el);
            expect(el.focusElement.selectionStart, 'start 1').to.equal(4);
            expect(el.focusElement.selectionEnd, 'end 1').to.equal(4);

            el.focusElement.dispatchEvent(arrowDownEvent);
            await elementUpdated(el);

            expect(el.activeDescendent.id).to.equal('thing1');
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );
            expect(el.open).to.be.true;

            el.focusElement.dispatchEvent(homeEvent);
            await elementUpdated(el);
            expect(el.focusElement.selectionStart, 'start 2').to.equal(0);
            expect(el.focusElement.selectionEnd, 'end 2').to.equal(0);
            expect(el.activeDescendent).to.be.undefined;
            expect(el.shadowRoot.querySelector('[aria-selected]')).to.be.null;
            expect(el.open).to.be.true;
        });
        it('moves carat to end with End key', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);

            el.open = true;
            el.value = 'test';
            await elementUpdated(el);

            el.focusElement.focus();
            el.focusElement.setSelectionRange(1, 1);
            await elementUpdated(el);
            expect(el.focusElement.selectionStart, 'start 1').to.equal(1);
            expect(el.focusElement.selectionEnd, 'end 1').to.equal(1);

            el.focusElement.dispatchEvent(arrowDownEvent);
            await elementUpdated(el);

            expect(el.activeDescendent.id).to.equal('thing1');
            expect(el.open).to.be.true;

            el.focusElement.dispatchEvent(endEvent);
            await elementUpdated(el);
            expect(el.focusElement.selectionStart, 'start 2').to.equal(4);
            expect(el.focusElement.selectionEnd, 'end 2').to.equal(4);
            expect(el.activeDescendent).to.be.undefined;
            expect(el.open).to.be.true;
        });
        it('closes on Escape', async () => {
            const el = await fixture<Combobox>(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);

            el.open = true;

            el.focusElement.focus();

            el.focusElement.dispatchEvent(escapeEvent);

            await elementUpdated(el);
            expect(el.open).to.be.false;
        });
        it('clears on Escape', async () => {
            const el = await fixture<Combobox>(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);

            el.value = 'Test';

            el.focusElement.focus();

            el.focusElement.dispatchEvent(escapeEvent);

            await elementUpdated(el);
            expect(el.open).to.be.false;
            expect(el.value).to.equal('');
        });
    });
    describe('mouse events', () => {
        it('opens on input click', async () => {
            const el = await fixture<Combobox>(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);

            el.focusElement.click();

            await elementUpdated(el);
            expect(el.open).to.be.true;
        });
        it('closes on input click', async () => {
            const el = await fixture<Combobox>(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);

            el.open = true;
            expect(el.open).to.be.true;

            el.focusElement.click();

            await elementUpdated(el);
            expect(el.open).to.be.false;
        });
        it('opens on button click', async () => {
            const el = await fixture<Combobox>(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            const button = el.shadowRoot.querySelector(
                'button'
            ) as HTMLButtonElement;

            await elementUpdated(el);

            button.click();

            await elementUpdated(el);
            expect(el.open).to.be.true;
        });
        it('closes on button click', async () => {
            const el = await fixture<Combobox>(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            const button = el.shadowRoot.querySelector(
                'button'
            ) as HTMLButtonElement;

            await elementUpdated(el);

            el.open = true;
            expect(el.open).to.be.true;

            button.click();

            await elementUpdated(el);
            expect(el.open).to.be.false;
        });
    });
    describe('manage active decendent', () => {
        it('sets activeDescendent to first descendent on ArrowDown', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.activeDescendent).to.be.undefined;

            el.focusElement.focus();
            el.focusElement.dispatchEvent(arrowDownEvent);

            await elementUpdated(el);
            expect(el.activeDescendent.id).to.equal('thing1');
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );
        });
        it('updates activeDescendent on ArrowDown', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.activeDescendent).to.be.undefined;

            el.focusElement.focus();
            el.focusElement.dispatchEvent(arrowDownEvent);

            await elementUpdated(el);
            expect(el.activeDescendent.id).to.equal('thing1');
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );
            el.focusElement.dispatchEvent(arrowDownEvent);

            await elementUpdated(el);
            expect(el.activeDescendent.id).to.equal('thing1a');
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );
        });
        it('cycles activeDescendent on ArrowDown', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.activeDescendent).to.be.undefined;

            el.focusElement.focus();
            el.focusElement.dispatchEvent(arrowDownEvent);

            await elementUpdated(el);
            expect(el.activeDescendent.id).to.equal('thing1');
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );
            el.focusElement.dispatchEvent(arrowDownEvent);

            await elementUpdated(el);
            el.focusElement.dispatchEvent(arrowDownEvent);

            await elementUpdated(el);
            el.focusElement.dispatchEvent(arrowDownEvent);

            await elementUpdated(el);
            el.focusElement.dispatchEvent(arrowDownEvent);

            await elementUpdated(el);
            expect(el.activeDescendent.id).to.equal('thing1');
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );
        });
        it('sets activeDescendent to last descendent on ArrowUp', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.activeDescendent).to.be.undefined;

            el.focusElement.focus();
            el.focusElement.dispatchEvent(arrowUpEvent);

            await elementUpdated(el);
            expect(el.activeDescendent.id).to.equal('thing4');
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );
        });
        it('updates activeDescendent on ArrowUp', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.activeDescendent).to.be.undefined;

            el.focusElement.focus();
            el.focusElement.dispatchEvent(arrowUpEvent);

            await elementUpdated(el);
            expect(el.activeDescendent.id).to.equal('thing4');
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );
            el.focusElement.dispatchEvent(arrowUpEvent);

            await elementUpdated(el);
            expect(el.activeDescendent.id).to.equal('thing1b');
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );
        });
        it('cycles activeDescendent on ArrowUp', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.activeDescendent).to.be.undefined;

            el.focusElement.focus();
            el.focusElement.dispatchEvent(arrowUpEvent);

            await elementUpdated(el);
            expect(el.activeDescendent.id).to.equal('thing4');
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );
            el.focusElement.dispatchEvent(arrowUpEvent);

            await elementUpdated(el);
            el.focusElement.dispatchEvent(arrowUpEvent);

            await elementUpdated(el);
            el.focusElement.dispatchEvent(arrowUpEvent);

            await elementUpdated(el);
            el.focusElement.dispatchEvent(arrowUpEvent);

            await elementUpdated(el);
            expect(el.activeDescendent.id).to.equal('thing4');
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );
        });
        it('sets the activeDescendent on pointerenter of an item', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.value).to.equal('');
            expect(el.activeDescendent).to.be.undefined;
            expect(el.open).to.be.false;

            el.focusElement.click();

            expect(el.open).to.be.true;

            const descendent = 'thing1b';
            const item = el.shadowRoot.querySelector(
                `#${descendent}`
            ) as HTMLElement;
            item.dispatchEvent(
                new PointerEvent('pointerenter', {
                    bubbles: true,
                })
            );

            await elementUpdated(el);

            expect(el.open).to.be.true;
            expect(el.activeDescendent.id).to.equal(descendent);
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );
        });
        it('clears the activeDescendent on pointerleave of an item', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.value).to.equal('');
            expect(el.activeDescendent).to.be.undefined;
            expect(el.open).to.be.false;

            el.focusElement.click();

            expect(el.open).to.be.true;

            const descendent = 'thing1b';
            const item = el.shadowRoot.querySelector(
                `#${descendent}`
            ) as HTMLElement;
            item.dispatchEvent(
                new PointerEvent('pointerenter', {
                    bubbles: true,
                })
            );

            await elementUpdated(el);

            expect(el.open).to.be.true;
            expect(el.activeDescendent.id).to.equal(descendent);
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );
            item.dispatchEvent(
                new PointerEvent('pointerleave', {
                    bubbles: true,
                })
            );

            await elementUpdated(el);

            expect(el.open).to.be.true;
            expect(el.activeDescendent).to.be.undefined;
        });
    });
    describe('item selection', () => {
        it('sets the value when descendent is active and `enter` is pressed', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.value).to.equal('');
            expect(el.activeDescendent).to.be.undefined;
            expect(el.open).to.be.false;

            el.focusElement.focus();
            el.focusElement.dispatchEvent(arrowDownEvent);

            expect(el.open).to.be.true;

            await elementUpdated(el);
            el.focusElement.dispatchEvent(arrowDownEvent);

            await elementUpdated(el);
            expect(el.activeDescendent.id).to.equal('thing1a');
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );

            el.focusElement.dispatchEvent(enterEvent);

            await elementUpdated(el);
            expect(el.open).to.be.false;
            expect(el.activeDescendent).to.be.undefined;
            expect(el.value).to.equal('Bde Thing 2');
            expect(el.focusElement.value).to.equal(el.value);
        });
        it('does not set the value when `enter` is pressed and no active descendent', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.value).to.equal('');
            expect(el.activeDescendent).to.be.undefined;
            expect(el.open).to.be.false;

            el.focusElement.click();

            expect(el.open).to.be.true;
            expect(el.activeDescendent).to.be.undefined;

            el.focusElement.dispatchEvent(enterEvent);

            await elementUpdated(el);
            expect(el.open).to.be.false;
            expect(el.activeDescendent).to.be.undefined;
            expect(el.value).to.equal('');
            expect(el.focusElement.value).to.equal(el.value);
        });
        it('sets the value when an item is clicked', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.value).to.equal('');
            expect(el.activeDescendent).to.be.undefined;
            expect(el.open).to.be.false;

            el.focusElement.click();

            expect(el.open).to.be.true;

            const item = el.shadowRoot.querySelector('#thing1b') as HTMLElement;
            const itemValue = (item.textContent as string).trim();

            item.dispatchEvent(
                new PointerEvent('pointerenter', {
                    bubbles: true,
                })
            );
            await elementUpdated(el);
            expect(el.activeDescendent.id).to.equal('thing1b');
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );

            item.click();

            await elementUpdated(el);

            expect(el.value).to.equal(itemValue);
            expect(el.open).to.be.false;
            expect(el.activeDescendent).to.be.undefined;
        });
        it('sets the value when an item is clicked programatically', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.value).to.equal('');
            expect(el.activeDescendent).to.be.undefined;
            expect(el.open).to.be.false;

            el.focusElement.click();

            expect(el.open).to.be.true;

            const item = el.shadowRoot.querySelector('#thing1b') as HTMLElement;
            const itemValue = (item.textContent as string).trim();

            item.click();

            await elementUpdated(el);

            expect(el.value).to.equal(itemValue);
            expect(el.open).to.be.false;
            expect(el.activeDescendent).to.be.undefined;
        });
    });
    describe('responds to value changes', () => {
        it('sets the value when descendent is active and `enter` is pressed', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.value).to.equal('');
            expect(el.activeDescendent).to.be.undefined;
            expect(el.open).to.be.false;

            el.focus();

            await executeServerCommand('send-keys', {
                press: 'g',
            });

            expect(el.open).to.be.true;
            expect(el.focusElement.value, '<input> has value').to.equal('g');
            expect(el.value, 'el has value').to.equal('g');

            await executeServerCommand('send-keys', {
                press: 'r',
            });

            expect(el.open).to.be.true;
            expect(el.focusElement.value, '<input> has value').to.equal('gr');
            expect(el.value, 'el has value').to.equal('gr');
        });
        it('filters options when the value changes and is not found', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                    availableOptions: string[];
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.value).to.equal('');
            expect(el.activeDescendent).to.be.undefined;
            expect(el.open).to.be.false;
            expect(el.availableOptions.length).equal(4);

            el.click();

            await executeServerCommand('send-keys', {
                press: 'g',
            });

            expect(el.open).to.be.true;
            expect(el.availableOptions.length).equal(0);
        });
        it('filters options when the value typed and is found', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                    availableOptions: string[];
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.value).to.equal('');
            expect(el.activeDescendent).to.be.undefined;
            expect(el.open).to.be.false;
            expect(el.availableOptions.length).equal(4);

            el.click();

            await executeServerCommand('send-keys', {
                press: 'B',
            });

            await elementUpdated(el);
            expect(el.open).to.be.true;
            expect(el.value).to.equal('B');
            expect(el.availableOptions.length).equal(2);

            await executeServerCommand('send-keys', {
                press: 'D',
            });

            await elementUpdated(el);
            expect(el.open).to.be.true;
            expect(el.value).to.equal('BD');
            expect(el.availableOptions.length).equal(1);
        });
        it('filters options when the value is applied and is found', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                    availableOptions: string[];
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.value).to.equal('');
            expect(el.activeDescendent).to.be.undefined;
            expect(el.open).to.be.false;
            expect(el.availableOptions.length).equal(4);

            el.click();

            el.value = 'B';

            await elementUpdated(el);
            expect(el.open).to.be.true;
            expect(el.availableOptions.length).equal(2);

            el.value = 'Bd';

            await elementUpdated(el);
            expect(el.open).to.be.true;
            expect(el.availableOptions.length).equal(1);
        });
        it('deactives descendent on input', async () => {
            const el = await fixture<
                Combobox & {
                    activeDescendent: string;
                }
            >(
                html`
                    <sp-combobox></sp-combobox>
                `
            );

            await elementUpdated(el);
            expect(el.value).to.equal('');
            expect(el.activeDescendent).to.be.undefined;
            expect(el.open).to.be.false;

            el.focus();
            await elementUpdated(el);

            await executeServerCommand('send-keys', {
                press: 'B',
            });
            await elementUpdated(el);

            expect(el.value).to.equal('B');
            expect(el.activeDescendent).to.be.undefined;
            expect(el.open).to.be.true;

            el.focusElement.dispatchEvent(arrowDownEvent);
            await elementUpdated(el);
            el.focusElement.dispatchEvent(arrowDownEvent);
            await elementUpdated(el);

            expect(el.value).to.equal('B');
            expect(el.activeDescendent.id).to.equal('thing1a');
            expect(el.activeDescendent.getAttribute('aria-selected')).to.equal(
                'true'
            );
            expect(el.open).to.be.true;

            await executeServerCommand('send-keys', {
                press: 'd',
            });
            await elementUpdated(el);

            expect(el.value).to.equal('Bd');
            expect(el.activeDescendent).to.be.undefined;
            expect(el.open).to.be.true;
        });
    });
});
