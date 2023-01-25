import { ArticleController } from './article.controller';
import { ArticleService } from '../service/article.service';
import { ArticleEntity } from '../entities/article.entity';
import { Repository } from 'typeorm';
import { TestingModule, Test } from '@nestjs/testing';
import { of } from 'rxjs';

describe('ArticleService', () => {
    // let ac: ArticleController;
    let service: ArticleService;
    let repo: Repository<ArticleEntity>

    beforeEach(async() => {
        // as = new ArticleService(Repository<ArticleEntity>)
        const module: TestingModule = await Test.createTestingModule({
            providers: [ArticleService]
        }).compile();

        service = module.get<ArticleService>(ArticleService);
        repo = module.get<Repository<ArticleEntity>>(Repository);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repo).toBeDefined();
    });

    describe('create', () => {
        it('should create a new article', () => {
            // set up test data
            const article = { title: 'Test Title', body: 'Test Body' };

            // mock the repository's save method
            jest.spyOn(repo, 'save').mockResolvedValue(article);

            // call the service's create method
            const result = service.create(article);

            // assert that the repository's save method was called with the correct data
            expect(repo.save).toHaveBeenCalledWith(article);

            // assert that the service's create method returns the correct data
            expect(result).toEqual(of(article));
        });
    });

    describe('findOne', () => {
        it('should find one article by id', () => {
        // set up test data
        const article = { id: 1, title: 'Test Title', body: 'Test Body' };

        // mock the repository's findOneById method
        jest.spyOn(repo, 'findOneById').mockResolvedValue(article);

        // call the service's findOne method
        const result = service.findOne(1);

        // assert that the repository's findOneById method was called with the correct id
        expect(repo.findOneById).toHaveBeenCalledWith(1);

        // assert that the service's findOne method returns the correct data
        expect(result).toEqual(of(article));
        });
    });
});

describe('ArticleController', () => {
    let controller: ArticleController;
    let service: ArticleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ArticleController],
            providers: [ArticleService],
        }).compile();

        controller = module.get<ArticleController>(ArticleController);
        service = module.get<ArticleService>(ArticleService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return "findAll"', () => {
            const result = controller.findAll();
            expect(result).toEqual('findAll');
        });
    });

    describe('findOne', () => {
        it('should call the service\'s findOne method and return the result', () => {
            // set up test data
            const article = { id: 1, title: 'Test Title', body: 'Test Body' };

            // mock the service's findOne method
            jest.spyOn(service, 'findOne').mockReturnValue(of(article));

            // call the controller's findOne method
            const result = controller.findOne(1);

            // assert that the service's findOne method was called with the correct id
            expect(service.findOne).toHaveBeenCalledWith(1);

            // assert that the controller's findOne method returns the correct data
            expect(result).toEqual(of(article));
        });
    });
    describe('create', () => {
        it('should call the service\'s create method and return the result', () => {
            // set up test data
            const article = { title: 'Test Title', body: 'Test Body' };

            // mock the service's create method
            jest.spyOn(service, 'create').mockReturnValue(of(article));

            // call the controller's create method
            const result = controller.create(article);
            // assert that the service's create method was called with the correct data
            expect(service.create).toHaveBeenCalledWith(article);

            // assert that the controller's create method returns the correct data
            expect(result).toEqual(of(article));
        });
    });
});
