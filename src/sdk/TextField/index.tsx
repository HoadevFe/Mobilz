import { TextField, TextFieldProps } from '@mui/material'
import clsx from 'clsx'
import styles from './style.module.scss'

const InputBaseClasses = {
  root: styles.InputBaseRoot,
  focused: styles.InputBaseFocused,
  error: styles.InputBaseError,
  disabled: styles.InputBaseDisabled
}

const InputLabelClasses = {
  root: styles.LabelRoot,
  focused: styles.LabelFocused,
  error: styles.LabelError,
  disabled: styles.LabelDisabled
}

const FormHelperTextClasses = {
  root: styles.HelperTextRoot,
  error: styles.HelperTextError
}

const BaseInputField = (props: TextFieldProps) => {
  const { InputLabelProps, FormHelperTextProps, className, ...rest } = props

  return (
    <TextField
      {...rest}
      className={className}
      InputLabelProps={{
        shrink: true,
        classes: InputLabelClasses,
        ...InputLabelProps
      }}
      FormHelperTextProps={{
        classes: FormHelperTextClasses,
        ...FormHelperTextProps
      }}
    />
  )
}

export const LineInputField = (props: TextFieldProps) => {
  return (
    <BaseInputField
      {...props}
      variant='standard'
      className={clsx(styles.InputField, styles.LineInputField, props.className)}
      InputProps={{
        classes: {
          ...InputBaseClasses
        },
        ...props.InputProps
      }}
    />
  )
}

export const ContainerInputField = (props: TextFieldProps & { onChange?: any }) => {
  return (
    <BaseInputField
      {...props}
      variant='outlined'
      className={clsx(styles.InputField, styles.ContainerInputField, props.className)}
      InputProps={{
        classes: {
          ...InputBaseClasses,
          notchedOutline: styles.NotchedOutline
        },
        ...props.InputProps
      }}
    />
  )
}

export const TextareaField = (props: TextFieldProps) => {
  const {
    InputProps,
    InputLabelProps,
    FormHelperTextProps,
    className,
    maxRows = 4,
    minRows = 1,
    label,
    ...rest
  } = props

  return (
    <TextField
      {...rest}
      label={label}
      multiline
      maxRows={maxRows}
      minRows={minRows}
      variant='outlined'
      className={clsx(
        styles.InputField,
        styles.ContainerInputField,
        label ? styles.TextareaField : styles.TextareaNoLabel,
        className
      )}
      InputProps={{
        classes: {
          ...InputBaseClasses,
          notchedOutline: styles.NotchedOutline
        },
        ...InputProps
      }}
      InputLabelProps={{
        shrink: true,
        classes: InputLabelClasses,
        ...InputLabelProps
      }}
      FormHelperTextProps={{
        classes: FormHelperTextClasses,
        ...FormHelperTextProps
      }}
    />
  )
}
