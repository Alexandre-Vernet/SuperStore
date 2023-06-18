export class NotificationsDto {
    icon: NotificationType;
    title: string;
    description: string;
    show: boolean;
    duration: number;
}

export enum NotificationType {
    success = 'success',
    error = 'error',
}
