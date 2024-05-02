import { Api, ApiListResponse } from './base/api';
import { IOrder, IProductItem } from '../types';

type TApiError = { error: string }

export class LarekApi extends Api {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductById(id: string) {
		return this.get(`/product/${id}`)
			.then((product: IProductItem) => (
				{
					...product,
					image: this.cdn + product.image,
					inBasket: false,
				}
			));
	}

	getAllProducts() {
		return this.get(`/product`).then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
				inBasket: false,
			})),
		);
	}

	createOrder(order: IOrder) {
		return this.post(`/order`, order).then((data: IOrder) => data);
	}
}