import { useCurrentChain } from '@/hooks/useChains'
import useDebounce from '@/hooks/useDebounce'
import { useAppSelector } from '@/store'
import { selectChainById } from '@/store/chainsSlice'
import { parsePrefixedAddress } from '@/utils/addresses'
import { FEATURES, hasFeature } from '@/utils/chains'
import { validatePrefixedAddress } from '@/utils/validation'
import { CircularProgress, Grid, InputAdornment, TextField, type TextFieldProps } from '@mui/material'
import type { ReactElement } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { get, useFormContext, useWatch, type Validate } from 'react-hook-form'
import ScanQRButton from '../ScanQRModal/ScanQRButton'
import useNameResolver from './useNameResolver'

export type AddressInputProps = TextFieldProps & { name: string; chainId?: string; validate?: Validate<string>; deps?: string | string[] }

const AddressInput = ({ name, chainId, validate, required = true, deps, ...props }: AddressInputProps): ReactElement => {
  const {
    register,
    setValue,
    control,
    formState: { errors },
    trigger,
  } = useFormContext()
  const currentChain = useCurrentChain()
  const chainInfo = useAppSelector((state) => selectChainById(state, chainId!))
  const rawValueRef = useRef<string>('')
  const watchedValue = useWatch({ name, control })
  const currentShortName = chainInfo?.shortName || currentChain?.shortName || ''
  const [isValidating, setIsValidating] = useState<boolean>(false)

  // Fetch an ENS resolution for the current address
  const isDomainLookupEnabled = !!currentChain && hasFeature(currentChain, FEATURES.DOMAIN_LOOKUP)
  const label = `${props.label} address${isDomainLookupEnabled ? ' or ENS' : ''}`
  const { address, resolverError, resolving } = useNameResolver(isDomainLookupEnabled ? watchedValue : '')

  // errors[name] doesn't work with nested field names like 'safe.address', need to use the lodash get
  const fieldError = resolverError || get(errors, name)

  // Debounce the field error unless there's no error or it's resolving a domain
  let error = useDebounce(fieldError, 500)
  if (resolverError) error = resolverError
  if (!fieldError || resolving) error = undefined

  // Validation function based on the current chain prefix
  const validatePrefixed = useMemo(() => validatePrefixedAddress(currentShortName), [currentShortName])

  // Update the input value
  const setAddressValue = useCallback(
    (value: string) => setValue(name, value, { shouldValidate: true }),
    [setValue, name],
  )

  // On ENS resolution, update the input value
  useEffect(() => {
    if (address) {
      setAddressValue(`${currentShortName}:${address}`)
    }
  }, [address, currentShortName, setAddressValue])

  return (
    <Grid container alignItems="center" gap={1}>
      <Grid item flexGrow={1}>
        <TextField
          {...props}
          autoComplete="off"
          label={<>{error?.message || label}</>}
          error={!!error}
          fullWidth
          spellCheck={false}
          InputProps={{
            ...(props.InputProps || {}),

            // Display the current short name in the adornment, unless the value contains the same prefix
            startAdornment: !error && !rawValueRef.current.startsWith(`${currentShortName}:`) && (
              <InputAdornment position="end">{currentShortName}:</InputAdornment>
            ),

            endAdornment: (resolving || isValidating) && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            ...(props.InputLabelProps || {}),
            shrink: !!watchedValue || props.focused,
          }}
          required={required}
          {...register(name, {
            deps,

            required,

            setValueAs: (value: string): string => {
              rawValueRef.current = value
              // This also checksums the address
              return parsePrefixedAddress(value).address
            },

            validate: async () => {
              const value = rawValueRef.current
              if (value) {
                setIsValidating(true)
                const result = validatePrefixed(value) || (await validate?.(parsePrefixedAddress(value).address))
                setIsValidating(false)
                return result
              }
            },

            // Workaround for a bug in react-hook-form that it restores a cached error state on blur
            onBlur: () => setTimeout(() => trigger(name), 100),
          })}
          // Workaround for a bug in react-hook-form when `register().value` is cached after `setValueAs`
          // Only seems to occur on the `/load` route
          value={watchedValue}
        />
      </Grid>

      {!props.disabled && (
        <Grid item>
          <ScanQRButton onScan={setAddressValue} />
        </Grid>
      )}
    </Grid>
  )
}

export default AddressInput
