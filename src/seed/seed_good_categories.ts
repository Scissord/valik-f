type SeedGoodCategory = {
  id: number;
  name: string;
  parent_id: number | null;
  slug: string;
};

const generateGoodCategories = (): SeedGoodCategory[] => {
  const good_categories: SeedGoodCategory[] = [];
  let idCounter = 1;

  for (let i = 1; i <= 10; i++) {
    const level1Id = idCounter;
    good_categories.push({
      id: idCounter++,
      name: `Категория ${i}`,
      parent_id: null,
      slug: `category_${i}`,
    });

    for (let j = 1; j <= 10; j++) {
      const level2Id = idCounter;
      good_categories.push({
        id: idCounter++,
        name: `Категория ${i}.${j}`,
        parent_id: level1Id,
        slug: `category_${i}_${j}`,
      });

      for (let k = 1; k <= 10; k++) {
        good_categories.push({
          id: idCounter++,
          name: `Категория ${i}.${j}.${k}`,
          parent_id: level2Id,
          slug: `category_${i}_${j}_${k}`,
        });
      }
    }
  }

  return good_categories;
};

export const good_categories = generateGoodCategories();
