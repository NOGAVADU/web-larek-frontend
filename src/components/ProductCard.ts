import { Component } from './base/Component';
import { IProductItem } from '../types';
import { ensureElement } from '../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

type categoryTypes = {
	[key: string]: string
}

const categoryTypesColors: categoryTypes = {
	'софт-скил': 'soft',
	'хард-скил': 'hard',
	'другое': 'other',
	'дополнительное': 'additional',
	'кнопка': 'button',
};

export class ProductCard extends Component<IProductItem> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _description?: HTMLElement;
	protected _category?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _button?: HTMLButtonElement;
	protected _basketIndex?: HTMLElement;

	constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions, inBasket?: boolean) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._category = container.querySelector(`.${blockName}__category`);
		this._description = container.querySelector(`.${blockName}__text`);
		this._image = container.querySelector(`.${blockName}__image`);
		this._button = container.querySelector(`.${blockName}__button`);
		this._basketIndex = container.querySelector(`.basket__item-index`)

		if (inBasket) {
			this.setDisabled(this._button, true)
		}

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set price(value: number) {
		this.setText(this._price, value !== null ? `${value} синапсов` : 'Бесценно');
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.add(`card__category_${categoryTypesColors[value]}`);
	}

	set buttonText(value: string) {
		this.setText(this._button, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string[] | string) {
		if (Array.isArray(value)) {
			this._description.replaceWith(...value.map(str => {
				const descTemplate = this._description.cloneNode() as HTMLElement;
				this.setText(descTemplate, str);
				return descTemplate;
			}));
		} else {
			this.setText(this._description, value);
		}
	}

	set basketIndex (value: number) {
		this.setText(this._basketIndex, value)
	}
}