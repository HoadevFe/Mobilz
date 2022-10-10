import { Checkbox, CheckboxProps, Radio, RadioProps, SvgIcon } from '@mui/material';
import styles from './style.module.scss';
import { IndeterminateCheckBoxRounded, CheckBoxRounded } from '@mui/icons-material';
import clsx from 'clsx';

type LabelProps = {
  label?: string
}
export const CheckBox = (props: CheckboxProps & LabelProps) => {
  const { className, classes, label, disabled, ...rest } = props
  return (
    <>
      <Checkbox
        {...rest}
        className={clsx(styles.Checkbox, className)}
        classes={{
          root: styles.BaseRoot,
          checked: styles.CheckboxChecked,
          disabled: styles.CheckboxDisabled,
          indeterminate: styles.Indeterminate,
          ...classes
        }}
        checkedIcon={<SvgIcon component={CheckBoxRounded} />}
        indeterminateIcon={<SvgIcon component={IndeterminateCheckBoxRounded} />}
      />
      {label && (
        <label className={clsx(styles.Body1, styles.label, `${disabled && styles.labelDisabled}`, className)}>
          {label}
        </label>
      )}
    </>
  );
};

export const RadioButton = (props: RadioProps) => {
  const { className, classes, ...rest } = props;
  return (
    <Radio
      {...rest}
      className={clsx(styles.RadioButton, className)}
      classes={{
        root: styles.BaseRoot,
        checked: styles.RadioChecked,
        disabled: styles.RadioDisabled,
        ...classes
      }}
    />
  );
};