import { Link } from "react-router";
import styles from "./NotFound.module.css";

function NotFound() {
  return (
    <div className={styles.notFoundBody}>
      <div className={styles.errorContent}>
        <div className={styles.errorNumber}>404</div>
        <h1 className={styles.errorTitle}>Oops!</h1>
        <p className={styles.errorSubtitle}>
          Looks like this page is lost too :(
        </p>
        <Link to="/" className={styles.homeButton}>
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
