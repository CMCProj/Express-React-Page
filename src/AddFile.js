import React, { useState } from 'react';
import API from './API';

function AddFile(props) {
    const [constName, setConstName] = useState(''); //공사명 state
    const [bidFile, setBidFile] = useState(null);   //공내역 파일 state

    const submitHandler = (e) => {
        e.preventDefault(); // submit 시 페이지 리로드 막기

        if(!constName){
            return alert("공사명을 입력해주세요!");
        }
        else if(!bidFile){
            return alert("공내역서를 업로드해주세요!");
        }
        else{
            const formData = new FormData();

            formData.append('file', bidFile);   //공내역 파일 append

            const value = [{
                constName: constName,
            }]

            const blob = new Blob([JSON.stringify(value)], {type: 'application/json'}); //공사명 Json으로 append

            formData.append('data', blob);

            API.post('/post/add_file', formData, {headers: { "Content-Type": "multipart/form-data" }})
            .then((res) => {
                if(res.data){
                    return alert(`${constName} 공내역서 업로드 완료`);
                }
                else{
                    return alert(`${constName} 공내역서 업로드 실패`);
                }
            });
        }
    }

    return (
        <form onSubmit={submitHandler} encType='multipart/form-data'>
            <p>공사명 &nbsp; <input type='text' name='constName' value={constName} onChange={(e) => {setConstName(e.target.value);}}></input></p>
            <p>공내역 파일 <br/> <input type='file' accept='.BID, .bid' name='bidFile' onChange={(e) => {e.target.files = null; setBidFile(e.target.files[0]);}}></input></p>
            <p><button type='submit'>업로드</button></p>
        </form>
    );
}

export default AddFile;