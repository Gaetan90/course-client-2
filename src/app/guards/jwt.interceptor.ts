import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private AuthService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.AuthService.currentUserValue;
        console.log(request.url)
        if (currentUser && currentUser.token && !request.url.includes('dev.virtual')) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
            
        }
        return next.handle(request);
    }
}