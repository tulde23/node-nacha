/** Type Helper */
export type CamelToTitleCase<Text extends string, $Acc extends string = ''> = Text extends `${infer $Ch}${infer $Rest}` ? Text extends Capitalize<Text> ? CamelToTitleCase<$Rest, `${Capitalize<$Acc>} ${Capitalize<$Ch>}`> : CamelToTitleCase<$Rest, `${$Acc}${$Ch}`> : Capitalize<$Acc>;
/** Primitives */
export type NumericalString = `${number}`;
export type BaseFieldParams = {
    width: number;
    position: number;
    required: boolean;
    type: 'numeric' | 'alphanumeric' | 'alpha';
};
