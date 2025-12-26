import { Body, Controller, Inject, Ip, Post } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { HeartbeatDto, LeaveHeartbeatDto } from './visitors/visitors.dto';
import { VisitorsService } from './visitors/visitors.service';

@Controller('heartbeat')
export class HeartbeatController {
  constructor(@Inject() private readonly visitors: VisitorsService) {}

  @AllowAnonymous()
  @Post('visit')
  async heartbeat(@Body() body: HeartbeatDto, @Ip() ip: string) {
    return await this.visitors.handleHeartbeat(body, ip);
  }

  @AllowAnonymous()
  @Post('leave')
  async leaveHeartbeat(@Body() body: LeaveHeartbeatDto) {
    return await this.visitors.handleOffline(body.fingerprintId);
  }

  @Post('map')
  async mapVisitor() {
    return await this.visitors.handleMaps();
  }
}
