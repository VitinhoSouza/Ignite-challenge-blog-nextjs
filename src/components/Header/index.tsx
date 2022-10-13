import styles from './header.module.scss';
import Link from "next/link";

export default function Header() {
  return (
    <Link href="/">
      <a href="/" className={styles.containerHeader}>
        <img src="/logo.svg" alt="logo" />
      </a>
    </Link>
  );
}
