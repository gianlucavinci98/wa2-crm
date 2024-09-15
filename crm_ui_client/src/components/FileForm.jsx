import React, {useEffect, useState} from 'react';
import DocumentStoreAPI from "../api/document_store/DocumentStoreAPI.js";
import {DocumentMetadataFilter} from "../api/document_store/filter/DocumentMetadataFilter.ts";
import {DocumentCategory} from "../api/document_store/dto/DocumentMetadata.ts";

function FileUploadForm({currentUser}) {
    const [file, setFile] = useState(null);

    const [fileList, setFileList] = useState(null);
    const [load, setLoad] = useState(false);

    // Funzione per gestire il cambiamento del file
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Funzione per gestire il submit del form
    const handleSubmit = (event) => {
        event.preventDefault();

        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            DocumentStoreAPI.InsertNewDocument(formData, currentUser.xsrfToken).then((res) => console.log(res)).catch((err) => console.log(err))
        } else {
            console.log('Nessun file selezionato');
        }
    };

    useEffect(() => {
        if (!load) {
            DocumentStoreAPI.GetDocuments(new DocumentMetadataFilter(DocumentCategory.Curriculum, 1), null)
                .then(r => setFileList(r)).catch((e) => console.log(e))
        }
    }, [load]);

    console.log(fileList)

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="file">Seleziona un file:</label>
                <input type="file" id="file" onChange={handleFileChange}/>
            </div>
            <button type="submit">Carica</button>
        </form>
    );
};

export default FileUploadForm;
