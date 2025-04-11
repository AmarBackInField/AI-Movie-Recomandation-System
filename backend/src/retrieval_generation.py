import logging
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_google_genai import ChatGoogleGenerativeAI  # ✅ Corrected Import
import os
from src.ingest import ingestdata

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("generation.log"), logging.StreamHandler()]
)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def generation(vstore):
    try:
        logging.info("Starting generation process.")
        
        retriever = vstore.as_retriever(search_kwargs={"k": 30})
        logging.info("Retriever created successfully.")
        
        MOVIE_BOT_TEMPLATE = """
        You are an expert movie recommendation system that helps users find the perfect movies to watch.  
        Analyze the user input carefully, considering their preferred genres, languages, and other preferences.  
        Your task is to suggest **exactly 10** movies based on the available data. If fewer than 10 movies are retrieved, provide the best matches and fill the remaining spots with similar movies from your knowledge.  

        ### **Instructions for Recommendations**  
        For each recommended movie, provide the following details:  
        1. **Movie Name**  
        2. **Genres**  
        3. **Language**  
        4. **Movie URL**  
        5. **Movie Poster URL**  
        6. **Download Link**  

        ---

        ### **CONTEXT:**  
        {context}  

        ### **USER QUERY:**  
        {question}  

        ---

        ### **MOVIE RECOMMENDATIONS:**  
        *Please provide exactly 10 movies in the following format:*  

        Movie: **[Movie Name]**  
        Genres: **[Genres]**  
        Language: **[Language]**  
        URL: [Movie URL]  
        Poster: [Movie Poster URL]  
        Download: [Downloading Link]  

        *If fewer than 10 movies are retrieved, supplement the list with similar well-known movies.*  

        """


        prompt = ChatPromptTemplate.from_template(MOVIE_BOT_TEMPLATE)
        logging.info("Prompt template created successfully.")

        # ✅ Use LangChain's Gemini
        llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=GOOGLE_API_KEY)
        logging.info("Gemini LLM initialized successfully.")
        
        # ✅ Ensure context is correctly passed
        chain = (
            {"context": retriever, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )
        logging.info("Chain created successfully.")
        
        return chain
    except Exception as e:
        logging.error("An error occurred during the generation process: %s", e, exc_info=True)
        raise

# if __name__ == '__main__':
#     try:
#         logging.info("Starting main execution.")
        
#         # Load VectorStore
#         vstore = ingestdata("done")
#         logging.info("VectorStore loaded successfully.")
        
#         # Generate recommendations
#         chain = generation(vstore)
#         logging.info("Chain invoked successfully.")
        
#         # Query for recommendations
#         query = "I need a course on web development with JavaScript and React"
#         logging.info(f"Performing recommendation query: {query}")
        
#         result = chain.invoke(query)
#         logging.info("Received result from chain.")
        
#         # Print the result
#         logging.info(f"Recommendation result: {result}")
#         print(result)
#     except Exception as e:
#         logging.error("An error occurred in the main execution: %s", e, exc_info=True)
