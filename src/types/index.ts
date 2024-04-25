interface ICardActions {
	onClick: (event: MouseEvent) => void;
}
interface IBasketActions {
	onClick: (event: MouseEvent) => void;
}

export interface IProductItem {
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
	items: IProductItem[];
}

export interface IOrderResult {
	result: { id: string, total: number } | { error: string };
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppState {
	catalog: IProductItem[];
	basket: IProductItem[];
	order: IOrder | null;
	formErrors: FormErrors;
}