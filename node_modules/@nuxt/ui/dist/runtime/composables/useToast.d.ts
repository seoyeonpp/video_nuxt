import type { Notification } from '../types/notification';
export declare function useToast(): {
    add: (notification: Partial<Notification>) => {
        id: string;
        title?: string | undefined;
        description?: string | undefined;
        icon?: string | undefined;
        avatar?: import("../types/avatar").Avatar | undefined;
        closeButton?: import("../types/button").Button | undefined;
        timeout?: number | undefined;
        actions?: import("../types/notification").NotificationAction[] | undefined;
        click?: Function | undefined;
        callback?: Function | undefined;
        color?: string | undefined;
        ui?: any;
    };
    remove: (id: string) => void;
};
