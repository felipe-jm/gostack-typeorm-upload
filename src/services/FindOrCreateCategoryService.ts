import { getRepository } from 'typeorm';

import Category from '../models/Category';

interface Request {
  title: string;
}

class FindOrCreateCategory {
  public async execute({ title }: Request): Promise<Category> {
    const categoriesRepository = getRepository(Category);

    const existingCategory = await categoriesRepository.findOne({
      where: { title },
    });

    if (!existingCategory) {
      const category = categoriesRepository.create({
        title,
      });

      await categoriesRepository.save(category, { reload: true });

      return category;
    }

    return existingCategory;
  }
}

export default FindOrCreateCategory;
