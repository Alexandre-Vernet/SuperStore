import { CreatePromotionDto } from "./create-promotion";

export class PromotionDto extends CreatePromotionDto {
    id: number;
}

export class PromotionWithStatus extends PromotionDto {
    status: string;
}
