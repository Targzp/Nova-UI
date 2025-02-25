import { Arrayable } from '@nova-ui/utils'
import { FormItemContxt } from './form-item'

export const filterFields = (
  fields: FormItemContxt[],
  props: Arrayable<string>
) => {
  const _props = Array.isArray(props) ? props : [props]
  if (_props.length > 0) {
    return fields.filter(field => {
      return field.prop && _props.includes(field.prop)
    })
  } else {
    return fields
  }
}
