import pandas as pd
import logging
from langchain_core.documents import Document

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("dataconverter.log"), logging.StreamHandler()]
)

def dataconveter():
    try:
        logging.info("Starting data conversion process.")
        
        # Load the data
        product_data = pd.read_csv(r"final2.csv")
        logging.info("Data loaded successfully from 'data\\Movies Data.csv'.")
        
        # Select relevant columns
        columns = ['Movie Name', 'Movie URL', 'Movie Poster', 'Genres',
       'Language', 'Downloading Link', 'Tags']
        data = product_data[columns]
        print(data.head())
        logging.info("Selected relevant columns: %s", columns)
        
        
        # Convert data to product_list
        product_list = []
        for index, row in data.iterrows():
            obj = {
                'movie_name': row['Movie Name'],
                'movie_url': row['Movie URL'],
                'movie_poster': row['Movie Poster'],
                'genres': row['Genres'],
                'language': row['Language'],
                'downloading_link': row['Downloading Link'],
                'tags': row['Tags']
            }
            product_list.append(obj)
        logging.info("Product list created with %d entries.", len(product_list))
        
        # Convert to Document objects
        docs = []
        for entry in product_list:
            metadata = {
                'movie_name': entry['movie_name'],
                'movie_url': entry['movie_url'],
                'movie_poster': entry['movie_poster'],
                'genres': entry['genres'],
                'language': entry['language'],
                'downloading_link': entry['downloading_link']
            }
            doc = Document(page_content=entry['tags'], metadata=metadata)
            docs.append(doc)
        logging.info("Document objects created successfully with %d entries.", len(docs))
        
        logging.info("Data conversion process completed successfully.")
        return docs

    except Exception as e:
        logging.error("An error occurred during the data conversion process: %s", e, exc_info=True)
        raise
