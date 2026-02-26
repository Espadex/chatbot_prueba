import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    // 1. Camino de "Ida" (Request)
    // La URL base apunta a tu configuración de entorno (environment.ts)
    const baseUrl = environment.apiUrl;

    // Clonamos la petición porque la original es "inmutable".
    // Aquí armamos la URL completa y le agregamos el token del entorno.
    const modifiedReq = req.clone({
        url: `${baseUrl}${req.url}`,
        setHeaders: {
            Authorization: `Bearer ${environment.token}`
        }
    });

    console.log('🚀 Interceptor detectó petición saliendo hacia:', modifiedReq.url);

    // 2. Camino de "Vuelta" (Response)
    // next(modifiedReq) envía la petición modificada al servidor y retorna un Observable con la respuesta.
    return next(modifiedReq);
};
