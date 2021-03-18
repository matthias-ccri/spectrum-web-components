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

import {
    html,
    SpectrumElement,
    CSSResultArray,
    TemplateResult,
    property,
    query,
    PropertyValues,
    ifDefined,
} from '@spectrum-web-components/base';
import '../sp-combobox-item.js';
import { ComboboxItem } from './ComboboxItem.js';

import styles from './combobox.css.js';

/**
 * @element sp-combobox
 */
export class Combobox extends SpectrumElement {
    public static get styles(): CSSResultArray {
        return [styles];
    }

    /**
     * The currently active ComboboxItem descendent, when available.
     */
    @property({ attribute: false })
    protected activeDescendent?: ComboboxItem;

    @property({ attribute: false })
    protected availableOptions: ComboboxItem[] = [];

    /**
     * Whether the listbox is visible.
     **/
    @property({ type: Boolean, reflect: true })
    public open = false;

    @property()
    public value = '';

    @query('input')
    public focusElement!: HTMLInputElement;

    /**
     * The array of the children of the combobox, ie ComboboxItems.
     **/
    private descendents: ComboboxItem[] = [];

    public focus(): void {
        this.focusElement.focus();
    }

    public click(): void {
        this.focus();
        this.focusElement.click();
    }

    public onComboboxKeydown(event: KeyboardEvent): void {
        if (event.altKey && event.code === 'ArrowDown') {
            this.open = true;
        } else if (event.code === 'ArrowDown') {
            event.preventDefault();
            this.open = true;
            this.activateNextDescendent();
        } else if (event.code === 'ArrowUp') {
            event.preventDefault();
            this.open = true;
            this.activatePreviousDescendent();
        } else if (event.code === 'Escape') {
            if (!this.open) {
                this.value = '';
            }
            this.open = false;
        } else if (event.code === 'Enter') {
            this.selectDescendent();
            this.open = false;
        } else if (event.code === 'Home') {
            this.focusElement.setSelectionRange(0, 0);
            this.activeDescendent = undefined;
        } else if (event.code === 'End') {
            const { length } = this.value;
            this.focusElement.setSelectionRange(length, length);
            this.activeDescendent = undefined;
        } else if (event.code === 'ArrowLeft') {
            this.activeDescendent = undefined;
        } else if (event.code === 'ArrowRight') {
            this.activeDescendent = undefined;
        }
    }

    /**
     * Get the elements from the picker list
     * put them into the descendents array by mapping each li element into it
     **/
    private manageDescendents(): void {
        const list = this.shadowRoot.querySelector(
            '#listbox'
        ) as HTMLUListElement;
        this.descendents = ([...list.children] as ComboboxItem[]).filter(
            (descendent) => descendent.getAttribute('role') === 'option'
        );
    }

    public activateNextDescendent(): void {
        const activeIndex = !this.activeDescendent
            ? -1
            : this.descendents.indexOf(this.activeDescendent);
        const nextActiveIndex =
            (this.descendents.length + activeIndex + 1) %
            this.descendents.length;
        this.activeDescendent = this.descendents[nextActiveIndex];
    }

    public activatePreviousDescendent(): void {
        const activeIndex = !this.activeDescendent
            ? 0
            : this.descendents.indexOf(this.activeDescendent);
        const previousActiveIndex =
            (this.descendents.length + activeIndex - 1) %
            this.descendents.length;
        this.activeDescendent = this.descendents[previousActiveIndex];
    }

    public selectDescendent(): void {
        if (!this.activeDescendent) {
            return;
        }
        this.value = this.activeDescendent.value;
    }

    public filterAvailableOptions(): void {
        this.availableOptions = this.descendents.filter((descendent) =>
            descendent.value.startsWith(this.value)
        );
    }

    public onComboboxInput({
        target,
    }: Event & { target: HTMLInputElement }): void {
        this.value = target.value;
        this.activeDescendent = undefined;
        this.open = true;
    }

    public onListPointerenter({
        target,
    }: PointerEvent & { target: ComboboxItem }) {
        this.activeDescendent = target;
    }

    public onListPointerleave() {
        this.activeDescendent = undefined;
    }

    public onListClick({ target }: PointerEvent & { target: ComboboxItem }) {
        this.activeDescendent = target;
        if (!this.activeDescendent) {
            return;
        }
        this.selectDescendent();
        this.open = false;
    }

