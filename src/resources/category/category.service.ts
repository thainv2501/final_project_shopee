import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);
    return { category };
  }

  async findAll() {
    return await this.categoryRepository.find({ relations: ['products'] });
  }

  async getCategory(
    fields: FindOptionsWhere<Category> | FindOptionsWhere<Category>[],
    relationOptions?: string[],
  ) {
    return await this.categoryRepository.findOne({
      where: fields,
      relations: relationOptions,
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.getCategory({ id });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    await this.categoryRepository.update({ id }, updateCategoryDto);
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
