import { good_categories } from './seed_good_categories';

interface SeedGood {
  id: number;
  title: string;
  description: string;
  price: number;
  category_id: number;
}

const generateGoods = (): SeedGood[] => {
  const goods: SeedGood[] = [];
  let idCounter = 1;

  for (const category of good_categories) {
    for (let i = 1; i <= 10; i++) {
      goods.push({
        id: idCounter++,
        title: `Продукт ${idCounter}`,
        description: 'Очень хороший товар!',
        price: 100,
        category_id: category.id, // Привязка к категории
      });
    }
  }

  return goods;
};

export const goods = generateGoods();
