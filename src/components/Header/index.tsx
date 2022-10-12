import styles from './header.module.scss';

export default function Header() {
  return (
    <a href="/" className={styles.containerHeader}>
      <img src="logo.svg" alt="logo" />
    </a>
  );
}
