import { InjectionToken } from "@angular/core";
import { AppConfig } from "./appConfig.interface";
import { environment } from "../../environments/environment.development";

export const appServiceConfig = new InjectionToken<AppConfig>('app.config');

export const appConfig: AppConfig = {
    apiEndPoint : environment.apiEndPoint
}