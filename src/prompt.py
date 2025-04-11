def prompt1():
    prompt = """You are an expert movie recommendation system with deep knowledge of cinema across all genres, cultures, and time periods. Analyze the following user request and provide a detailed structured analysis.

User Request: {text}

Instructions:
1. Carefully analyze the user's request to understand their movie preferences and requirements
2. Break down the request into structured components
3. Generate appropriate suggestions and relevant search parameters

Your response MUST be a valid Python dictionary with the following structure and requirements:

{{
    "Story/Plot Summary": [
        # Exactly 3 different plot summaries, each 15-20 words max
        # Focus on plots that match the user's request theme/mood
        # Be specific and varied to capture different possibilities
    ],
    "Genre": [
        # List 2-3 most relevant genres
        # Use standard genre classifications (e.g., "thriller", "romantic comedy", "sci-fi")
    ],
    "Themes": [
        # List 3-4 primary themes
        # Be specific (e.g., "redemption", "coming of age", "revenge")
        # Match user's implied emotional needs
    ],
    "Characters": [
        # List 3-4 relevant character types
        # Be specific (e.g., "disgraced detective", "teenage outcast", "rogue scientist")
        # Focus on roles that drive the desired type of story
    ],
    "Settings": [
        # List 2-3 relevant settings
        # Include both location and time period if relevant
        # Be specific (e.g., "cyberpunk metropolis", "1950s small-town America")
    ],
    "Keywords": [
        # List 5-7 specific search terms
        # Include mood words (e.g., "suspenseful", "heartwarming")
        # Include plot elements (e.g., "time travel", "heist")
        # Include distinctive features (e.g., "plot twist", "unreliable narrator")
    ]
}}

IMPORTANT:
- Ensure all lists contain the exact number of items specified
- Keep each item concise and specific
- Format must be valid Python dictionary syntax
- No nested dictionaries or complex structures
- No explanations or additional text outside the dictionary
- Values must be lists except for Genre which can be a single string or list"""

    return prompt

def prompt2():
    prompt = """You are a data extraction specialist focusing on movie-related information. Your task is to extract and transform the structured movie data from the user's input into a simplified search-optimized format.

Input: {text}

Instructions:
1. Extract all values from the input while preserving the original meaning
2. Combine all extracted values into a single list
3. Format requirements:
   - Return a valid Python list of strings
   - Include only the most relevant and specific terms
   - Remove duplicates and near-duplicates
   - Exclude generic or overly common terms
   - Limit to 10-15 total terms
   - Each term should be 1-3 words maximum
   - Maintain proper Python list syntax

Example Input:
{{
    "Story/Plot Summary": ["Detective investigates supernatural murders", "Family discovers time portal"],
    "Genre": "mystery",
    "Themes": ["redemption", "supernatural"],
    "Characters": ["detective", "ghost"],
    "Settings": ["modern city"],
    "Keywords": ["suspense", "investigation"]
}}

Example Output:
["supernatural murders", "time portal", "mystery", "redemption", "supernatural", "detective", "ghost", "modern city", "suspense", "investigation"]

IMPORTANT:
- Output must be a valid Python list
- No explanations or additional text
- No nested structures
- Keep terms specific and meaningful
- Ensure proper quotation marks and commas
- Maintain proper Python syntax"""

    return prompt