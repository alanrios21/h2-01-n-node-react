import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreatePredictionDTO } from './dtos/create-prediction.dto';
import { PredictionsPaginationDTO } from './dtos/pagination.dto';
import { CreateAggregatePredictionDTO } from './dtos/create-aggregate.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Predictions')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('predictions')
export class PredictionsController {
  constructor(private predictionsService: PredictionsService) {}

  @Post()
  createPrediction(
    @Body() createPredictionDto: CreatePredictionDTO,
    @Req() req,
  ) {
    return this.predictionsService.createPrediction(
      createPredictionDto,
      req.user.userId,
    );
  }

  @Post('/aggregate')
  createAggregatePrediction(
    @Body() createAggregatePredictionDto: CreateAggregatePredictionDTO,
    @Req() req,
  ) {
    return this.predictionsService.createAggregatePrediction(
      createAggregatePredictionDto,
      req.user.userId,
    );
  }

  @Get('/single/:id')
  findSinglePredictionById(@Param('id') id: string) {
    return this.predictionsService.findSinglePredictionById(+id);
  }

  @Get('/aggregate/:id')
  findAggregatePredictionById(@Param('id') id: string) {
    return this.predictionsService.findAggregatePredictionById(+id);
  }

  @Get('/user')
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description:
      'Specifies the type of predictions to retrieve. Use "single" to fetch only predictions that do not point to aggregate predictions. Use "aggregate" to fetch only aggregate predictions along with their corresponding single predictions. If omitted, both types will be returned by default.',
    enum: ['single', 'SINGLE', 'aggregate', 'AGGREGATE'],
  })
  findUserPredictions(@Req() req, @Query() query: PredictionsPaginationDTO) {
    return this.predictionsService.findAllByUserId(req.user.userId, query);
  }

  @Get('/user/count')
  countUserPredictionsForNextWeek(@Req() req) {
    return this.predictionsService.countUserPredictionsForNextWeek(
      req.user.userId,
    );
  }

  @Get('/user/fixture/:id')
  findAllByFixtureIdAndUserId(@Param('id') id: string, @Req() req) {
    return this.predictionsService.findAllByFixtureIdAndUserId(
      +id,
      req.user.userId,
    );
  }
}
