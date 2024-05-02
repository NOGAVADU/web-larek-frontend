import { FormErrors, IAppState, IOrder, IOrderForm, IProductItem } from '../types';
import { Model } from './base/Model';
import * as events from 'events';

export type CatalogChangeEvent = {
	catalog: IProductItem[]
};

export class AppState extends Model<IAppState> {
	basket: IProductItem[] = [];
	catalog: IProductItem[] = [];
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		items: [],
		total: 0,
	};
	preview: string;
	formErrors: FormErrors = {};

	setCatalog(items: IProductItem[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}




	getTotalBasketPrice(): number {
		let totalPrice = 0;
		this.basket.forEach(product => {
			totalPrice += product.price;
		});
		return totalPrice;
	}

	getBasketItemsCount(): number {
		return this.basket.length;
	}

	addToBasket(item: IProductItem) {
		const product = this.catalog.filter(product => product.id === item.id)[0];
		this.basket = [...this.basket, product];
		item.inBasket = true;
		this.emitChanges('basket:changed', { basket: this.basket });
	}

	removeFromBasket(item: IProductItem) {
		this.basket = this.basket.filter(product => product.id !== item.id);
		item.inBasket = false;
		this.emitChanges('basket:changed', { basket: this.basket });
	}

	setPreview(item: IProductItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адресс';
		}
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
	clearBasket() {
		this.basket.forEach(item => item.inBasket = false);
		this.basket = [];
	}

	resetOrder() {
		this.order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			items: [],
			total: 0,
		};
	}
}