import {Controller, Get, HttpStatus, Redirect} from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    @Redirect('graphql', HttpStatus.FOUND)
    index(): string {
        return 'Redirect to Playground';
    }
}