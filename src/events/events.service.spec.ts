import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { ClubSchema } from '../clubs/schemas/club.schema';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { EventSchema } from './schemas/event.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';

describe('EventsService - GET club events', () => {
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

  it('should throw an error for an invalid club', async () => {
    const newClub = new clubModel({
      name: 'test',
      description: 'test',
      email: 'test@gmail.com',
    });
    // Note: newClub is not saved, so _id is not valid in the database
    expect.assertions(1);
    return service.getClubEvents(newClub._id.toString()).catch(error => expect(error.status).toBe(404));
  });
  

  
  afterAll(async () => {
    await dbConnection.close();
  });
});



// describe('EventsService - POST club event', () => {
//   let service: EventsService;
//   let mockClubModel;
//   let mockEventModel;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         EventsService,
//         {
//           provide: 'EventModel',
//           useValue: {
//             findOne: jest.fn(),
//             create: jest.fn().mockImplementation((dto) => dto),
//           },
//         },
//         {
//           provide: 'ClubModel',
//           useValue: {
//             findById: jest.fn().mockResolvedValue({ /* Mock club data */ }),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<EventsService>(EventsService);
//     mockEventModel = module.get('EventModel');
//     mockClubModel = module.get('ClubModel');
//   });

//   it('should create an event for an existing club', async () => {
//     const clubId = 'existing-club-id'; // Mock existing club ID
//     const eventDto = {
//       name: 'New Event',
//       // ... other properties of the event ...
//       clubs: [clubId],
//     };

//     // Setup mocks
//     mockClubModel.findById.mockResolvedValue({ _id: clubId }); // Mock existing club
//     mockEventModel.findOne.mockResolvedValue(null); // No existing event with the same name

//     // Perform the test
//     const createdEvent = await service.createEvent(eventDto);

//     // Assertions
//     expect(mockEventModel.findOne).toHaveBeenCalledWith({ name: { $regex: eventDto.name, $options: 'i' } });
//     expect(mockClubModel.findById).toHaveBeenCalledWith(clubId);
//     expect(createdEvent).toBeDefined();
//     expect(createdEvent.clubs).toContain(clubId);
//   });

//   it('should throw an error as name is already taken', () => {
//     mockEventModel.findOne.mockResolvedValue({ 
//       start_date: '2021-01-01'
//     }); // event exist
            
//     const event = new CreateEventDto();
//     expect.assertions(1);
//     // return service.getClubEvents(service.createEvent(event)).catch(error => expect(error.status).toBe(404));
//   })
// });


