'use client';
import { useEffect, useMemo, useState } from 'react';
import styles from './HeroVoucher.module.scss';
import type { Props } from './HeroVoucher.types';
import { ImgType } from '@/global/types';
import AddToCart from '@/components/ui/AddToCart';
import { formatPrice } from '@/utils/price-formatter';
import Gallery from '@/components/ui/Gallery';
import { Hearth, PayPo } from '@/components/ui/Icons';
import Radio from '@/components/ui/Radio';

const gtag: Gtag.Gtag = function () {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer?.push(arguments);
};

const HeroVoucher = ({ data }: Props) => {
  const [voucherData, setVoucherData] = useState<{
    amount: number;
    selectedOption: 'one' | 'two' | 'three' | 'four' | 'other';
    dedication: { from: string; to: string; message: string } | null;
    type: 'PHYSICAL' | 'DIGITAL';
  }>({
    amount: 10000,
    selectedOption: 'one',
    dedication: {
      from: '',
      to: '',
      message: '',
    },
    type: 'DIGITAL',
  });
  const [dedicationOpen, setDedicationOpen] = useState(true);

  const allParametersAdded = useMemo(() => {
    let passed = true;
    if (
      dedicationOpen &&
      (!voucherData.dedication?.from || !voucherData.dedication?.to || !voucherData.dedication?.message)
    ) {
      passed = false;
    }

    if (voucherData.selectedOption === 'other' && !voucherData.amount) {
      passed = false;
    }

    return passed;
  }, [voucherData, dedicationOpen]);

  const images = useMemo(() => {
    const images: Array<{ data: ImgType | string; type: 'video' | 'image' }> = [];
    // add video as first element if exists
    if (data?.featuredVideo) images.push({ type: 'video', data: data?.featuredVideo });
    data?.gallery!.forEach((el) => images.push({ type: 'image', data: el }));
    return images;
  }, [data]);

  useEffect(() => {
    const product_id = data._id;
    const product_name = data.name;
    const product_price = voucherData.amount / 100;

    const timeoutId = setTimeout(() => {
      if (typeof fbq !== 'undefined') {
        fbq('track', 'ViewContent', {
          content_ids: [product_id],
          content_name: product_name,
          contents: [{
            id: product_id,
            item_price: product_price,
            quantity: 1,
          }],
          content_type: 'product',
          value: product_price,
          currency: 'PLN',
        });
      }
      gtag('event', 'view_item', {
        currency: 'PLN',
        value: product_price,
        items: [
          {
            id: product_id,
            name: product_name,
            price: product_price,
            item_category: 'voucher',
          },
        ],
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [data._id, data.name, voucherData.amount]);

  return (
    <section className={styles['HeroPhysical']}>
      <Gallery images={images} />
      <div className={styles['info']}>
        {data.rating !== undefined && data.reviewsCount > 0 ? (
          <p className={styles['rating']}>
            <Hearth />{' '}
            <span>
              <b>{data.rating}</b>/5 ({data.reviewsCount})
            </span>
          </p>
        ) : (
          <p className={styles['rating']}>
            <Hearth /> <span>Brak opinii</span>
          </p>
        )}
        <h1>{data.name}</h1>
        <div className={styles['selects']}>
          <label
            className={styles['radio']}
            data-active={voucherData.selectedOption === 'one'}
          >
            <input
              defaultChecked={voucherData.selectedOption === 'one'}
              onChange={() => setVoucherData({ ...voucherData, amount: 10000, selectedOption: 'one' })}
              value={10000}
              name='10000'
              type='radio'
            />
            <span>{formatPrice(10000)}</span>
          </label>
          <label
            className={styles['radio']}
            data-active={voucherData.selectedOption === 'two'}
          >
            <input
              defaultChecked={voucherData.selectedOption === 'two'}
              onChange={() => setVoucherData({ ...voucherData, amount: 20000, selectedOption: 'two' })}
              value={20000}
              name='20000'
              type='radio'
            />
            <span>{formatPrice(20000)}</span>
          </label>
          <label
            className={styles['radio']}
            data-active={voucherData.selectedOption === 'three'}
          >
            <input
              defaultChecked={voucherData.selectedOption === 'three'}
              onChange={() => setVoucherData({ ...voucherData, amount: 30000, selectedOption: 'three' })}
              value={30000}
              name='30000'
              type='radio'
            />
            <span>{formatPrice(30000)}</span>
          </label>
          <label
            className={styles['radio']}
            data-active={voucherData.selectedOption === 'four'}
          >
            <input
              defaultChecked={voucherData.selectedOption === 'four'}
              onChange={() => setVoucherData({ ...voucherData, amount: 40000, selectedOption: 'four' })}
              value={40000}
              name='40000'
              type='radio'
            />
            <span>{formatPrice(40000)}</span>
          </label>
          <label
            className={styles['input']}
            data-active={voucherData.selectedOption === 'other'}
          >
            <input
              defaultChecked={voucherData.selectedOption === 'other'}
              value={'other'}
              name='other'
              type='radio'
            />
            <label>
              Inna kwota:
              <div>
                <input
                  min={0}
                  type='number'
                  onChange={(e) =>
                    setVoucherData({
                      ...voucherData,
                      amount: Number(e.currentTarget.value) * 100,
                      selectedOption: 'other',
                    })
                  }
                />
                <span>zł</span>
              </div>
            </label>
          </label>
        </div>
        <div className={styles['dedication']}>
          <div className={styles['labels']}>
            <label data-active={dedicationOpen}>
              <input
                type='radio'
                value='open'
                defaultChecked={dedicationOpen}
                onChange={() => {
                  setDedicationOpen(true);
                  setVoucherData({
                    ...voucherData,
                    dedication: {
                      from: '',
                      to: '',
                      message: '',
                    },
                  });
                }}
              />
              Z dedykacją
            </label>
            <label data-active={!dedicationOpen}>
              <input
                type='radio'
                value='closed'
                defaultChecked={!dedicationOpen}
                onChange={() => {
                  setDedicationOpen(false);
                  setVoucherData({
                    ...voucherData,
                    dedication: null,
                  });
                }}
              />
              Bez dedykacji
            </label>
          </div>
          {dedicationOpen && (
            <div className={styles['dedication-form']}>
              <div className={styles['flex']}>
                <label>
                  <span>Od:</span>
                  <input
                    placeholder='Imię'
                    value={voucherData.dedication?.from}
                    onChange={(e) =>
                      setVoucherData({
                        ...voucherData,
                        dedication: {
                          ...voucherData.dedication!,
                          from: e.currentTarget.value,
                        },
                      })
                    }
                  />
                </label>
                <label>
                  <span>Do:</span>
                  <input
                    placeholder='Imię'
                    value={voucherData.dedication?.to}
                    onChange={(e) =>
                      setVoucherData({
                        ...voucherData,
                        dedication: {
                          ...voucherData.dedication!,
                          to: e.currentTarget.value,
                        },
                      })
                    }
                  />
                </label>
              </div>
              <label>
                <span>Twoja wiadomość:</span>
                <textarea
                  value={voucherData.dedication?.message}
                  onChange={(e) =>
                    setVoucherData({
                      ...voucherData,
                      dedication: {
                        ...voucherData.dedication!,
                        message: e.currentTarget.value,
                      },
                    })
                  }
                  placeholder='Podaruj szczyptę miłości i ciepła '
                  rows={2}
                />
              </label>
            </div>
          )}
        </div>
        <div className={styles['radios']}>
          <Radio
            defaultChecked={voucherData.type === 'DIGITAL'}
            onChange={() => setVoucherData({ ...voucherData, type: 'DIGITAL' })}
            label='<span>Wydrukuj i wręcz osobiście</span><small>Wyślemy e-maila z kartą podarunkową w pliku .pdf do wydrukowania na adres e-mail</small>'
            register={{ name: 'test' }}
            errors={{}}
          />
          <Radio
            defaultChecked={voucherData.type === 'PHYSICAL'}
            onChange={() => setVoucherData({ ...voucherData, type: 'PHYSICAL' })}
            label='<span>Chcę dostać voucher w formie fizycznej</span><small>Dodaj kartę podarunkową do koszyka, a my dostarczymy ją pod Twoje drzwi.</small>'
            register={{ name: 'test' }}
            errors={{}}
          />
        </div>
        <div className={styles['add-to-cart']}>
          <p className={styles['pay-po']}>
            Kup dzisiaj i zapłać za 30 dni z PayPo
            <PayPo />
          </p>
          <AddToCart
            id={data._id}
            disabled={!allParametersAdded}
            quantity={1}
            voucherData={voucherData}
            data={{
              price: voucherData.amount * 100,
              _id: data._id,
              name: data.name,
              _type: 'voucher',
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroVoucher;
