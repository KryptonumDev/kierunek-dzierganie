import styles from './VideoSection.module.scss';
import type { VideoSectionTypes } from './VideoSection.types';

const VideoSection = ({ video }: VideoSectionTypes) => {
  return (
    <section className={styles['VideoSection']}>
      <video
        controls
        className={styles.video}
      >
        <source
          src={video.asset.url}
          type='video/mp4'
        />
      </video>
    </section>
  );
};

export default VideoSection;
