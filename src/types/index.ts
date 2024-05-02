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
	inBasket: boolean;
	basketIndex: number;
}

export interface IOrderAddress {
	payment: string;
	address: string;
}

export interface IOrderContacts{
	email: string;
	phone: string;
}

export interface IOrderForm extends IOrderAddress, IOrderContacts {}

export interface IOrder extends IOrderForm {
	items: string[];
	total: number
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