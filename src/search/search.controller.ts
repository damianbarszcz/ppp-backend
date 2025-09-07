import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get('mentors')
    async searchMentors(
        @Query('q') query: string,
        @Query('limit') limit: string = '10'
    ) {
        const mentors = await this.searchService.searchMentors(query, parseInt(limit));
        return {
            success: true,
            data: mentors,
            count: mentors.length
        };
    }
}