import styles from './VideoSection.module.scss';
import type { VideoSectionTypes } from './VideoSection.types';

const VideoSection = ({ title, video }: VideoSectionTypes) => {
  return (
    <section className={styles['VideoSection']}>
      <iframe
        style={{ width: '100%', height: '100%' }}
        src={video}
        title={title}
        allow='fullscreen; picture-in-picture'
      />
    </section>
  );
};

export default VideoSection;
