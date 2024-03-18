"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const session = require("express-session");
const passport = require("passport");
const config_1 = require("@nestjs/config");
const MongoStore = require('connect-mongo');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    });
    app.use(session({
        secret: configService.get('SESSION_SECRET'),
        resave: Boolean(configService.get('SESSION_RESAVE')),
        saveUninitialized: Boolean(configService.get('SESSION_SAVE_UNINITIALIZED')),
        cookie: { maxAge: +configService.get('SESSION_MAX_AGE') },
        store: MongoStore.create({
            mongoUrl: `mongodb+srv://${configService.get('DATABASE_USER')}:${configService.get('DATABASE_PASSWORD')}@cluster0.0gnozrq.mongodb.net/LAU_EVENTS?retryWrites=true&w=majority`
        }),
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    await app.listen(3000, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map