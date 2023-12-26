import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { ClubsModule } from "../clubs/clubs.module"
import { AuthService } from "./auth.service"
import { LocalStrategy } from "./local.strategy"

@Module({
  imports: [ClubsModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}