import * as events from 'events';
import { Form } from './common/Form';
import { IOrderContacts } from '../types';
import { IEvents } from './base/events';

export class OrderFormContacts extends Form<IOrderContacts> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
}