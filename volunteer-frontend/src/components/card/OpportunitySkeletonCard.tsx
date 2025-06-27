import styles from './OpportunitySkeletonCard.module.css';

const OpportunitySkeletonCard = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={`${styles.skeleton} ${styles.skeletonTitle}`}></div>
      <div className={`${styles.skeleton} ${styles.skeletonLine}`}></div>
      <div className={`${styles.skeleton} ${styles.skeletonLine}`}></div>
      <div className={`${styles.skeleton} ${styles.skeletonLineHalf}`}></div>
      <div className={styles.skeletonActions}>
        <div className={`${styles.skeleton} ${styles.skeletonButton}`}></div>
        <div className={`${styles.skeleton} ${styles.skeletonSaveIcon}`}></div>
      </div>
    </div>
  );
};

export default OpportunitySkeletonCard;