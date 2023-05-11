import os
import tempfile
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse
from html import escape
from main import create_qa_object, get_answer, get_source_documents
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def get_index_html():
    try:
        return FileResponse("static/index.html")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")

@app.post("/ask")
async def ask(api_key: str = Form(...), file: UploadFile = File(...), query: str = Form(...), chain_type: str = Form("stuff"), k: int = Form(2)):
    os.environ["OPENAI_API_KEY"] = api_key

    # Crea un archivo temporal y guarda el contenido del archivo subido
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(await file.read())
        temp_file_path = temp_file.name

    # Utiliza el archivo temporal en las funciones
    qa = create_qa_object(temp_file_path, chain_type, k)
    answer = get_answer(qa, query)
    source = get_source_documents(qa, query)

    # Elimina el archivo temporal después de su uso
    os.remove(temp_file_path)

    escaped_source = escape(source)

    return {"answer": answer, "source": escaped_source}
