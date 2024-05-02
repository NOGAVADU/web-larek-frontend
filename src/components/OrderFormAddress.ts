import { Form } from './common/Form';
import { IOrderAddress } from '../types';
import { IEvents } from './base/events';
import * as events from 'events';
import { ensureAllElements } from '../utils/utils';

export class OrderFormAddress extends Form<IOrderAddress> {
	protected _buttons: HTMLButtonElement[]

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

		this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.setPayment(button.name)
			})
		})
	}
	setPayment(name: string) {
		this._buttons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
			this.onInputChange('payment', name)
		})
	}
}