    public toggleOpen(): void {
        this.open = !this.open;
    }

    protected shouldUpdate(changed: PropertyValues<this>): boolean {
        if (changed.has('open') && !this.open) {
            this.activeDescendent = undefined;
        }
        if (changed.has('value')) {
            this.filterAvailableOptions();
        }
        return super.shouldUpdate(changed);
    }

    protected render(): TemplateResult {
        return html`
            <label id="label">
                Combobox
                <input
                    aria-controls="listbox"
                    aria-activedescendant=${ifDefined(
                        this.activeDescendent ? 'true' : undefined
                    )}
                    aria-autocomplete="list"
                    aria-expanded=${this.open ? 'true' : 'false'}
                    @click=${this.toggleOpen}
                    @input=${this.onComboboxInput}
                    @keydown=${this.onComboboxKeydown}
                    role="combobox"
                    type="text"
                    .value=${this.value}
                />
            </label>
            <button
                aria-controls="listbox"
                aria-expanded=${this.open ? 'true' : 'false'}
                aria-labelledby="label"
                @click=${this.toggleOpen}
                tabindex="-1"
            ></button>
            <ul
                aria-labelledby="label"
                @pointerenter=${this.onListPointerenter}
                @pointerleave=${this.onListPointerleave}
                @click=${this.onListClick}
                ?hidden=${!this.open}
                role="listbox"
                id="listbox"
            >
                <sp-combobox-item
                    id="thing1"
                    aria-selected=${ifDefined(
                        this.activeDescendent?.id === 'thing1'
                            ? 'true'
                            : undefined
                    )}
                >
                    Abc Thing 1
                </sp-combobox-item>
                <sp-combobox-item
                    id="thing1a"
                    aria-selected=${ifDefined(
                        this.activeDescendent?.id === 'thing1a'
                            ? 'true'
                            : undefined
                    )}
                >
                    Bde Thing 2
                </sp-combobox-item>
                <sp-combobox-item role="separator"><hr /></sp-combobox-item>
                <sp-combobox-item
                    id="thing1b"
                    aria-selected=${ifDefined(
                        this.activeDescendent?.id === 'thing1b'
                            ? 'true'
                            : undefined
                    )}
                >
                    Bef Thing 3
                </sp-combobox-item>
                <sp-combobox-item
                    id="thing4"
                    aria-selected=${ifDefined(
                        this.activeDescendent?.id === 'thing4'
                            ? 'true'
                            : undefined
                    )}
                >
                    Efg Thing 4
                </sp-combobox-item>
            </ul>
        `;
    }

    protected firstUpdated(changed: PropertyValues<this>): void {
        super.firstUpdated(changed);
        this.updateComplete.then(() => {
            this.manageDescendents();
            this.availableOptions = this.descendents;
        });
    }

    protected async _getUpdateComplete(): Promise<void> {
        await super._getUpdateComplete();
        const list = this.shadowRoot.querySelector(
            '#listbox'
        ) as HTMLUListElement;
        const descendents = [...list.children] as ComboboxItem[];
        await Promise.all(
            descendents.map((descendent) => descendent.updateComplete)
        );
    }
}

/**
 * 
    <sp-combobox>
        #shadow-root
    this.shadowRoot.querySelector('#listbox').children;
    this.shadowRoot.querySelectorAll('li');
            <div class="spectrum-Textfield spectrum-InputGroup-textfield">
                <input type="text" placeholder="Type here" name="field" value="" class="spectrum-Textfield-input spectrum-InputGroup-input">
            </div>
            <button class="spectrum-Picker spectrum-Picker--sizeM spectrum-InputGroup-button" tabindex="-1" aria-haspopup="true">
                <svg class="spectrum-Icon spectrum-UIIcon-ChevronDown100 spectrum-Picker-menuIcon spectrum-InputGroup-icon" focusable="false" aria-hidden="true">
                    <use xlink:href="#spectrum-css-icon-Chevron100" />
                </svg>
            </button>
    </sp-conbobox>
 * 
 */

/**
 *
 * Aria attributes
 * Accessible DOM states
 * Accessibility tree testing
 *
 * Public API
 *
 * Aria-Spectrum consumption
 *
 * visual delivery
 * popover requirement
 */
