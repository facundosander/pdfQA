from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

def create_qa_object(file, chain_type, k):
    # load document
    loader = PyPDFLoader(file)
    documents = loader.load()

    # split the documents into chunks
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    texts = text_splitter.split_documents(documents)

    # select which embeddings we want to use
    embeddings = OpenAIEmbeddings()

    # create the vectorestore to use as the index
    db = Chroma.from_documents(texts, embeddings)

    # expose this index in a retriever interface
    retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": k})

    # create a chain to answer questions
    qa = RetrievalQA.from_chain_type(
        llm=OpenAI(), chain_type=chain_type, retriever=retriever, return_source_documents=True)

    return qa

def get_answer(qa, query):
    result = qa({"query": query})
    return result["result"]

def get_source_documents(qa, query):
    result = qa({"query": query})
    source_documents = result["source_documents"]
    source_info = []
    for doc in source_documents:
        source_info.append(f"{doc.page_content[:700]}...")
    source_text = " | ".join(source_info)
    return source_text

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
