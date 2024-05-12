import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class CustomerAuthMiddleware implements NestMiddleware {
	constructor(private readonly sessionService: SessionService) {}
  use(req: Request, res: Response, next: NextFunction) {
		const sessionCookie = req.cookies.swifty_customer_session;
		if (!sessionCookie) {
			return res.status(401).send('Unauthorized from Middleware, forgot to include credentials?');
		}

		this.sessionService.getCustomerData(sessionCookie)
		.then((result) => {
			if (!result) {
				return res.status(401).send('Unauthorized from Middleware');
			}

			req.customer = result;
			req.customerId = result.id;
			next();
		})
		.catch((error) => {
			return res.status(401).send('Unauthorized from Middleware');
		});
  }
}