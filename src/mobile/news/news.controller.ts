import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { NewsService } from './news.service';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../_utils/necessary/public.decorator';

@ApiTags('News')
@Public(false)
@ApiBearerAuth('Authorization')
@Controller()
export class NewsController {
  constructor(private readonly newsService: NewsService) {
  }

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
