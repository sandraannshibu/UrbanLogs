export interface ICarouselSlide {
    image:string
    id:string
}

export enum CarouselAction{
    ADD_TO_CART = 1,
    LEARN_MORE = 2
}

export interface ICarouselEmitter{
    id:string
    type:CarouselAction
}