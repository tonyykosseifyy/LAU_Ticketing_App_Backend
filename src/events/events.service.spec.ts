import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { ClubSchema } from '../clubs/schemas/club.schema';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { EventSchema } from './schemas/event.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';

describe('EventsService', () => {
  let service: EventsService;
  let dbConnection: Connection;
  let clubModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({}),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (config: ConfigService) => ({
            uri: `mongodb+srv://${config.get('DATABASE_USER')}:${config.get(
              'DATABASE_PASSWORD',
            )}@cluster0.0gnozrq.mongodb.net/?retryWrites=true&w=majority`,
            dbName: config.get('DATABASE_NAME', 'LAU_EVENTS'),
          }),
          inject: [ConfigService],
        }),
        MongooseModule.forFeature([{ name: 'Club', schema: ClubSchema }]),
        MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
      ],
      providers: [EventsService],
    }).compile();

    service = module.get<EventsService>(EventsService);
    dbConnection = module.get(getConnectionToken());
    clubModel = module.get('ClubModel'); 
  });

  it('should return events for an existing club', async () => {
    const randomClub = await clubModel.findOne({});
    expect(randomClub).toBeDefined();

    // If a random club is found, test the getClubEvents method
    if (randomClub) {
      const events = await service.getClubEvents(randomClub._id.toString());
      expect(events).toBeInstanceOf(Array);
    }
  });

  it('should throw an error for a new club id', async () => {
    const newClub = new clubModel({
      name: 'test',
      description: 'test',
      email: 'test@gmail.com',
    });
    // Note: newClub is not saved, so _id is not valid in the database

    expect.assertions(1);
    await expect(service.getClubEvents(newClub._id.toString())).rejects.toThrow();
  });

  afterAll(async () => {
    await dbConnection.close();
  });
});
