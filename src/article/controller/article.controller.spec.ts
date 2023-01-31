import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from '../service/article.service';
import { ArticleController } from './article.controller';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { Repository } from 'typeorm';
import { ArticleIF } from '../model/article.interface'
import { of } from 'rxjs';
import { AppDataSource } from 'src/data-source';
// import { AppModule } from '../../app.module';

describe('ArticleService', () => {
    let service: ArticleService;
    let repo: Repository<ArticleEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        imports: [TypeOrmModule.forFeature([ArticleEntity])],
        // imports: [ArticleEntity, Repository],
        // imports: [AppModule],
        providers: [ArticleService],
        }).compile();

        service = module.get<ArticleService>(ArticleService);
        repo = module.get<Repository<ArticleEntity>>(Repository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repo).toBeDefined();
    });


    describe('create', () => {
        it('should create a new article', async () => {
            const date = new Date()
          // set up test data
            const article: ArticleIF = { title: 'Test Title', body: 'Test Body', created_at: date, updated_at: date };

            // mock the repository's save method
            jest.spyOn(repo, 'save').mockResolvedValue(article);

            // call the service's create method
            const result = await service.create(article);

            // assert that the repository's save method was called with the correct data
            expect(repo.save).toHaveBeenCalledWith(article);

            // assert that the service's create method returns the correct data
            expect(result).toEqual(of(article));
        });
    });

    // describe('generateSlug', () => {
    //     it('should generate a slug from the title', async () => {
    //     // set up test data
    //     const title = 'Test Title';
    //     const expectedSlug = 'test-title';
    //     // call the service's generateSlug method
    //     const result = await service.generateSlug(title);

    //     // assert that the service's generateSlug method returns the correct data
    //     expect(result).toEqual(of(expectedSlug));
    //     });
    // });

    // describe('findOne', () => {
    //     it('should find an article by id', async () => {
    //         // set up test data
    //         const id = 1;
    //         const article: ArticleIF = { id: 1, title: 'Test Title', body: 'Test Body' };

    //         // mock the repository's findOneById method
    //         jest.spyOn(repo, 'findOneById').mockResolvedValue(article);

    //         // call the service's findOne method
    //         const result = await service.findOne(id);

    //         // assert that the repository's findOneById method was called with the correct id
    //         expect(repo.findOneById).toHaveBeenCalledWith(id);

    //         // assert that the service's findOne method returns the correct data
    //         expect(result).toEqual(of(article));
    //     });
    // });
});

// describe('ArticleController', () => {
//     let controller: ArticleController;
//     let service: ArticleService;

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//         imports: [ArticleEntity, Repository, String],
//         controllers: [ArticleController],
//         providers: [ArticleService],
//         }).compile();

//         controller = module.get<ArticleController>(ArticleController);
//         service = module.get<ArticleService>(ArticleService);
//     });

//     it('should be defined', () => {
//         expect(controller).toBeDefined();
//         expect(service).toBeDefined();
//     });

//     describe('findAll', () => {
//         it('should return "findAll"', () => {
//             const result = controller.findAll();
//             expect(result).toEqual('findAll');
//         });
//     });

//     describe('findOne', () => {
//         it('should call the service\'s findOne method and return the result', async () => {
//             // set up test data
//             const id = 1;
//             const article: ArticleIF = { id: id, title: 'Test Title', body: 'Test Body' };

//             // mock the service's findOne method
//             jest.spyOn(service, 'findOne').mockReturnValue(of(article));

//             // call the controller's findOne method
//             const result = await controller.findOne(id);

//             // assert that the service's findOne method was called with the correct id
//             expect(service.findOne).toHaveBeenCalledWith(id);

//             // assert that the controller's findOne method returns the correct data
//             expect(result).toEqual(of(article));
//         });
//     });
//     describe('create', () => {
//         it('should call the service\'s create method and return the result', async () => {
//             // set up test data
//             const article: ArticleIF = { title: 'Test Title', body: 'Test Body' };

//             // mock the service's create method
//             jest.spyOn(service, 'create').mockReturnValue(of(article));

//             // call the controller's create method
//             const result = await controller.create(article);

//             // assert that the service's create method was called with the correct data
//             expect(service.create).toHaveBeenCalledWith(article);

//             // assert that the controller's create method returns the correct data
//             expect(result).toEqual(of(article));
//         });
//     });
// });
