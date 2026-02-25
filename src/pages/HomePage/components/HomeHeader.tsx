import CategoryFilter from '../../../components/CategoryFilter/CategoryFilter';
import type { Category } from '../../../constants/category';
import styles from '../HomePage.module.scss';

interface HomeHeaderProps {
  title: string;
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
}

export const HomeHeader = ({ title, activeCategory, onSelectCategory }: HomeHeaderProps) => (
  <header className={styles.header}>
    <h1 className={styles.title}>{title}</h1>
    <CategoryFilter activeCategory={activeCategory} onSelect={onSelectCategory} />
  </header>
);

