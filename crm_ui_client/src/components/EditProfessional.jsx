import {useEffect, useState} from "react";
import {EmploymentState, Professional} from "../api/crm/dto/Professional.ts";
import ProfessionalAPI from "../api/crm/ProfessionalAPI.js";
import {useNavigate, useParams} from "react-router-dom";

function EditProfessional({currentUser}) {
    const {contactId} = useParams()
    const navigate = useNavigate()

    const [professional, setProfessional] = useState(null);
    const [newProfessional, setNewProfessional] = useState(new Professional(null, [], EmploymentState.Unemployed, 0, "", null, null));
    const [skills, setSkills] = useState(null);
    const [load, setLoad] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!load && contactId) {
            ProfessionalAPI.GetProfessionalById(contactId).then((res) => {
                setProfessional(res)
                setSkills(Array.from(professional.skills).length > 1 ? Array.from(professional.skills).concat(',') : Array.from(professional.skills)[0])
                setLoad(true)
            }).catch((err) => {
                console.log(err)
                setLoad(true)
            });
        }
    }, [contactId, load, professional]);

    const handleSaveProfessional = async () => {
        try {
            if (!professional) {
                await ProfessionalAPI.InsertNewProfessional(contactId, new Professional(null, newProfessional.skills.split(','), EmploymentState.Unemployed, newProfessional.dailyRate, newProfessional.location, null, null), currentUser.xsrfToken);
                alert("New professional profile created successfully!");
                navigate("/ui/Professionals")
            } else {
                await ProfessionalAPI.UpdateProfessional({
                    ...professional,
                    skills: new Set(skills.split(','))
                }, currentUser.xsrfToken);
                alert("Professional profile updated successfully!");
                navigate(`/ui/Contacts/${contactId}`)
            }
        } catch (e) {
            setError("Failed to save contact");
            console.error(e);
        }
    };

    if (!load) return <h2
        className={"flex-1 flex justify-center text-center items-center text-2xl font-semibold text-blue-500"}>Loading...</h2>;
    if (error) return <h2
        className={"flex-1 flex justify-center text-center items-center text-2xl font-semibold text-red-500"}>{error}</h2>;

    const handleChange = (event) => {
        event.preventDefault()

        const {name, value} = event.target;

        if (professional) {
            setProfessional((old) => ({
                ...old,
                [name]: value
            }));
        } else {
            setNewProfessional((old) => ({
                ...old,
                [name]: value
            }));
        }
    }
    return (
        <div className={"flex-1 p-6 flex items-center w-full justify-around"}>
            <div className={"flex h-full flex-col items-center justify-around"}>
                <h2 className={"text-2xl font-semibold"}>{professional ? "Edit Professional" : "Insert new Professional"}</h2>
                <div className={"flex w-full justify-around gap-8"}>
                    <div className={"flex flex-col gap-6 justify-around"}>
                        <div className={"col-field"}>
                            <strong>Skills:</strong>
                            <input
                                name="skills"
                                type="text"
                                placeholder={"Skill separated by \",\""}
                                value={professional ? skills : newProfessional.skills}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={"col-field"}>
                            <strong>Daily Rate:</strong>
                            <input
                                name="dailyRate"
                                type="number"
                                value={professional ? professional?.dailyRate : newProfessional.dailyRate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={"col-field"}>
                            <strong>Location:</strong>
                            <input
                                name="location"
                                type="text"
                                value={professional ? professional?.location : newProfessional.location}
                                onChange={handleChange}
                            />
                        </div>
                        {professional &&
                            <div className={"col-field"}>
                                <strong>Employment State:</strong>
                                <select
                                    name="employmentState"
                                    onChange={handleChange}>
                                    <option value={EmploymentState.NotAvailable}>Not Available</option>
                                    <option value={EmploymentState.Employed}>Employed</option>
                                    <option value={EmploymentState.Unemployed}>Unemployed</option>
                                </select>
                            </div>
                        }

                    </div>
                </div>
                <div>
                    <button className={'page-button'}
                            onClick={handleSaveProfessional}>{professional ? "Save Changes" : "Create"}</button>
                </div>
            </div>
        </div>
    );
}

export default EditProfessional;
