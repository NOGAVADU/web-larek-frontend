export interface IItemCard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export type PaymentMethod = 'online' | 'offline'

export interface IOrderForm {
	paymentMethod: PaymentMethod;
	address: string;
	mail: string;
	phone: string;
}

export interface IOrder extends IOrderForm {
	info: string[];
	items: IItemCard[];
}

export interface IOrderResult {
	result: { id: string, total: number } | { error: string };
}

export interface IAppState {
	catalog: IItemCard[];
	basket: IItemCard[];
	order: IOrder | null;
	loading: boolean;
}