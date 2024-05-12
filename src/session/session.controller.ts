import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Request, Response } from 'express';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}


  // Create customer session
  @Post("customer")
  async createCustomerSession(@Body() body: any, @Res() res: Response) {
    const idToken = body.idToken;
    const customerEmail = body.email;
    const cookieSession = await this.sessionService.createCustomerSessionCookie(idToken, customerEmail);
    res.cookie("swifty_customer_session", cookieSession, {
      maxAge: 60 * 60 * 24 * 7 * 1000,
      httpOnly: true,
      secure: true,
      path: "/",
    });
    res.send({ statusCode: HttpStatus.OK, sessionId: cookieSession });
  }

  // Create merchant session
  @Post("merchant")
  async createMerchantSession(@Body() body: any, @Res() res: Response) {
    const idToken = body.idToken;
    const merchantEmail = body.email;
    const cookieSession = await this.sessionService.createMerchantSessionCookie(idToken, merchantEmail);
    res.cookie("swifty_merchant_session", cookieSession, {
      maxAge: 60 * 60 * 24 * 7 * 1000,
      httpOnly: true,
      secure: process.env.PRODUCTION === "true" ? true : false,
      path: "/",
    });
    res.send({ statusCode: HttpStatus.OK, sessionId: cookieSession});
  }

  // Get customer data
  @Get("customer")
  async getCustomerData(@Req() req: Request, @Res() res: Response) {
    const customer = req.customer;
    res.send({ statusCode: HttpStatus.OK, data: customer });
  }

  // Get merchant data
  @Get("merchant")
  async getMerchantData(@Req() req: Request, @Res() res: Response) {
    const merchant = req.merchant;
    res.send({ statusCode: HttpStatus.OK, data: merchant });
  }

  @Delete("customer")
  async deleteCustomerSession(@Res() res: Response) {
    res.clearCookie("swifty_customer_session");
    res.send({ statusCode: HttpStatus.OK, message: "Session deleted" });
  }

  @Delete("merchant")
  async deleteMerchantSession(@Res() res: Response) {
    res.clearCookie("swifty_merchant_session");
    res.send({ statusCode: HttpStatus.OK, message: "Session deleted" });
  }
}
