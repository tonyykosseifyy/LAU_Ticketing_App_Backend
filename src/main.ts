import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from "express-session"
import * as passport from "passport"
import { ConfigService } from "@nestjs/config";
import { AuthenticatedGuard } from './auth/authenticated.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  

  app.use(
    session({
      secret: configService.get("SESSION_SECRET"),
      resave: Boolean(configService.get("SESSION_RESAVE")),
      saveUninitialized: Boolean(configService.get("SESSION_SAVE_UNINITIALIZED")),
      cookie: { maxAge: +configService.get("SESSION_MAX_AGE") },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalGuards(new AuthenticatedGuard());

  await app.listen(3000);
}
bootstrap();
