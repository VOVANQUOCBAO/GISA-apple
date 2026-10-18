import styles from './site-shell.module.css';

export function LanguageControl() {
  return (
    <div aria-label="Ngôn ngữ" className={styles.languageControl} role="group">
      <span aria-current="true">VI</span>
      <button aria-describedby="english-status" disabled type="button">
        EN
      </button>
      <span className={styles.visuallyHidden} id="english-status">
        Bản tiếng Anh chưa có
      </span>
    </div>
  );
}
