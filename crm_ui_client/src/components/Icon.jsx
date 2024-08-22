
import { orIcons } from '../assets/icon'; // Assicurati che il percorso sia corretto

// eslint-disable-next-line react/prop-types
function Icon ({name, className}){
    const iconPath = orIcons[name] || '';
    console.log(name)
    return (

        <svg className={className} viewBox="0 0 24 24">
            <path d={iconPath} />
        </svg>
    );
}

export default Icon;
