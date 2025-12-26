import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PortofolioService } from './portofolio.service';
import {
  PortfolioQueryDto,
  RemovePortfolioDto,
  SavePortfolioDto,
  UpdatePortfolioStatusDto,
} from './portofolio.dto';

@Controller('portofolio')
export class PortofolioController {
  constructor(private readonly portofolioService: PortofolioService) {}

  @Post()
  async save(@Body() dto: SavePortfolioDto) {
    return await this.portofolioService.save(dto);
  }

  @Get()
  async getPublicAll() {
    return await this.portofolioService.PublicAll();
  }

  @Get('list')
  async findAll(@Query() query: PortfolioQueryDto) {
    return await this.portofolioService.findAll(query);
  }

  @Patch('status')
  async updateStatus(@Body() dto: UpdatePortfolioStatusDto) {
    return await this.portofolioService.updateStatus(dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const dto: RemovePortfolioDto = { id };
    return await this.portofolioService.remove(dto);
  }
}
