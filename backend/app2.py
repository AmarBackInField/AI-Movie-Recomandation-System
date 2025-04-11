from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import uvicorn
import os
import re
from langchain_google_genai import ChatGoogleGenerativeAI  # ✅ Corrected Import
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from src.retrieval_generation import generation
from src.ingest import ingestdata
import ast

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=GOOGLE_API_KEY)

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def generate_related_terms(user_input):
    print("Calling generate_related_terms Function ")
    """Generate related search terms based on user input"""
    fallback_prompt = ChatPromptTemplate.from_template("""
    You are a movie expert. Generate 5 alternative search phrases based on this request: {query}
    
    The phrases should:
    - Capture different aspects of the request
    - Include similar themes/genres
    - Use different keywords but maintain the same intent
    - Be specific enough to find relevant movies
    
    Return only a Python list of 5 strings, like: ["action movies with anti-hero", "revenge thrillers", "dark superhero films"]
    No other text or explanation.
    """)
    
    chain = fallback_prompt | llm | StrOutputParser()
    try:
        result = chain.invoke({"query": user_input})
        print(result)
        return ast.literal_eval(result)
    except:
        # Fallback to simple related terms if parsing fails
        return [
            f"{user_input} similar movies",
            f"movies like {user_input}",
            f"best {user_input} movies",
            f"{user_input} recommendations",
            f"{user_input} must watch"
        ]
def get_movie_results(query, chain):
    """Get movie results for a single query"""
    result = chain.invoke(query)
    pattern = r"Movie:\s*(.*?)\s*Genres:\s*(.*?)\s*Language:\s*(.*?)\s*URL:\s*(https?://\S+)\s*Poster:\s*(https?://\S+)\s*Download:\s*(https?://\S+)"
    matches = re.findall(pattern, result)
    return [
        {"name": name.strip(), "genres": genres.strip(), "language": language.strip(), 
         "url": url.strip(), "poster": poster.strip(), "download": download.strip()}
        for name, genres, language, url, poster, download in matches
    ]

# Initialize the model once
vstore = ingestdata("done")
chain = generation(vstore)

class QueryInput(BaseModel):
    query: str

@app.post("/recommend")
async def recommend_movies(data: QueryInput):
    user_input = data.query
    if not user_input:
        return {"error": "Please provide a query"}
    movies = get_movie_results(user_input, chain)
    if len(movies) < 10:  
                    additional_terms = generate_related_terms(user_input)
                    seen_movies = {movie["name"] for movie in movies}  # Track unique movies
                    for term in additional_terms:
                        if len(movies) >= 10:
                            break    
                        additional_results = get_movie_results(term,chain)
                        # Add only new, unique movies
                        for movie in additional_results:
                            if movie["name"] not in seen_movies and len(movies) < 10:
                                movies.append(movie)
                                seen_movies.add(movie["name"])

    return {"movies": movies}

if __name__ == "__main__":
    HOST = os.getenv("HOST", "0.0.0.0")  # Default to localhost
    PORT = int(os.getenv("PORT", 8000))  # Default to 8000
    TIMEOUT = int(os.getenv("TIMEOUT_KEEP_ALIVE", 60))  # Default timeout

    uvicorn.run(app, host=HOST, port=PORT, timeout_keep_alive=TIMEOUT)