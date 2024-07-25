import { Controller, Post, Body } from '@nestjs/common';
import { RequestDecisionService } from './request_decision.service';
import { RequestDecisionDto } from './dto/request_decision.dto';

@Controller('request_decision')
export class RequestDecisionController {
  constructor(private readonly requestDecisionService: RequestDecisionService) {}

  @Post('/accept')
  accept(@Body() requestDecisionDto: RequestDecisionDto) {
    return this.requestDecisionService.accept(requestDecisionDto);
  }

  @Post('/decline')
  decline(@Body() requestDecisionDto: RequestDecisionDto) {
    return this.requestDecisionService.decline(requestDecisionDto);
  }
}
