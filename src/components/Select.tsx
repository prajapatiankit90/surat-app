
import { useTranslation } from 'react-i18next';

interface SelectProps {
    name?: string | any;
    values?: string | any;
    changes?: any;
    array?: any;
    optValue?: any;
    optName?: any;
    selectType? : any;
}


const Select: React.FC<SelectProps> = ({ name, values, changes, array, optName, optValue, selectType, ...rest }) => {
    return (
        <select name={name} value={values} onChange={changes} {...rest} >
            <option value="">{selectType}</option>
            {array.map((item: any, key: any) => (
                <option key={key} value={item[optValue]}>{item[optName]}</option>
            ))}
        </select>

    )
}

export default Select;