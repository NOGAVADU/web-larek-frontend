import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/LarekApi';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { AppState, CatalogChangeEvent } from './components/AppState';
import { ProductCard } from './components/ProductCard';
import { IOrderForm, IProductItem } from './types';
import { Basket } from './components/common/Basket';
import { OrderFormAddress } from './components/OrderFormAddress';
import { OrderFormContacts } from './components/OrderFormContacts';
import { Success } from './components/Success';

const events = new EventEmitter();
const larekApi = new LarekApi(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderAddressTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successModalTemplate = ensureElement<HTMLTemplateElement>('#success');

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const appData = new AppState({}, events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderAddress = new OrderFormAddress(cloneTemplate(orderAddressTemplate), events);
const orderContacts = new OrderFormContacts(cloneTemplate(orderContactsTemplate), events);


events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map(item => {
		const card = new ProductCard('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
			inBasket: item.inBasket,
		});
	});

});

events.on('card:select', (item: IProductItem) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: IProductItem) => {
	const card = new ProductCard('card', cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('basket:addItem', item),
	}, item.inBasket);
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
		}),
	});
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render({
			total: appData.getTotalBasketPrice(),
		}),
	});
});

events.on('basket:addItem', (item: IProductItem) => {
	appData.addToBasket(item);
	events.emit('preview:changed', item);
});

events.on('basket:removeItem', (item: IProductItem) => {
	appData.removeFromBasket(item);
});

events.on('basket:changed', () => {
	basket.items = appData.basket.map((item, index) => {
		const card = new ProductCard('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:removeItem', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			basketIndex: index + 1,
		});
	});

	basket.total = appData.getTotalBasketPrice();
	page.counter = appData.getBasketItemsCount();
});

events.on('order:open', () => {
	modal.render({
		content: orderAddress.render({
			payment: 'card',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:submit', () => {
	appData.order.items = appData.basket.filter(item => item.price !== null).map(item => item.id);
	appData.order.total = appData.getTotalBasketPrice()
	modal.render({
		content: orderContacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	console.log(appData.order)
	larekApi.createOrder(appData.order).then(res => {
		const successModal = new Success(cloneTemplate(successModalTemplate), { onClick: () => modal.close() });
		modal.render({
			content: successModal.render({
				total: appData.getTotalBasketPrice(),
			}),
		});
		appData.clearBasket();
		appData.resetOrder();
		basket.items = [];
		page.counter = 0;
	});
});

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone, address, payment } = errors;
	orderAddress.valid = !address && !payment;
	orderContacts.valid = !email && !phone;
	orderAddress.errors = Object.values({ address, payment }).filter(i => !!i).join('; ');
	orderContacts.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
});

events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
	appData.setOrderField(data.field, data.value);
});
events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
	appData.setOrderField(data.field, data.value);
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

larekApi.getAllProducts()
	.then(appData.setCatalog.bind(appData))
	.catch(err => {
		console.error(err);
	});

