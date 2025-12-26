import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { CarrierService } from './carrier.service';
import { DeleteDto, SaveCarrierDto } from './carrier.dto';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('carrier')
export class CarrierController {
  constructor(private readonly carrierService: CarrierService) {}

  @Post('save-work-experience')
  saveWorkExperience(@Body() body: SaveCarrierDto) {
    return this.carrierService.saveWorkExperience(body);
  }

  @Delete('delete-work-experience')
  deleteWorkExperience(@Body() body: DeleteDto) {
    return this.carrierService.deleteWorkExperience(body);
  }

  @AllowAnonymous()
  @Get('listing-work-experience')
  listingWorkExperience() {
    return this.carrierService.listingWorkExperience();
  }
}
