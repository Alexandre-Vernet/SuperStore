export class NotificationsDto {
    icon: NotificationType;
    title: string;
    description: string;
    show: boolean;
}

export enum NotificationType {
    success = 'success',
    error = 'error',
    warning = 'warning',
}
