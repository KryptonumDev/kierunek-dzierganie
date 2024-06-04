import { Controller } from 'react-hook-form';
import styles from './Select.module.scss';
import type { SelectTypes } from './Select.types';
import ReactSelect from 'react-select';
import Error from '../Error';

export default function Select<T>({ control, label, name, rules, options, errors, defaultValue, tabIndex = 0 }: SelectTypes<T>) {
  return (
    <label className={styles['select']}>
      <p>
        <span dangerouslySetInnerHTML={{ __html: label }} />
        <Error error={errors[name]?.message?.toString()} />
      </p>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value, ref } }) => (
          <ReactSelect
            ref={ref}
            // components={{ DropdownIndicator, NoOptionsMessage }}
            className='select'
            classNamePrefix='select'
            options={options}
            value={options.find((c: { value: string }) => c.value === value)}
            onChange={(val) => onChange(val!.value)}
            placeholder=''
            defaultValue={defaultValue}
            tabIndex={tabIndex}
          />
        )}
      />
    </label>
  );
}
