import Img from '@/components/ui/image';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import styles from './Header.module.scss';
import type { NavListProps } from './Header.types';

export default function NavList({
  columns,
  additionalLinks,
  name,
  handleClose,
  ChevronBackIcon,
  ChevronDownIcon,
  handleMenu,
  type,
}: NavListProps) {
  const [openTab, setOpenTab] = useState<number | null>(null);

  const handleLinkClick = () => {
    handleClose();
    setOpenTab(null);
    handleMenu();
  };

  return (
    <div className={styles.open}>
      <div className='max-width'>
        <div>
          {columns.map(({ name, href, items, showMore }, i) => (
            <nav key={i}>
              <Link href={href}>{name}</Link>
              {items?.length ? (
                items?.map(({ name, slug, image }, i) => (
                  <Link
                    className={styles.open_item}
                    key={i}
                    href={href + (type === 'courses' ? `/${slug.current}` : `?rodzaj=${slug.current}`)}
                  >
                    <Img
                      data={image}
                      sizes=''
                    />
                    <span>{name}</span>
                  </Link>
                ))
              ) : (
                <span className={styles.emptyText}>Oferta pusta</span>
              )}
              {!!showMore && (
                <Link
                  className={styles.showMore}
                  href={href}
                >
                  {showMore}
                </Link>
              )}
            </nav>
          ))}
        </div>
        <nav>
          {additionalLinks.map(({ name, href }, i) => (
            <Link
              key={i}
              href={href}
            >
              {name}
            </Link>
          ))}
        </nav>
      </div>
      <div className={styles.listMobile}>
        <button
          className={styles['back-btn']}
          onClick={handleClose}
        >
          {ChevronBackIcon}
          <span>{name}</span>
        </button>
        <nav>
          {columns.map(({ name, href, items, showMore }, i) => {
            return (
              <Fragment key={i}>
                <button
                  className={styles.listMobile_btn}
                  onClick={() => setOpenTab(i)}
                >
                  <span>{name}</span>
                  {ChevronDownIcon}
                </button>
                {openTab === i && (
                  <div className={styles.openItems}>
                    <button
                      className={styles['back-btn']}
                      onClick={() => setOpenTab(null)}
                    >
                      {ChevronBackIcon}
                      <span>{name}</span>
                    </button>
                    <nav>
                      {items?.map(({ name, slug, image }, i) => {
                        return (
                          <Link
                            className={styles.open_item}
                            onClick={handleLinkClick}
                            key={i}
                            href={`${href}/${slug.current}`}
                          >
                            <Img
                              data={image}
                              sizes=''
                            />
                            <span>{name}</span>
                          </Link>
                        );
                      })}
                      {!items?.length && <span className={styles.empty}>Oferta pusta</span>}
                      {showMore && (
                        <Link
                          className={styles.showMore}
                          onClick={handleLinkClick}
                          href={href}
                        >
                          {showMore}
                        </Link>
                      )}
                    </nav>
                  </div>
                )}
              </Fragment>
            );
          })}
          {additionalLinks.map(({ name, href }, i) => {
            return (
              <Link
                onClick={handleLinkClick}
                href={href}
                key={i}
              >
                {name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
