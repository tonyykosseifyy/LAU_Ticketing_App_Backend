import { Test, TestingModule } from '@nestjs/testing';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';

describe('ClubsController', () => {
  let controller: ClubsController;
  let service: ClubsService;

  beforeEach(async () => {
    
  });

  
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
