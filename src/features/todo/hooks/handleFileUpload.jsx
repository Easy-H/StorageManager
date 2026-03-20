import * as XLSX from 'xlsx';
import * as DocumentPicker from 'expo-document-picker';

const handleFileUpload = async () => {
  const res = await DocumentPicker.getDocumentAsync({ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  if (res.type === 'success') {
    const reader = new FileReader();
    const file = await fetch(res.uri).then(r => r.blob());
    
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      
      // 여기서 json 데이터를 Todo 형식으로 변환하여 저장
      console.log("업로드된 데이터:", json);
    };
    reader.readAsArrayBuffer(file);
  }
};