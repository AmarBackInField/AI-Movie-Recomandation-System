import logging
from langchain_astradb import AstraDBVectorStore
# from langchain_openai import OpenAIEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
import os
import pandas as pd
from src.data_converter import dataconveter

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("ingestdata.log"), logging.StreamHandler()]
)

load_dotenv()

# OPENAI_API_KEY=os.getenv("OPENAI_API_KEY")
ASTRA_DB_API_ENDPOINT=os.getenv("ASTRA_DB_API_ENDPOINT")
ASTRA_DB_APPLICATION_TOKEN=os.getenv("ASTRA_DB_APPLICATION_TOKEN")
ASTRA_DB_KEYSPACE=os.getenv("ASTRA_DB_KEYSPACE")

# embedding = OpenAIEmbeddings(api_key=OPENAI_API_KEY)
embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

def ingestdata(status):
    try:
        logging.info("Starting data ingestion process.")
        
        # Initialize the AstraDB Vector Store
        vstore = AstraDBVectorStore(
            embedding=embedding,
            collection_name="movie_recommandation_system",
            api_endpoint=ASTRA_DB_API_ENDPOINT,
            token=ASTRA_DB_APPLICATION_TOKEN,
            namespace=ASTRA_DB_KEYSPACE,
        )
        logging.info("AstraDB VectorStore initialized successfully.")
        
        storage = status
        
        if storage is None:
            logging.info("Storage status is None, proceeding with data conversion.")
            docs = dataconveter()
            logging.info("Data converted successfully, adding documents to VectorStore.")
            inserted_ids = vstore.add_documents(docs)
            logging.info("Documents added to VectorStore.")
            return vstore, inserted_ids
        else:
            logging.info("Returning existing VectorStore.")
            return vstore
    except Exception as e:
        logging.error("An error occurred during the data ingestion process: %s", e, exc_info=True)
        raise

# if __name__ == '__main__':
#     try:
#         vstore, inserted_ids = ingestdata(None)
#         logging.info(f"\nInserted {len(inserted_ids)} documents.")
        
#         # Perform similarity search
#         query = "I need a course on web development with JavaScript and React"
#         logging.info(f"Performing similarity search for query: {query}")
#         results = vstore.similarity_search(query)
        
#         # Print results
#         logging.info(f"Found {len(results)} results.")
#         for res in results:
#             logging.info(f"* {res.page_content} [{res.metadata}]")
#     except Exception as e:
#         logging.error("An error occurred in the main execution: %s", e, exc_info=True)
