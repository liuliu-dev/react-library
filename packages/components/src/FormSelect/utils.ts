import { Maybe } from "@dolthub/web-utils";
import {
  GroupBase,
  OnChangeValue,
  OptionsOrGroups,
  PropsValue,
} from "react-select";
import { OnChange, Option, OptionTypeBase, Props } from "./types";

// Converts custom onChangeValue function to onChange function for react-select
export function getOnChange<
  T,
  OptionType extends OptionTypeBase<T>,
  IsMulti extends boolean,
>(
  onChangeValue: (e: Maybe<T>) => void,
): OnChange<T, OptionType, IsMulti> | undefined {
  return (e: OnChangeValue<OptionType, IsMulti>) => {
    if (!e) {
      onChangeValue(null);
      return;
    }
    onChangeValue((e as OptionType).value);
  };
}

// Searches options array for OptionType that matches val. If provided, uses
// `getValFunc` for matching. The default matching function checks for val ===
// option.value
export function getValueForOptions<T, OptionType extends OptionTypeBase<T>>(
  val: Maybe<T>,
  options: OptionType[],
  getValFunc?: (o: T, v: T) => boolean,
): OptionType | null {
  const equal = (o: T, v: T): boolean => {
    if (getValFunc) {
      return getValFunc(o, v);
    }
    return o === v;
  };

  return val !== undefined && val !== null
    ? options[options.findIndex(x => equal(x.value, val))]
    : null;
}

// Given a value that is currently selected and a list of all options,
// move the selected option (determined by value) to the top of the list.
export function moveSelectedToTop<T, OptionType extends OptionTypeBase<T>>(
  selectedVal: Maybe<T>,
  options: OptionType[],
): OptionType[] {
  if (!selectedVal) {
    return options;
  }

  const i = options.findIndex(({ value }) => value === selectedVal);
  // If no value was found for the given selected value, return the original array.
  if (i < 0) {
    return options;
  }
  const selectedOption = options[i];
  const optionsCopy = [...options];
  optionsCopy.splice(i, 1);
  optionsCopy.unshift(selectedOption);
  return optionsCopy;
}

export function getValue<T>(
  props: Props<T, Option<T>, false>,
  options: OptionsOrGroups<Option<T>, GroupBase<Option<T>>> & Array<Option<T>>,
): PropsValue<Option<T>> | undefined {
  const valueFromOptions = getValueForOptions<T, Option<T>>(
    props.val,
    options,
    props.getValFunc,
  );

  if (props.useValueAsSingleValue && props.val) {
    return { value: props.val, label: String(props.val) };
  }

  return valueFromOptions;
}