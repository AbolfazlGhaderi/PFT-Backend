type ModelKey<M> = keyof M & string;


export enum SortTypesEnum {
    ASC = 'ASC',
    DESC = 'DESC',
}


export interface QueryOptions<M> {
    where?: Partial<M>;
    select?: ModelKey<M>[];
    sort?: Record<ModelKey<M>, SortTypesEnum>;
    page?: number;
    size?: number;
    offset?: number;
}