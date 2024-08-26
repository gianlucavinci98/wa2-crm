
import { orIcons } from '../assets/icon'; // Assicurati che il percorso sia corretto

// eslint-disable-next-line react/prop-types
function Icon ({name, className, onClick}){
    const iconPath = orIcons[name] || '';
    console.log(name)
    return (

        <svg className={className} viewBox="0 0 24 24" onClick={onClick}>
            <path d={iconPath} />
        </svg>
    );
}

export default Icon;
